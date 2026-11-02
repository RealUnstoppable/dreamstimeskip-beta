#!/usr/bin/env node
// scripts/version-manager.js
// Centralized Version Manager for Medixly (macOS / Web / Build Configs)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CONFIG_PATH = path.join(ROOT_DIR, 'config/version.json');
const PACKAGE_PATH = path.join(ROOT_DIR, 'package.json');
const ELECTRON_BUILDER_PATH = path.join(ROOT_DIR, 'electron-builder.yml');
const MAC_PLIST_PATH = path.join(ROOT_DIR, 'desktop/build/Info.plist');
const MEDIXLY_HTML_PATH = path.join(ROOT_DIR, 'medixly.html');
const JS_VERSION_PATH = path.join(ROOT_DIR, 'js/version.js');

/**
 * Loads current version configuration
 */
export function getVersionConfig() {
    if (fs.existsSync(CONFIG_PATH)) {
        try {
            return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        } catch (_) {}
    }
    if (fs.existsSync(PACKAGE_PATH)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8'));
            return {
                version: pkg.version || '1.1.0',
                build: 1,
                name: 'Medixly',
                appId: 'store.realunstoppable.medixly'
            };
        } catch (_) {}
    }
    return {
        version: '1.1.0',
        build: 1,
        name: 'Medixly',
        appId: 'store.realunstoppable.medixly'
    };
}

/**
 * Bumps semver version string
 */
export function calculateBump(currentVersion, bumpType = 'patch') {
    const semverPattern = /^(\d+)\.(\d+)\.(\d+)(.*)$/;
    const match = currentVersion.match(semverPattern);

    if (!match) {
        return currentVersion;
    }

    let major = parseInt(match[1], 10);
    let minor = parseInt(match[2], 10);
    let patch = parseInt(match[3], 10);

    switch (bumpType.toLowerCase()) {
        case 'major':
            major += 1;
            minor = 0;
            patch = 0;
            break;
        case 'minor':
            minor += 1;
            patch = 0;
            break;
        case 'patch':
        default:
            patch += 1;
            break;
    }

    return `${major}.${minor}.${patch}`;
}

/**
 * Synchronizes a version across all targets:
 * - config/version.json
 * - package.json
 * - electron-builder.yml
 * - desktop/build/Info.plist
 * - medixly.html
 * - js/version.js
 */
export function syncVersion(targetVersion, options = {}) {
    const config = getVersionConfig();
    const version = targetVersion || config.version || '1.1.0';
    const build = options.build || (config.build ? config.build + 1 : 1);
    const updatedFiles = [];

    // 1. config/version.json
    const newConfig = {
        ...config,
        version,
        build,
        updatedAt: new Date().toISOString()
    };
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2) + '\n', 'utf8');
    updatedFiles.push(CONFIG_PATH);

    // 2. package.json
    if (fs.existsSync(PACKAGE_PATH)) {
        const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8'));
        pkg.version = version;
        fs.writeFileSync(PACKAGE_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
        updatedFiles.push(PACKAGE_PATH);
    }

    // 3. electron-builder.yml
    if (fs.existsSync(ELECTRON_BUILDER_PATH)) {
        let yaml = fs.readFileSync(ELECTRON_BUILDER_PATH, 'utf8');
        // Update extraMetadata version
        yaml = yaml.replace(/extraMetadata:\s*\n\s*main:[^\n]+\n\s*version:\s*"[^"]*"/g, (match) => {
            return match.replace(/version:\s*"[^"]*"/, `version: "${version}"`);
        });

        // Ensure CFBundleShortVersionString & CFVersion under extendInfo
        if (yaml.includes('extendInfo:')) {
            if (yaml.includes('CFBundleShortVersionString:')) {
                yaml = yaml.replace(/CFBundleShortVersionString:\s*"[^"]*"/, `CFBundleShortVersionString: "${version}"`);
            } else {
                yaml = yaml.replace(/(extendInfo:\s*\n)/, `$1    CFBundleShortVersionString: "${version}"\n`);
            }
            if (yaml.includes('CFBundleVersion:')) {
                yaml = yaml.replace(/CFBundleVersion:\s*"[^"]*"/, `CFBundleVersion: "${version}"`);
            } else {
                yaml = yaml.replace(/(extendInfo:\s*\n)/, `$1    CFBundleVersion: "${version}"\n`);
            }
        }
        fs.writeFileSync(ELECTRON_BUILDER_PATH, yaml, 'utf8');
        updatedFiles.push(ELECTRON_BUILDER_PATH);
    }

    // 4. macOS Info.plist
    fs.mkdirSync(path.dirname(MAC_PLIST_PATH), { recursive: true });
    const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>Medixly</string>
    <key>CFBundleName</key>
    <string>Medixly</string>
    <key>CFBundleIdentifier</key>
    <string>store.realunstoppable.medixly</string>
    <key>CFBundleShortVersionString</key>
    <string>${version}</string>
    <key>CFBundleVersion</key>
    <string>${version}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
