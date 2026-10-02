const fs = require('fs');
let code = fs.readFileSync('blog.html', 'utf8');

const search = `        <section id="blog-grid" class="blog-grid">
            <!-- Filled by JS -->
        </section>`;
const replace = `        <section id="blog-grid" class="blog-grid">
            <!-- Filled by JS -->
        </section>
        <div class="ad-banner-container" data-ad-slot="1122334455" style="margin: 40px auto; text-align: center; width: 100%; max-width: 800px;"></div>`;

code = code.replace(search, replace);
fs.writeFileSync('blog.html', code, 'utf8');
