const fs = require('fs');
let code = fs.readFileSync('new-dts.html', 'utf8');

const search = `                <button class="read-more-btn" onclick="toggleSection('lore-details')">Read More</button>`;
const replace = `                <button class="read-more-btn" onclick="toggleSection('lore-details')">Read More</button>
                <div class="ad-banner-container" data-ad-slot="1234567890" style="margin: 20px auto; text-align: center; width: 100%;"></div>`;

code = code.replace(search, replace);
fs.writeFileSync('new-dts.html', code, 'utf8');
