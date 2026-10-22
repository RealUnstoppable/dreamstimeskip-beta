#!/usr/bin/env node

/**
 * Ecosystem Site Health & Status Checker
 * 
 * Performs a comprehensive, swift check over the entire site to ensure:
 * 1. HTML structure and page integrity across all pages
 * 2. Static asset resolution (CSS, JS, images, media)
 * 3. JavaScript syntax validation on core runtime scripts
 * 4. Swift HTTP serving responsiveness (smoke test)
 * 
 * Then:
 * - Computes ecosystem status (Operational, Maintenance, or Offline)
 * - Updates the "Last check: [Date]" timestamp in index.html to the current date
 * - If errors are discovered, updates the status badge and lists specific failing systems/pages
 * - Saves status-report.json
 * - Optionally commits and pushes changes to GitHub (--commit, --push)
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Ecosystem Systems Definition
export const ECOSYSTEM_SYSTEMS = [
  {
    id: 'hub',
    name: 'Unstoppable Hub',
    primaryPage: 'index.html',
    pages: ['index.html'],
    scripts: ['js/script.js', 'js/theme-loader.js', 'js/fotd-data.js'],
    styles: ['css/style.css', 'css/themes.css']
  },
  {
    id: 'dreamstimeskip',
    name: 'Dreams TimeSkip',
    primaryPage: 'dreamstimeskip.html',
    pages: ['dreamstimeskip.html', 'dreams-timeskip-first-look.html', 'new-dts.html'],
    scripts: ['js/script.js'],
    styles: ['css/style.css']
  },
  {
    id: 'medixly',
    name: 'Medixly Music',
    primaryPage: 'medixly.html',
    pages: ['medixly.html', 'medixly-artists.html', 'medixly-hits.html'],
    scripts: ['js/medixly.js', 'js/song-data.js', 'js/audio-engine.js'],
    styles: ['css/style.css']
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable Gaming',
    primaryPage: 'unstoppable.html',
    pages: ['unstoppable.html', 'the-philosophy-behind-unstoppable-more-than-a-brand.html'],
    scripts: [],
    styles: ['css/style.css']
  },
  {
    id: 'fotd',
    name: 'Fact of the Day',
    primaryPage: 'fotd.html',
    pages: ['fotd.html'],
    scripts: ['js/fotd-data.js'],
    styles: ['css/style.css']
  },
  {
    id: 'shop',
    name: 'Unstoppable Shop',
    primaryPage: 'shop.html',
    pages: ['shop.html', 'cart.html', 'checkout.html', 'checkout-premium.html', 'checkout-ultimate.html'],
    scripts: ['js/shop.js', 'js/cart.js', 'js/products-data.js', 'js/cart-utils.js'],
    styles: ['css/style.css']
  },
  {
    id: 'auth',
    name: 'Accounts & Auth',
    primaryPage: 'account.html',
    pages: ['account.html', 'sign in beta.html', 'memberships.html'],
    scripts: ['js/auth.js', 'js/account.js'],
    styles: ['css/style.css']
  },
  {
    id: 'tracker',
    name: 'ezManage Tracker',
    primaryPage: 'tracker.html',
    pages: ['tracker.html'],
    scripts: [],
    styles: ['css/style.css', 'css/themes.css']
  },
  {
    id: 'support',
    name: 'Support & Legal',
    primaryPage: 'support.html',
    pages: ['support.html', 'terms.html', 'privacy.html', 'portfolio.html'],
    scripts: [],
    styles: ['css/style.css']
  },
  {
    id: 'blog',
    name: 'Community Blog',
    primaryPage: 'blog.html',
    pages: ['blog.html'],
    scripts: ['js/blog-comments.js'],
    styles: ['css/style.css']
  }
];

/**
 * Format a Date object into "MMM D, YYYY" (e.g. "Oct 13, 2026")
 */
export function formatCurrentDate(date = new Date()) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Check if a reference should be ignored (external URLs, fragments, JS calls, templates)
 */
