const fs = require('fs');
let code = fs.readFileSync('tracker.html', 'utf8');

const search = `                </section>`;
const replace = `                </section>
                <div class="ad-banner-container" data-ad-slot="0987654321" style="margin: 20px auto; text-align: center; width: 100%; max-width: 800px;"></div>`;

// Only replace the first occurrence (at the end of a major section)
code = code.replace(search, replace);
fs.writeFileSync('tracker.html', code, 'utf8');
