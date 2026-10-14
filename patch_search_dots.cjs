const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

// 1. Patch Spotlight Search HTML to include `...` button
const searchHtmlOld = `                <span class="spotlight-result-play">▶</span>
            </div>`;
const searchHtmlNew = `                <span class="spotlight-result-play">▶</span>
                <button class="card-more-btn" style="background:transparent;border:none;color:#fff;padding:0 10px;font-size:16px;cursor:pointer;" title="More Options">...</button>
            </div>`;
js = js.replace(searchHtmlOld, searchHtmlNew);

// 2. Patch Playlist Table to include `...` button
const tableHtmlOld = `                <td style="text-align: right;">\${escapeHTML(song.duration)}</td>
            \`;

            row.addEventListener('click', () => {`;
const tableHtmlNew = `                <td style="text-align: right;">\${escapeHTML(song.duration)}</td>
                <td style="width: 40px; text-align: center;">
                    <button class="card-more-btn" style="background:transparent;border:none;color:#fff;font-size:16px;cursor:pointer;" title="More Options">...</button>
                </td>
            \`;

            // Assign data-song-id to the row so context menu click can find it
            row.dataset.songId = song.id;
            
            row.addEventListener('click', (e) => {
                if (e.target.closest('.card-more-btn')) return; // ignore if clicking more btn`;
js = js.replace(tableHtmlOld, tableHtmlNew);

// 3. Patch global document click to catch Spotlight and Playlist `.card-more-btn`
// wait, the contextMenu logic already does: const moreBtn = e.target.closest('.card-more-btn');
// and const card = moreBtn.closest('.music-card');
// But spotlight rows and table rows are NOT `.music-card`!
const ctxMenuOld = `        const moreBtn = e.target.closest('.card-more-btn');
        if (moreBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = moreBtn.closest('.music-card');
            contextMenuTargetSongId = card.dataset.songId;`;
            
const ctxMenuNew = `        const moreBtn = e.target.closest('.card-more-btn');
        if (moreBtn && !moreBtn.closest('.queue-item')) { // ensure it doesn't conflict with queue more btn
            e.preventDefault();
            e.stopPropagation();
            const card = moreBtn.closest('.music-card') || moreBtn.closest('.spotlight-result-row') || moreBtn.closest('tr');
            contextMenuTargetSongId = card ? card.dataset.songId : null;
            if (!contextMenuTargetSongId) return;`;
js = js.replace(ctxMenuOld, ctxMenuNew);

fs.writeFileSync('js/medixly.js', js, 'utf8');
console.log("Patched search and playlist dots");