function shouldIgnoreReference(ref) {
  if (!ref || typeof ref !== 'string') return true;
  const trimmed = ref.trim();
  return (
    trimmed === '' ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('minecraft:') ||
    trimmed.includes('${') ||
    trimmed.includes('{{')
  );
}

/**
 * Resolves a local path to an absolute filesystem path
 */
function resolveLocalPath(rootDir, currentFilePath, ref) {
  const cleanRef = ref.split('?')[0].split('#')[0];
  if (cleanRef.startsWith('/')) {
    return path.join(rootDir, cleanRef.substring(1));
  }
  const currentDir = path.dirname(currentFilePath);
  return path.resolve(currentDir, cleanRef);
}

/**
 * Checks single page integrity: structure, linked assets, internal links
 */
export function checkPageIntegrity(rootDir, relativePagePath) {
  const fullPath = path.join(rootDir, relativePagePath);
  const issues = [];

  if (!fs.existsSync(fullPath)) {
    return {
      page: relativePagePath,
      exists: false,
      issues: [`Page file does not exist: ${relativePagePath}`]
    };
  }

  const stat = fs.statSync(fullPath);
  if (stat.size < 50) {
    issues.push(`Page file is suspiciously empty (${stat.size} bytes)`);
  }

  let content = '';
  try {
    content = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    issues.push(`Unable to read page file: ${err.message}`);
    return { page: relativePagePath, exists: true, issues };
  }

  // Basic HTML structure checks
  const lower = content.toLowerCase();
  if (!lower.includes('<html')) {
    issues.push('Missing <html> root element');
  }
  if (!lower.includes('<body')) {
    issues.push('Missing <body> element');
  }

  // Check linked assets (scripts, stylesheets, images, audio/video sources)
  const assetRegex = /(?:src|href)=["']([^"']+)["']/gi;
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    const ref = match[1];
    if (shouldIgnoreReference(ref)) continue;

    const resolved = resolveLocalPath(rootDir, fullPath, ref);
    if (!fs.existsSync(resolved)) {
      // Determine what kind of asset it is
      const ext = path.extname(resolved).toLowerCase();
      const isCritical = ['.js', '.css'].includes(ext);
      issues.push(`Missing local ${isCritical ? 'critical asset' : 'asset'}: "${ref}" in ${relativePagePath}`);
    }
  }

  return {
    page: relativePagePath,
    exists: true,
    size: stat.size,
    issues
  };
}

/**
 * Validates JavaScript syntax for a file using Node's syntax checker
 */
export function checkScriptSyntax(rootDir, relativeScriptPath) {
  const fullPath = path.join(rootDir, relativeScriptPath);
  if (!fs.existsSync(fullPath)) {
    return {
      script: relativeScriptPath,
      exists: false,
      valid: false,
      error: 'File does not exist'
    };
  }

  const result = spawnSync(process.execPath, ['--check', fullPath], {
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    const errorMsg = (result.stderr || result.stdout || 'Syntax check failed').trim();
    return {
      script: relativeScriptPath,
      exists: true,
      valid: false,
      error: errorMsg
    };
  }

  return {
    script: relativeScriptPath,
    exists: true,
    valid: true
  };
}

/**
 * Swift local HTTP smoke test
 */
export async function testLocalHttp(rootDir, pagePaths = ['index.html']) {
  return new Promise((resolve) => {
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };

    let server;
    try {
      server = http.createServer((req, res) => {
        let reqPath = req.url.split('?')[0];
        if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
        const filePath = path.join(rootDir, reqPath);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
          fs.createReadStream(filePath).pipe(res);
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      });

      server.on('error', (err) => {
        // If server cannot bind (e.g. restricted sandbox), resolve gracefully with skipped
        resolve({ skipped: true, reason: err.message, results: [] });
      });

      server.listen(0, '127.0.0.1', async () => {
        const port = server.address().port;
        const results = [];
        let socketBlocked = false;

        for (const page of pagePaths) {
          if (socketBlocked) break;
          const url = `http://127.0.0.1:${port}/${page}`;
          try {
            const status = await new Promise((resHttp, rejHttp) => {
              const request = http.get(url, (response) => {
                resHttp(response.statusCode);
              });
              request.on('error', rejHttp);
              request.setTimeout(1000, () => {
                request.destroy();
                rejHttp(new Error('Timeout'));
              });
            });

            results.push({ page, status, ok: status === 200 });
          } catch (err) {
            if (err.code === 'EPERM' || err.message.includes('EPERM')) {
              socketBlocked = true;
            } else {
              results.push({ page, status: 0, ok: false, error: err.message });
            }
          }
        }

        server.close(() => {
          if (socketBlocked) {
            resolve({ skipped: true, reason: 'Socket loopback restricted by environment sandbox', results: [] });
          } else {
            resolve({ skipped: false, results });
          }
        });
      });
    } catch (err) {
      resolve({ skipped: true, reason: err.message, results: [] });
    }
  });
}

