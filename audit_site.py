# audit_site.py
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json

BASE_URL = "https://www.realunstoppable.store/"
visited = set()
broken_links = []

def crawl(url):
    if url in visited:
        return
    visited.add(url)
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code != 200:
            broken_links.append({"url": url, "status": resp.status_code})
            return
    except Exception as e:
        broken_links.append({"url": url, "error": str(e)})
        return
    soup = BeautifulSoup(resp.text, "html.parser")
    # find all anchors
    for a in soup.find_all('a', href=True):
        href = a['href']
        # ignore external links
        if href.startswith('http'):
            continue
        # normalize
        full = urljoin(url, href)
        # strip fragment/query
        parsed = urlparse(full)
        full = parsed.scheme + "://" + parsed.netloc + parsed.path
        if full not in visited:
            # Test link by fetching
            try:
                r = requests.head(full, timeout=5, allow_redirects=True)
                if r.status_code >= 400:
                    broken_links.append({"url": full, "status": r.status_code, "referrer": url})
                else:
                    # crawl deeper if it's an HTML page
                    if full.endswith('.html') or r.headers.get('content-type','').startswith('text/html'):
                        crawl(full)
            except Exception as e:
                broken_links.append({"url": full, "error": str(e), "referrer": url})
    # buttons are not testable via HTTP, just list those with no onclick
    for btn in soup.find_all('button'):
        if not btn.get('onclick'):
            # record button info
            broken_links.append({"button": str(btn), "page": url, "issue": "no onclick"})

crawl(BASE_URL)

report = {
    "broken_links": broken_links,
    "visited": list(visited)
}

with open('broken_elements_report.json', 'w') as f:
    json.dump(report, f, indent=2)
print(json.dumps(report, indent=2))
