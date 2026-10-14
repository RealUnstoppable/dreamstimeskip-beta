const fs = require('fs');
let js = fs.readFileSync('js/medixly.js', 'utf8');

js = js.replace(/renderMusicGrid\(filtered\);/, `
                    if (filtered.length === 0) {
                        document.getElementById('container-jumpback').innerHTML = '<p style="padding:20px;color:#888;">No results found.</p>';
                    } else {
                        document.getElementById('container-jumpback').innerHTML = groupSongsByTitle(filtered).map(group => createGroupCard(group)).join('');
                    }
                    // Hide other sections during search
                    document.getElementById('leaderboard-section').style.display = query ? 'none' : 'block';
                    document.getElementById('playlists-section').style.display = query ? 'none' : 'block';
                    document.getElementById('container-recommended').innerHTML = '';
`);

fs.writeFileSync('js/medixly.js', js, 'utf8');
