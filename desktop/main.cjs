const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  shell,
  Tray,
  Menu,
  TouchBar,
  powerSaveBlocker,
  nativeImage
} = require('electron');
const path = require('path');
const { createDesktopServer } = require('./server.cjs');

// Ensure single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

const rootDir = path.resolve(__dirname, '..');

let mainWindow = null;
let tray = null;
let internalServer = null;
let serverPort = null;
let powerSaveBlockerId = null;
let isQuitting = false;

// Current track state
let currentTrack = {
  title: 'No Track Playing',
  artist: 'Medixly',
  art: '',
  isPlaying: false,
  duration: 0,
  currentTime: 0
};

// TouchBar UI Elements
const { TouchBarButton, TouchBarLabel, TouchBarSpacer } = TouchBar;
let touchBarLabel = null;
let touchBarPlayBtn = null;

function sendMediaCommand(command) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('medixly:media-command', { command });
  }
}

function updateTrayMenu() {
  if (!tray) return;

  const titleText = currentTrack.title.length > 32
    ? currentTrack.title.substring(0, 30) + '...'
    : currentTrack.title;
  const artistText = currentTrack.artist.length > 28
    ? currentTrack.artist.substring(0, 26) + '...'
    : currentTrack.artist;

  const nowPlayingLabel = currentTrack.isPlaying || currentTrack.title !== 'No Track Playing'
    ? `🎵 ${titleText} — ${artistText}`
    : 'Medixly Music Player';

  const contextMenu = Menu.buildFromTemplate([
    {
      label: nowPlayingLabel,
      enabled: false
    },
    { type: 'separator' },
    {
      label: currentTrack.isPlaying ? '⏸ Pause' : '▶️ Play',
      click: () => sendMediaCommand('play-pause')
    },
    {
      label: '⏭ Next Track',
      click: () => sendMediaCommand('next')
    },
    {
      label: '⏮ Previous Track',
      click: () => sendMediaCommand('prev')
    },
    { type: 'separator' },
    {
      label: mainWindow && mainWindow.isVisible() ? 'Hide Medixly' : 'Show Medixly',
      click: () => {
        if (!mainWindow) return;
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit Medixly',
      accelerator: 'Command+Q',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip(`Medixly: ${currentTrack.title} — ${currentTrack.artist}`);
  tray.setContextMenu(contextMenu);
}

function setupTouchBar() {
  touchBarLabel = new TouchBarLabel({
    label: 'Medixly: Ready to Play',
    textColor: '#ffffff'
  });

  const prevBtn = new TouchBarButton({
    label: '⏮',
    click: () => sendMediaCommand('prev')
  });

  touchBarPlayBtn = new TouchBarButton({
    label: '▶',
    click: () => sendMediaCommand('play-pause')
  });

  const nextBtn = new TouchBarButton({
    label: '⏭',
    click: () => sendMediaCommand('next')
  });

  const touchBar = new TouchBar({
    items: [
      prevBtn,
      touchBarPlayBtn,
      nextBtn,
      new TouchBarSpacer({ size: 'small' }),
      touchBarLabel
    ]
  });

  return touchBar;
}

function updateTouchBar() {
  if (touchBarLabel) {
    const text = currentTrack.title !== 'No Track Playing'
      ? `${currentTrack.title} • ${currentTrack.artist}`
      : 'Medixly Music';
    touchBarLabel.label = text.length > 40 ? text.substring(0, 38) + '...' : text;
  }
  if (touchBarPlayBtn) {
    touchBarPlayBtn.label = currentTrack.isPlaying ? '⏸' : '▶';
  }
}

function registerHardwareMediaKeys() {
  try {
    globalShortcut.register('MediaPlayPause', () => {
      sendMediaCommand('play-pause');
    });

    globalShortcut.register('MediaNextTrack', () => {
      sendMediaCommand('next');
    });

    globalShortcut.register('MediaPreviousTrack', () => {
      sendMediaCommand('prev');
    });

    globalShortcut.register('MediaStop', () => {
      sendMediaCommand('stop');
    });
  } catch (err) {
    console.warn('[Main] Global media keys registration warning:', err.message);
  }
}

function setupApplicationMenu() {
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        {
          label: 'Quit Medixly',
          accelerator: 'Command+Q',
          click: () => {
            isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'Playback',
      submenu: [
        {
          label: 'Play / Pause',
          accelerator: 'Space',
          click: () => sendMediaCommand('play-pause')
        },
        {
          label: 'Next Track',
          accelerator: 'CmdOrCtrl+Right',
          click: () => sendMediaCommand('next')
        },
        {
          label: 'Previous Track',
          accelerator: 'CmdOrCtrl+Left',
          click: () => sendMediaCommand('prev')
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Medixly Support',
          click: () => {
            shell.openExternal('https://realunstoppable.store/support.html');
          }
        },
        {
          label: 'Terms & Conditions',
          click: () => {
            shell.openExternal('https://realunstoppable.store/terms.html');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function createMainWindow() {
  const iconPath = path.join(__dirname, 'build', 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: 'Medixly',
    icon: iconPath,
    backgroundColor: '#0a0b0e',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 18, y: 18 },
    show: false, // Prevent white flash before ready-to-show
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      backgroundThrottling: false // Keep WebAudio running smoothly in background
    }
  });

  // TouchBar for MacBook Pro
  if (process.platform === 'darwin') {
    mainWindow.setTouchBar(setupTouchBar());
  }

  // Intercept external links (Stripe checkout, documentation, socials)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (serverPort && !url.startsWith(`http://127.0.0.1:${serverPort}`)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Background audio persistence: hiding on close rather than quitting
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  // Load the web app via internal HTTP server
  const targetUrl = `http://127.0.0.1:${serverPort}/medixly.html`;
  console.log('[Main] Loading app from:', targetUrl);
  await mainWindow.loadURL(targetUrl);
}

function setupTray() {
  const trayIconPath = path.join(__dirname, 'build', 'tray-icon.png');
  let trayImage;

  if (require('fs').existsSync(trayIconPath)) {
    trayImage = nativeImage.createFromPath(trayIconPath);
    trayImage = trayImage.resize({ width: 18, height: 18 });
  } else {
    trayImage = nativeImage.createEmpty();
  }

  tray = new Tray(trayImage);
  updateTrayMenu();

  tray.on('click', () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// App Lifecycle
app.whenReady().then(async () => {
  console.log('[Main] Starting Medixly macOS Desktop App...');

  // Prevent app from sleeping / suspending audio playback during background streaming
  try {
    powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension');
    console.log('[Main] PowerSaveBlocker active. ID:', powerSaveBlockerId);
  } catch (err) {
    console.warn('[Main] PowerSaveBlocker warning:', err.message);
  }

  // Start internal static & range-request server
  try {
    const serverInfo = await createDesktopServer(rootDir);
    internalServer = serverInfo.server;
    serverPort = serverInfo.port;
  } catch (err) {
    console.error('[Main] Failed to start local server:', err);
    app.quit();
    return;
  }

  setupApplicationMenu();
  setupTray();
  registerHardwareMediaKeys();
  await createMainWindow();

  app.on('activate', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

// Second instance focus
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

// IPC Event Handlers
ipcMain.on('medixly:track-update', (event, data) => {
  currentTrack = { ...currentTrack, ...data };
  updateTrayMenu();
  updateTouchBar();
});

ipcMain.on('medixly:playback-state', (event, { isPlaying }) => {
  currentTrack.isPlaying = isPlaying;
  updateTrayMenu();
  updateTouchBar();
});

ipcMain.handle('medixly:open-external', async (event, url) => {
  await shell.openExternal(url);
  return { success: true };
});

ipcMain.on('medixly:window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('medixly:window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('medixly:window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('medixly:get-app-info', () => {
  return {
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    electron: process.versions.electron,
    chrome: process.versions.chrome
  };
});

// Clean termination
app.on('before-quit', () => {
  isQuitting = true;
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();

  if (powerSaveBlockerId !== null && powerSaveBlocker.isStarted(powerSaveBlockerId)) {
    powerSaveBlocker.stop(powerSaveBlockerId);
  }

  if (internalServer) {
    internalServer.close();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
