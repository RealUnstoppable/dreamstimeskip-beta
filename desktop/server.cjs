const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

function createDesktopServer(rootDir) {
  const app = express();

  app.use(cors());

  // Cross-Origin headers for AudioWorklet and WebAudio compatibility
  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    next();
  });

  // Body parsing for JSON
  app.use(express.json({ limit: '64kb' }));

  // Dynamic route rewrite for Medixly Desktop
  app.get('/', (req, res) => {
    res.redirect('/medixly.html');
  });

  app.get('/medixly', (req, res) => {
    res.sendFile(path.join(rootDir, 'medixly.html'));
  });

  app.get('/medixly/stream', (req, res) => {
    res.sendFile(path.join(rootDir, 'medixly.html'));
  });

  app.get('/medixly/hits', (req, res) => {
    res.sendFile(path.join(rootDir, 'medixly-hits.html'));
  });

  app.get('/medixly/artists', (req, res) => {
    res.sendFile(path.join(rootDir, 'medixly-artists.html'));
  });

  // Strip web advertising scripts for native desktop experience
  app.use((req, res, next) => {
    if (req.path.endsWith('.html') || req.path === '/medixly.html') {
      const filePath = path.join(rootDir, req.path.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, html) => {
          if (err) return next();
          // Remove Google AdSense scripts & banner ad slots
          let cleanedHtml = html.replace(/<script[^>]*adsbygoogle[^>]*><\/script>/gi, '');
          cleanedHtml = cleanedHtml.replace(/<!-- AD_SLOT_START -->[\s\S]*?<!-- AD_SLOT_END -->/g, '');
          cleanedHtml = cleanedHtml.replace(/<div[^>]*class="[^"]*ad-container[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
          // Mark desktop environment
          cleanedHtml = cleanedHtml.replace('<body>', '<body class="is-desktop-mac">');
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.send(cleanedHtml);
        });
        return;
      }
    }
    next();
  });

  // Support Stripe checkout session forwarding
  app.post(['/create-checkout-session', '/api/create-checkout-session'], async (req, res) => {
    const payload = req.body || {};
    try {
      // Forward to authoritative cloud functions endpoint
      const response = await fetch('https://us-central1-dts-hub-website.cloudfunctions.net/createCheckoutSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          project: 'medixly',
          origin: payload.origin || 'https://realunstoppable.store'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).send(errorText);
      }

      const data = await response.json();
      return res.json(data);
    } catch (err) {
      console.warn('[Desktop Server] Checkout forwarding warning:', err.message);
      // Return structured fallback
      return res.status(502).json({
        error: 'Unable to connect to payment server. Please verify your internet connection.',
        details: err.message
      });
    }
  });

  // Serve all static assets with byte-range support (vital for mp3 audio seeking)
  app.use(express.static(rootDir, {
    dotfiles: 'ignore',
    etag: true,
    maxAge: 0, // Fresh assets during local execution
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.mp3')) {
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Type', 'audio/mpeg');
      } else if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      }
    }
  }));

  return new Promise((resolve, reject) => {
    // Listen on ephemeral loopback port (127.0.0.1:0)
    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = address.port;
      console.log(`[Desktop Server] Internal server running at http://127.0.0.1:${port}`);
      resolve({ server, port, url: `http://127.0.0.1:${port}` });
    });

    server.on('error', (err) => {
      console.error('[Desktop Server] Failed to start:', err);
      reject(err);
    });
  });
}

module.exports = { createDesktopServer };
