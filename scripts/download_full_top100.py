#!/usr/bin/env python3
"""
Downloads full-duration MP3s for all Medixly Top 100 songs via yt-dlp,
replacing the 30-second preview files.
"""

import os
import sys
import json
import subprocess
import shutil
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def get_duration(filepath):
    try:
        out = subprocess.check_output([
            'ffprobe', '-i', filepath,
            '-show_entries', 'format=duration',
            '-v', 'quiet', '-of', 'csv=p=0'
        ], stderr=subprocess.DEVNULL).decode().strip()
        return float(out)
    except Exception:
        return 0.0

def download_song(song):
    title = song['title']
    artist = song['artist']
    src = song['src']
    filename = os.path.basename(src)
    dest_path = os.path.join('music', filename)

    current_dur = get_duration(dest_path) if os.path.exists(dest_path) else 0.0
    if current_dur > 60.0:
        return {
            'rank': song.get('rank'),
            'title': title,
            'artist': artist,
            'status': 'already_full',
            'duration': current_dur
        }

    temp_base = f"/tmp/top100_dl_{song['rank']}_{int(time.time() * 1000)}"
    temp_mp3 = f"{temp_base}.mp3"

    queries = [
        f"{artist} - {title} official audio",
        f"{title} by {artist} audio",
        f"{title} {artist}"
    ]

    success = False
    dur = 0.0
    for q in queries:
        try:
            cmd = [
                'yt-dlp',
                f"ytsearch1:{q}",
                '--extract-audio',
                '--audio-format', 'mp3',
                '--audio-quality', '0',
                '-o', f"{temp_base}.%(ext)s",
                '--quiet',
                '--no-warnings'
            ]
            subprocess.run(cmd, check=True, timeout=90)
            if os.path.exists(temp_mp3):
                dur = get_duration(temp_mp3)
                if dur > 30.0:
                    shutil.move(temp_mp3, dest_path)
                    success = True
                    break
                else:
                    if os.path.exists(temp_mp3):
                        os.remove(temp_mp3)
        except Exception as e:
            # Clean up temp files if any
            for f in [temp_mp3, f"{temp_base}.webm", f"{temp_base}.m4a"]:
                if os.path.exists(f):
                    try: os.remove(f)
                    except: pass
            continue

    # Special case alias: sunflower-post-malone -> sunflower-post-malone-swae-lee
    if success and filename == 'sunflower-post-malone.mp3':
        alias_path = os.path.join('music', 'sunflower-post-malone-swae-lee.mp3')
        shutil.copyfile(dest_path, alias_path)

    return {
        'rank': song.get('rank'),
        'title': title,
        'artist': artist,
        'status': 'downloaded' if success else 'failed',
        'duration': dur
    }

def main():
    with open('/tmp/top100_songs.json') as f:
        songs = json.load(f)

    # Also handle dead-fresh-lil-baby from backup dead_fresh.mp3
    if os.path.exists('music/dead_fresh.mp3'):
        dead_dur = get_duration('music/dead_fresh.mp3')
        if dead_dur > 60:
            shutil.copyfile('music/dead_fresh.mp3', 'music/dead-fresh-lil-baby.mp3')
            print("Copied full-length music/dead_fresh.mp3 to music/dead-fresh-lil-baby.mp3")

    print(f"Starting download of {len(songs)} songs using 4 concurrent workers...")
    start_time = time.time()

    completed = 0
    failed = []

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(download_song, s): s for s in songs}
        for future in as_completed(futures):
            res = future.result()
            completed += 1
            if res['status'] == 'failed':
                print(f"[{completed}/{len(songs)}] ❌ Failed: #{res['rank']} {res['title']} by {res['artist']}")
                failed.append(res)
            else:
                tag = "⏭️ Already full" if res['status'] == 'already_full' else "✅ Downloaded"
                print(f"[{completed}/{len(songs)}] {tag}: #{res['rank']} {res['title']} by {res['artist']} ({res['duration']:.1f}s)")

    elapsed = time.time() - start_time
    print(f"\nDone in {elapsed:.1f}s. Completed: {completed - len(failed)}/{len(songs)}, Failed: {len(failed)}")
    if failed:
        print("Failed songs:", [f"#{f['rank']} {f['title']}" for f in failed])

if __name__ == '__main__':
    main()
