/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAdminPerformanceMetrics } from '../dist/lib/telemetry-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Admin Performance Suite & Video Analytics', () => {
  let adminHtmlContent = '';

  beforeAll(() => {
    const adminPath = path.join(__dirname, '..', 'admin.html');
    adminHtmlContent = fs.readFileSync(adminPath, 'utf8');
  });

  test('admin.html preserves all original 9 commercial metric card IDs', () => {
    const originalIds = [
      'total-revenue',
      'total-purchases',
      'total-users',
      'new-signups',
      'checkouts',
      'active-carts',
      'avg-orders',
      'upcoming-bookings',
      'pending-quotes',
    ];

    for (const id of originalIds) {
      expect(adminHtmlContent).toContain(`id="${id}"`);
    }
  });

  test('admin.html contains all newly added live telemetry metrics and diagnostics elements', () => {
    const telemetryIds = [
      'telemetry-live-sessions',
      'telemetry-total-sessions',
      'telemetry-avg-dwell',
      'telemetry-scroll-100',
      'telemetry-gpc-count',
      'telemetry-ads-eligible',
    ];

    for (const id of telemetryIds) {
      expect(adminHtmlContent).toContain(`id="${id}"`);
    }
  });

  test('admin.html contains the full Dreams TimeSkip video intelligence suite and retention funnel', () => {
    const videoElements = [
      'video-dreams-plays',
      'video-dreams-completions',
      'video-dreams-completion-rate',
      'video-total-watch-time',
      'video-all-plays',
      'funnel-start-count',
      'funnel-25-count',
      'funnel-50-count',
      'funnel-75-count',
      'funnel-100-count',
      'funnel-bar-start',
      'funnel-bar-25',
      'funnel-bar-50',
      'funnel-bar-75',
      'funnel-bar-100',
    ];

    for (const id of videoElements) {
      expect(adminHtmlContent).toContain(`id="${id}"`);
    }
  });

  test('admin.html includes expanded views in #graph-selector for video funnel and attribution', () => {
    expect(adminHtmlContent).toContain('value="video_funnel"');
    expect(adminHtmlContent).toContain('value="attribution"');
    expect(adminHtmlContent).toContain('value="devices"');
    expect(adminHtmlContent).toContain('value="cohorts"');
    expect(adminHtmlContent).toContain('id="performance-chart"');
  });

  test('admin.html preserves other critical sections without destruction', () => {
    const otherSections = [
      'id="bookings"',
      'id="quotes"',
      'id="users"',
      'id="waitlist"',
      'id="newsletter"',
      'id="support-tickets"',
      'id="promo-codes"',
      'id="featurerequests"',
      'id="downloads"',
      'id="account-settings"',
    ];

    for (const section of otherSections) {
      expect(adminHtmlContent).toContain(section);
    }
  });

  test('handleAdminPerformanceMetrics returns 200 with structured video and telemetry metrics', async () => {
    const req = {
      method: 'GET',
      headers: {},
    };

    let statusCode = 0;
    let responseData = null;

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      },
      send(data) {
        responseData = data;
        return this;
      },
      setHeader() {},
    };

    await handleAdminPerformanceMetrics(req, res);

    expect(statusCode).toBe(200);
    expect(responseData).toBeDefined();
    expect(responseData.success).toBe(true);
    expect(responseData.videoEngagement).toBeDefined();
    expect(responseData.sessions).toBeDefined();
    expect(responseData.cohorts).toBeDefined();
    expect(responseData.compliance).toBeDefined();
  });
});