/**
 * Performs full ecosystem check
 */
export async function performSiteChecks(rootDir = ROOT_DIR, options = {}) {
  const startTime = Date.now();
  const systemResults = [];
  const allIssues = [];

  // 1. Discover all root HTML pages
  const allRootHtmlFiles = fs.readdirSync(rootDir)
    .filter(f => f.endsWith('.html') && !f.includes(' 2') && !f.startsWith('.'));

  // 2. Check each defined system
  for (const system of ECOSYSTEM_SYSTEMS) {
    const systemIssues = [];
    let primaryPageOperational = true;

    // Check primary page
    const primaryCheck = checkPageIntegrity(rootDir, system.primaryPage);
    if (!primaryCheck.exists || primaryCheck.issues.length > 0) {
      if (!primaryCheck.exists) primaryPageOperational = false;
      systemIssues.push(...primaryCheck.issues);
    }

    // Check secondary pages
    for (const page of system.pages) {
      if (page === system.primaryPage) continue;
      const pageCheck = checkPageIntegrity(rootDir, page);
      if (pageCheck.issues.length > 0) {
        systemIssues.push(...pageCheck.issues);
      }
    }

    // Check associated scripts syntax
    if (system.scripts && system.scripts.length > 0) {
      for (const script of system.scripts) {
        const syntaxCheck = checkScriptSyntax(rootDir, script);
        if (!syntaxCheck.valid) {
          primaryPageOperational = false;
          systemIssues.push(`Script syntax error in ${script}: ${syntaxCheck.error.split('\n')[0]}`);
        }
      }
    }

    // Determine individual system status
    let status = 'Operational';
    if (!primaryPageOperational) {
      status = 'Offline';
    } else if (systemIssues.length > 0) {
      status = 'Maintenance';
    }

    if (systemIssues.length > 0) {
      allIssues.push({ system: system.name, status, issues: systemIssues });
    }

    systemResults.push({
      id: system.id,
      name: system.name,
      primaryPage: system.primaryPage,
      status,
      issues: systemIssues
    });
  }

  // 3. Swift HTTP Smoke Test on primary system pages
  if (!options.skipHttp) {
    const primaryPages = ECOSYSTEM_SYSTEMS.map(s => s.primaryPage);
    try {
      const httpTestOutput = await testLocalHttp(rootDir, primaryPages);
      if (!httpTestOutput.skipped && Array.isArray(httpTestOutput.results)) {
        for (const res of httpTestOutput.results) {
          if (!res.ok) {
            const sys = systemResults.find(s => s.primaryPage === res.page);
            if (sys) {
              sys.status = 'Offline';
              sys.issues.push(`HTTP smoke test failed with status ${res.status}`);
            }
          }
        }
      }
    } catch (httpErr) {
      console.warn('HTTP smoke test skipped or failed:', httpErr.message);
    }
  }

  // 4. Calculate Overall Status
  const offlineCount = systemResults.filter(s => s.status === 'Offline').length;
  const maintenanceCount = systemResults.filter(s => s.status === 'Maintenance').length;
  const hubFailed = systemResults.find(s => s.id === 'hub')?.status !== 'Operational';

  let overallStatus = 'Operational';
  let badgeClass = 'online';

  if (offlineCount >= 3 || hubFailed) {
    overallStatus = 'Offline';
    badgeClass = 'offline';
  } else if (offlineCount > 0 || maintenanceCount > 0) {
    overallStatus = 'Maintenance';
    badgeClass = 'maintenance';
  }

  const durationMs = Date.now() - startTime;
  const dateFormatted = formatCurrentDate(options.date ? new Date(options.date) : new Date());

  return {
    timestamp: new Date().toISOString(),
    dateFormatted,
    overallStatus,
    badgeClass,
    systems: systemResults,
    offlineSystems: systemResults.filter(s => s.status !== 'Operational'),
    totalSystems: systemResults.length,
    operationalCount: systemResults.filter(s => s.status === 'Operational').length,
    offlineCount,
    maintenanceCount,
    durationMs,
    allDiscoveredPagesCount: allRootHtmlFiles.length
  };
}

