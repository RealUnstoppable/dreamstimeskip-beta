const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create a 540x380 PNG image for DMG background
const width = 540;
const height = 380;

function createDmgBackground() {
  const rowSize = 1 + width * 4; // 1 filter byte + RGBA
  const buffer = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    buffer[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Dark futuristic aesthetic matching Medixly's theme
      // Gradient from #0d1117 to #161b22 with subtle purple/crimson music glow
      const normalizedY = y / height;
      const normalizedX = x / width;

      // Distance from center for radial glow
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      let r = Math.floor(15 + 10 * normalizedY + (1 - Math.min(dist, 1)) * 18);
      let g = Math.floor(18 + 8 * normalizedY + (1 - Math.min(dist, 1)) * 10);
      let b = Math.floor(28 + 20 * normalizedY + (1 - Math.min(dist, 1)) * 35);

      // Subtle stylish arrow pointing from App (x ~ 140) to Applications folder (x ~ 400)
      // Arrow is around y = 220, x between 230 and 310
      const arrowY = 220;
      if (x >= 240 && x <= 300 && Math.abs(y - arrowY) <= 3) {
        // Arrow shaft
        r = 180; g = 140; b = 255;
      }
      // Arrow head
      if (x >= 285 && x <= 305) {
        const headDist = x - 285;
        if (Math.abs(y - arrowY) <= headDist && Math.abs(y - arrowY) >= headDist - 3) {
          r = 200; g = 160; b = 255;
        }
      }

      // Top title accent line (y = 60)
      if (y === 60 && x >= 40 && x <= 500) {
        r = 80; g = 50; b = 140;
      }

      buffer[pxOffset] = Math.min(255, Math.max(0, r));
      buffer[pxOffset + 1] = Math.min(255, Math.max(0, g));
      buffer[pxOffset + 2] = Math.min(255, Math.max(0, b));
      buffer[pxOffset + 3] = 255; // Alpha
    }
  }

  const compressedData = zlib.deflateSync(buffer);

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(8 + len + 4);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4);
    data.copy(chunk, 8);
    const crcBuf = Buffer.concat([Buffer.from(type), data]);
    chunk.writeUInt32BE(crc32(crcBuf), 8 + len);
    return chunk;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const pngBuffer = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
  const destPath = path.join(__dirname, '..', 'desktop', 'dmg-background.png');
  fs.writeFileSync(destPath, pngBuffer);
  console.log('Generated DMG background at', destPath, 'size:', pngBuffer.length, 'bytes');
}

createDmgBackground();
