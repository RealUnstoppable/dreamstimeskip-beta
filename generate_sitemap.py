import os
from datetime import datetime
import urllib.parse

BASE_URL = 'https://realunstoppable.store'
files = [f for f in os.listdir('.') if f.endswith('.html')]

exclude = [
    'admin.html', 'account.html', 'checkout.html', 'checkout-premium.html',
    'checkout-ultimate.html', 'success.html', 'shared-wishlist.html', 'sign in beta.html'
]

priority = {
    'index.html': '1.0', 'shop.html': '0.9', 'harmonytunes.html': '0.9',
    'dreamstimeskip.html': '0.9', 'unstoppable.html': '0.9', 'blog.html': '0.8',
    'memberships.html': '0.8'
}

date_str = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for f in files:
    if f in exclude: continue
    loc = f"{BASE_URL}/" if f == 'index.html' else f"{BASE_URL}/{urllib.parse.quote(f)}"
    p = priority.get(f, '0.6')
    xml += f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>{date_str}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>{p}</priority>\n  </url>\n"

xml += '</urlset>'

with open('sitemap.xml', 'w') as out:
    out.write(xml)

robots = f"""User-agent: *
Allow: /

Disallow: /admin.html
Disallow: /account.html
Disallow: /checkout*.html
Disallow: /success.html
Disallow: /shared-wishlist.html
Disallow: /sign%20in%20beta.html

Sitemap: {BASE_URL}/sitemap.xml
"""

with open('robots.txt', 'w') as out:
    out.write(robots)

print("Generated sitemap.xml and robots.txt")
