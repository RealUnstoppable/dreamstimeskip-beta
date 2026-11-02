// tests/medixly-version-manager.test.js
// Unit tests for the Global App Versioning System

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    getVersionConfig,
    calculateBump,
    syncVersion
} from '../scripts/version-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Phase 3: Global App Versioning System', () => {
    let originalConfig;

    beforeEach(() => {
        originalConfig = getVersionConfig();
    });

    afterEach(() => {
        // Restore to 1.1.0 to preserve workspace stability
        syncVersion('1.1.0');
    });

    it('reads centralized version configuration accurately', () => {
        const config = getVersionConfig();
        expect(config).toBeDefined();
        expect(config.version).toMatch(/^\d+\.\d+\.\d+/);
        expect(config.name).toBe('Medixly');
    });

    it('calculates semver bumps correctly for patch, minor, and major', () => {
        expect(calculateBump('1.1.0', 'patch')).toBe('1.1.1');
        expect(calculateBump('1.1.0', 'minor')).toBe('1.2.0');
        expect(calculateBump('1.1.0', 'major')).toBe('2.0.0');
        expect(calculateBump('2.3.9', 'patch')).toBe('2.3.10');
    });

    it('synchronizes version consistently across package.json, electron-builder.yml, Info.plist, and medixly.html', () => {
        const testVersion = '1.1.5';
        const result = syncVersion(testVersion);

        expect(result.version).toBe(testVersion);

        // 1. package.json
        const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
        expect(pkg.version).toBe(testVersion);

        // 2. electron-builder.yml
        const builderYaml = fs.readFileSync(path.join(ROOT_DIR, 'electron-builder.yml'), 'utf8');
        expect(builderYaml).toContain(`version: "${testVersion}"`);
        expect(builderYaml).toContain(`CFBundleShortVersionString: "${testVersion}"`);
        expect(builderYaml).toContain(`CFBundleVersion: "${testVersion}"`);

        // 3. macOS Info.plist
        const infoPlist = fs.readFileSync(path.join(ROOT_DIR, 'desktop/build/Info.plist'), 'utf8');
        expect(infoPlist).toContain(`<string>${testVersion}</string>`);

        // 4. Frontend UI medixly.html
        const medixlyHtml = fs.readFileSync(path.join(ROOT_DIR, 'medixly.html'), 'utf8');
        expect(medixlyHtml).toContain(`id="medixly-app-version-tag">v${testVersion}</span>`);

        // 5. js/version.js
        const jsVersion = fs.readFileSync(path.join(ROOT_DIR, 'js/version.js'), 'utf8');
        expect(jsVersion).toContain(`export const APP_VERSION = "${testVersion}";`);
    });
});