`;
    fs.writeFileSync(MAC_PLIST_PATH, plistContent, 'utf8');
    updatedFiles.push(MAC_PLIST_PATH);

    // 5. Frontend medixly.html
    if (fs.existsSync(MEDIXLY_HTML_PATH)) {
        let html = fs.readFileSync(MEDIXLY_HTML_PATH, 'utf8');
        // Update #medixly-app-version-tag
        html = html.replace(/<span class="medixly-version-tag" id="medixly-app-version-tag">v[^<]+<\/span>/g,
            `<span class="medixly-version-tag" id="medixly-app-version-tag">v${version}</span>`);
        fs.writeFileSync(MEDIXLY_HTML_PATH, html, 'utf8');
        updatedFiles.push(MEDIXLY_HTML_PATH);
    }

    // 6. js/version.js
    const jsContent = `// js/version.js
// Auto-synchronized Medixly Version Configuration
export const APP_VERSION = "${version}";
export const BUILD_NUMBER = ${build};
export const APP_NAME = "Medixly";
export const APP_ID = "store.realunstoppable.medixly";

export default {
    version: APP_VERSION,
    build: BUILD_NUMBER,
    name: APP_NAME,
    appId: APP_ID
};
`;
    fs.writeFileSync(JS_VERSION_PATH, jsContent, 'utf8');
    updatedFiles.push(JS_VERSION_PATH);

    return {
        version,
        build,
        updatedFiles
    };
}

/**
 * Main CLI handler
 */
export function runCLI() {
    const args = process.argv.slice(2);
    const command = args[0] || 'sync';
    const config = getVersionConfig();

    if (command === 'bump') {
        const bumpType = args[1] || 'patch';
        const newVersion = calculateBump(config.version, bumpType);
        const result = syncVersion(newVersion);
        console.log(`[Version Manager] Bumped (${bumpType}) Medixly version to v${result.version} (build ${result.build})`);
        result.updatedFiles.forEach(f => console.log(`  ✓ Synced ${path.relative(ROOT_DIR, f)}`));
    } else if (command === 'set') {
        const targetVersion = args[1];
        if (!targetVersion) {
            console.error('Error: Please provide a version number (e.g. node scripts/version-manager.js set 1.2.0)');
            process.exit(1);
        }
        const result = syncVersion(targetVersion);
        console.log(`[Version Manager] Set Medixly version to v${result.version}`);
        result.updatedFiles.forEach(f => console.log(`  ✓ Synced ${path.relative(ROOT_DIR, f)}`));
    } else {
        // sync
        const result = syncVersion(config.version);
        console.log(`[Version Manager] Synchronized Medixly v${result.version} across all build & UI targets:`);
        result.updatedFiles.forEach(f => console.log(`  ✓ ${path.relative(ROOT_DIR, f)}`));
    }
}

// Only execute when run directly from command line
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
    runCLI();
}
