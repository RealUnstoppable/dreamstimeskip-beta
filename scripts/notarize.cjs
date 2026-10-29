const { notarize } = require('@electron/notarize');
const path = require('path');
const fs = require('fs');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appleId = process.env.APPLE_ID;
  const appleAppSpecificPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD || process.env.APPLE_PASSWORD;
  const teamId = process.env.APPLE_TEAM_ID;

  if (!appleId || !appleAppSpecificPassword || !teamId) {
    console.log('[Notarize] Skipping Apple notarization: APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, or APPLE_TEAM_ID environment variable is missing.');
    console.log('[Notarize] Note: In production CI/CD, these secrets enable automatic Gatekeeper compliance.');
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);

  if (!fs.existsSync(appPath)) {
    console.error(`[Notarize] Application bundle not found at: ${appPath}`);
    return;
  }

  console.log(`[Notarize] Submitting ${appName} (${appPath}) to Apple Notary Service...`);
  console.log(`[Notarize] Team ID: ${teamId}, Account: ${appleId}`);

  try {
    await notarize({
      appPath,
      appleId,
      appleIdPassword: appleAppSpecificPassword,
      teamId,
    });
    console.log(`[Notarize] App successfully notarized by Apple! Gatekeeper approval granted.`);
  } catch (error) {
    console.error('[Notarize] Apple Notarization failed:', error);
    throw error;
  }
};
