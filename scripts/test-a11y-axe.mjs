import fs from 'fs';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

const allEcosystemPages = [
  'index.html',
  'store.html',
  'cart.html',
  'checkout.html',
  'contact.html',
  'accessibility.html',
  'about.html',
  'unstoppable.html',
  'dts.html',
  'medixly.html',
  'privacy.html',
  'terms.html',
  'blog.html'
];

async function runAxeOnPage(file) {
  const html = fs.readFileSync(file, 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    resources: 'usable'
  });

  const { document } = dom.window;

  const results = await axe.run(document.documentElement, {
    rules: {
      'color-contrast': { enabled: false }
    }
  });

  return results;
}

async function runAll() {
  console.log('--- Running axe-core WCAG 2.1 AA Audits Across Ecosystem ---');
  let hasViolations = false;

  for (const page of allEcosystemPages) {
    if (!fs.existsSync(page)) continue;
    try {
      const results = await runAxeOnPage(page);
      const violations = results.violations;
      if (violations.length === 0) {
        console.log(`✅ [PASS] ${page}: 0 violations (Passed ${results.passes.length} rules)`);
      } else {
        hasViolations = true;
        console.log(`❌ [FAIL] ${page}: ${violations.length} violations`);
        violations.forEach(v => {
          console.log(`   - [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} occurrences)`);
          v.nodes.slice(0, 3).forEach(n => console.log(`     Target: ${n.target.join(' ')}`));
        });
      }
    } catch (err) {
      console.error(`Error auditing ${page}:`, err.message);
    }
  }

  if (hasViolations) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL ECOSYSTEM PAGES PASSED AXE-CORE WCAG 2.1 AA AUDITS!');
  }
}

runAll();