/**
 * Updates index.html with the current status and date
 */
export function updateIndexHtml(rootDir = ROOT_DIR, statusResult) {
  const indexPath = path.join(rootDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error(`index.html not found at: ${indexPath}`);
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  // Match the entire bento-status container
  // <div class="bento-card reveal" id="bento-status"> ... <p>Last check: ... </p> </div>
  const bentoStatusRegex = /(<div\s+class="bento-card\s+reveal"\s+id="bento-status">)[\s\S]*?(<p[^>]*>\s*Last check:[\s\S]*?<\/p>\s*<\/div>)/i;

  if (!bentoStatusRegex.test(html)) {
    throw new Error('Could not find #bento-status container in index.html');
  }

  let issuesHtml = '';
  if (statusResult.offlineSystems.length > 0) {
    const items = statusResult.offlineSystems.map(sys => {
      const badge = sys.status === 'Offline' ? 'offline' : 'maintenance';
      const label = sys.status === 'Offline' ? 'Offline' : 'Maintenance';
      return `                    <div class="status-item sub-status">\n                        <span>${sys.name}</span>\n                        <span class="status-indicator ${badge}">${label}</span>\n                    </div>`;
    }).join('\n');

    issuesHtml = `\n                <div id="status-issues-list" class="status-issues-list">\n${items}\n                </div>`;
  } else {
    issuesHtml = `\n                <div id="status-issues-list" class="status-issues-list" style="display: none;"></div>`;
  }

  const newBentoContent = `$1
                    <h4>Ecosystem Status</h4>
                    <div class="status-item">
                        <span>All Systems</span>
                        <span class="status-indicator ${statusResult.badgeClass}">${statusResult.overallStatus}</span>
                    </div>${issuesHtml}
                    <p>Last check: ${statusResult.dateFormatted}</p>
                </div>`;

  const updatedHtml = html.replace(bentoStatusRegex, newBentoContent);
  fs.writeFileSync(indexPath, updatedHtml, 'utf8');

  return {
    indexPath,
    updated: true,
    dateFormatted: statusResult.dateFormatted,
    overallStatus: statusResult.overallStatus
  };
}

/**
 * Commits changes to Git and optionally pushes to remote
 */
export function commitToGithub(rootDir = ROOT_DIR, statusResult, options = {}) {
  const filesToStage = ['index.html', 'status-report.json'];

  // Check if anything changed
  const diffCheck = spawnSync('git', ['status', '--porcelain', ...filesToStage], {
    cwd: rootDir,
    encoding: 'utf8'
  });

  if (!diffCheck.stdout || diffCheck.stdout.trim() === '') {
    console.log('ℹ️  No changes to commit in index.html or status-report.json');
    return { committed: false, reason: 'No changes' };
  }

  // Ensure git user is configured
  const gitName = spawnSync('git', ['config', 'user.name'], { cwd: rootDir, encoding: 'utf8' }).stdout.trim();
  if (!gitName) {
    spawnSync('git', ['config', 'user.name', 'github-actions[bot]'], { cwd: rootDir });
    spawnSync('git', ['config', 'user.email', 'github-actions[bot]@users.noreply.github.com'], { cwd: rootDir });
  }

  // Stage files
  spawnSync('git', ['add', ...filesToStage], { cwd: rootDir, stdio: 'inherit' });

  // Build commit message
  let commitMsg = `chore(status): ecosystem health check - ${statusResult.overallStatus} [${statusResult.dateFormatted}]`;
  if (statusResult.offlineSystems.length > 0) {
    const list = statusResult.offlineSystems.map(s => s.name).join(', ');
    commitMsg = `chore(status): ecosystem check - ${statusResult.overallStatus} (${list}) [${statusResult.dateFormatted}]`;
  }

  // Commit
  const commitRes = spawnSync('git', ['commit', '-m', commitMsg], {
    cwd: rootDir,
    encoding: 'utf8'
  });

  if (commitRes.status !== 0) {
    console.error('❌ Failed to commit:', commitRes.stderr);
    return { committed: false, error: commitRes.stderr };
  }

  console.log(`✅ Committed: "${commitMsg}"`);

  // Push if requested
  if (options.push) {
    console.log('🚀 Pushing to GitHub...');
    const pushRes = spawnSync('git', ['push'], {
      cwd: rootDir,
      encoding: 'utf8'
    });

    if (pushRes.status !== 0) {
      console.error('❌ Failed to push to remote:', pushRes.stderr);
      return { committed: true, pushed: false, error: pushRes.stderr };
    }
    console.log('✅ Pushed successfully to GitHub!');
    return { committed: true, pushed: true };
  }

  return { committed: true, pushed: false };
}

/**
 * Main Execution Function
 */
export async function runSiteChecker(options = {}) {
  console.log('\n🔍 ========================================================');
  console.log('   UNSTOPPABLE ECOSYSTEM - SITE HEALTH & STATUS CHECKER');
  console.log('========================================================\n');

  const rootDir = options.rootDir || ROOT_DIR;
  const statusResult = await performSiteChecks(rootDir, options);

  console.log(`⏱️  Check completed in ${statusResult.durationMs}ms`);
  console.log(`📅 Date: ${statusResult.dateFormatted}`);
  console.log(`📊 Ecosystem Status: ${statusResult.overallStatus.toUpperCase()} (${statusResult.operationalCount}/${statusResult.totalSystems} systems operational)`);

  if (statusResult.offlineSystems.length > 0) {
    console.log('\n⚠️  Systems with issues:');
    for (const sys of statusResult.offlineSystems) {
      console.log(`   - [${sys.status.toUpperCase()}] ${sys.name}:`);
      sys.issues.forEach(iss => console.log(`       * ${iss}`));
    }
  } else {
    console.log('✨ All systems operational and healthy!');
  }

  // Write status report json
  const reportPath = path.join(rootDir, 'status-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(statusResult, null, 2), 'utf8');
  console.log(`📄 Status report written to: ${path.relative(rootDir, reportPath)}`);

  // Update index.html unless dry-run
  if (!options.dryRun) {
    updateIndexHtml(rootDir, statusResult);
    console.log(`📝 index.html updated: Last check: ${statusResult.dateFormatted} [${statusResult.overallStatus}]`);
  } else {
    console.log('🔍 Dry run enabled: skipped updating index.html');
  }

  // Commit & push if requested
  if (options.commit) {
    commitToGithub(rootDir, statusResult, { push: options.push });
  }

  console.log('\n✅ Checker run complete.\n');
  return statusResult;
}

// CLI Execution Support
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const options = {
    commit: args.includes('--commit'),
    push: args.includes('--push'),
    dryRun: args.includes('--dry-run'),
    skipHttp: args.includes('--skip-http')
  };

  const dateArg = args.find(a => a.startsWith('--date='));
  if (dateArg) {
    options.date = dateArg.split('=')[1];
  }

  runSiteChecker(options).catch(err => {
    console.error('Fatal error running site checker:', err);
    process.exit(1);
  });
}
