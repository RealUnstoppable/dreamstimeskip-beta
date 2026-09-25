const fs = require('fs');
let code = fs.readFileSync('js/sitewide-player.js', 'utf8');

// Replace hasDragged logic
code = code.replace(/let hasDragged = false;/g, 'let hasDragged = false;\n            let dragStartTime = 0;');
code = code.replace(/hasDragged = false;/g, 'hasDragged = false;'); // Will be replaced in handleDragStart
code = code.replace(/isDragging = true;\s+hasDragged = false;/g, 'isDragging = true;\n                hasDragged = false;\n                dragStartTime = Date.now();');
code = code.replace(/if \(distance > 5\) hasDragged = true;/g, 'if (distance > 5 && Date.now() - dragStartTime > 150) hasDragged = true;');

fs.writeFileSync('js/sitewide-player.js', code, 'utf8');
