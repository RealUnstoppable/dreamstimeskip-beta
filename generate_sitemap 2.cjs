const fs = require('fs');

const BASE_URL = 'https://realunstoppable.store';

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const excludeList = [
    'admin.html',
    'account.html',
    'checkout.html',
    'checkout-premium.html',
    'checkout-ultimate.html',
    'success.html',
    'shared-wishlist.html',
    'sign in beta.html' // we'll still exclude private/auth routes from sitemap
];

const priorityMap = {
    'index.html': '1.0',
    'shop.html': '0.9',
    'harmonytunes.html': '0.9',
    'dreamstimeskip.html': '0.9',
    'unstoppable.html': '0.9',
    'blog.html': '0.8',
    'memberships.html': '0.8'
};

const date = new Date().toISOString();

let xml = \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\`;

for (const file of htmlFiles) {
    if (excludeList.includes(file)) continue;

    const loc = file === 'index.html' ? BASE_URL + '/' : BASE_URL + '/' + encodeURIComponent(file);
    const priority = priorityMap[file] || '0.6';

    xml += \`  <url>
    <loc>\${loc}</loc>
    <lastmod>\${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>\${priority}</priority>
  </url>\n\`;
}

xml += '</urlset>';

fs.writeFileSync('sitemap.xml', xml, 'utf8');
console.log('sitemap.xml generated.');

const robotsTxt = \`User-agent: *
Allow: /

Disallow: /admin.html
Disallow: /account.html
Disallow: /checkout*.html
Disallow: /success.html
Disallow: /shared-wishlist.html
Disallow: /sign%20in%20beta.html

Sitemap: \${BASE_URL}/sitemap.xml
\`;

fs.writeFileSync('robots.txt', robotsTxt, 'utf8');
console.log('robots.txt generated.');
