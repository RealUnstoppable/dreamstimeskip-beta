const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject GPT Script in head
const gptScript = `
    <!-- GPT SRA and Lazy Loading setup -->
    <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
    <script>
      window.googletag = window.googletag || {cmd: []};
      googletag.cmd.push(function() {
        googletag.defineSlot('/1234567/top_banner', [[728, 90], [320, 50]], 'div-gpt-ad-top-banner').addService(googletag.pubads());
        googletag.defineSlot('/1234567/in_feed_1', [[300, 250], 'fluid'], 'div-gpt-ad-in-feed-1').addService(googletag.pubads());
        googletag.defineSlot('/1234567/in_feed_2', [[300, 250], 'fluid'], 'div-gpt-ad-in-feed-2').addService(googletag.pubads());
        googletag.defineSlot('/1234567/mobile_sticky', [320, 50], 'div-gpt-ad-mobile-sticky').addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
        googletag.pubads().enableLazyLoad({ fetchMarginPercent: 500, renderMarginPercent: 200, mobileScaling: 2.0 });
        googletag.enableServices();
      });
    </script>
`;

if (!html.includes('securepubads.g.doubleclick.net')) {
    html = html.replace('</head>', gptScript + '</head>');
}

// 2. Insert Top Banner after <header class="main-header"></header>
const topBanner = `
    <!-- AD_SLOT_START -->
    <div class="ad-container ad-top-banner" style="margin-top: 80px;">
        <div id="div-gpt-ad-top-banner">
            <script>
                googletag.cmd.push(function() { googletag.display('div-gpt-ad-top-banner'); });
            </script>
        </div>
    </div>
    <!-- AD_SLOT_END -->
`;
if (!html.includes('div-gpt-ad-top-banner')) {
    html = html.replace('<main>', topBanner + '\n    <main>');
}

// 3. Insert In-Feed 1 between unstoppable and dts sections
const inFeed1 = `
    <!-- AD_SLOT_START -->
    <div class="ad-container ad-in-feed" style="margin: 40px auto; z-index: 10;">
        <div id="div-gpt-ad-in-feed-1">
            <script>
                googletag.cmd.push(function() { googletag.display('div-gpt-ad-in-feed-1'); });
            </script>
        </div>
    </div>
    <!-- AD_SLOT_END -->
`;
if (!html.includes('div-gpt-ad-in-feed-1')) {
    html = html.replace('</section>\n\n            <section id="dts"', '</section>\n' + inFeed1 + '            <section id="dts"');
}

// 4. Insert In-Feed 2 between dts and harmony (medixly) sections
const inFeed2 = `
    <!-- AD_SLOT_START -->
    <div class="ad-container ad-in-feed" style="margin: 40px auto; z-index: 10;">
        <div id="div-gpt-ad-in-feed-2">
            <script>
                googletag.cmd.push(function() { googletag.display('div-gpt-ad-in-feed-2'); });
            </script>
        </div>
    </div>
    <!-- AD_SLOT_END -->
`;
if (!html.includes('div-gpt-ad-in-feed-2')) {
    html = html.replace('</section>\n\n            <section id="harmony"', '</section>\n' + inFeed2 + '            <section id="harmony"');
}

// 5. Replace the static AdSense block at the bottom with the mobile sticky ad slot
const mobileSticky = `
    <!-- AD_SLOT_START -->
    <div class="ad-container ad-mobile-sticky">
        <div id="div-gpt-ad-mobile-sticky">
            <script>
                googletag.cmd.push(function() { googletag.display('div-gpt-ad-mobile-sticky'); });
            </script>
        </div>
    </div>
    <!-- AD_SLOT_END -->
`;
// Regex to remove the existing static adsbygoogle block
html = html.replace(/<!-- Google AdSense Auto Ad Unit[\s\S]*?<\/script>\s*<\/div>/g, mobileSticky);

fs.writeFileSync('index.html', html);
console.log('Successfully patched index.html with ad spaces!');
