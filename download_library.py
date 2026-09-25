#!/usr/bin/env python3
"""
Medixly Bulk Song Downloader
=============================
Reads your song library CSV, downloads each song's audio (MP3) and cover art
via yt-dlp, and generates a JSON database for song-data.js and lyrics-data.js.

Usage:
    pip3 install yt-dlp
    python3 download_library.py
"""

import csv
import subprocess
import json
import re
import os
import sys

CSV_FILE = "/Users/catalinandrian/.gemini/antigravity/brain/7a661ac3-f422-4bfb-a2b6-1beba7adaaa9/.user_uploaded/media_1790166985908.csv"
SONG_DIR = "/Users/catalinandrian/Downloads/Songs"
IMG_DIR  = "/Users/catalinandrian/Images"

os.makedirs(SONG_DIR, exist_ok=True)
os.makedirs(IMG_DIR, exist_ok=True)

def slugify(value):
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)

songs = []
lyrics_db = {}
failed = []

print("=" * 60)
print("  Medixly Bulk Song Downloader")
print("=" * 60)
print(f"  Songs folder : {SONG_DIR}")
print(f"  Images folder: {IMG_DIR}")
print(f"  CSV file     : {CSV_FILE}")
print("=" * 60)
print()

# Count total songs first
with open(CSV_FILE, 'r', encoding='utf-8-sig') as f:
    total = sum(1 for row in csv.reader(f) if len(row) >= 5)

print(f"Found {total} songs. Starting download...\n")

count = 0
with open(CSV_FILE, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    for row in reader:
        if len(row) < 5:
            continue

        count += 1
        title  = row[0].strip()
        duration = row[1].strip()
        artist = row[2].strip()
        album  = row[3].strip()
        genre  = row[4].strip()

        song_id = slugify(f"{title} {artist}")

        # Skip if already downloaded
        mp3_path = os.path.join(SONG_DIR, f"{song_id}.mp3")
        if os.path.exists(mp3_path):
            print(f"[{count}/{total}] ⏭️  Already exists: {title} — {artist}")
            songs.append({
                "id": song_id,
                "title": title,
                "artist": artist,
                "duration": duration,
                "src": f"/music/{song_id}.mp3",
                "art": f"/images/{song_id}.jpg",
                "bpm": 120, "energy": 0.8,
                "inmixPoint": 10, "outmixPoint": 10,
                "tags": [genre.lower().strip()]
            })
            lyrics_db[song_id] = [{
                "start": 0, "end": 10, "trending": False,
                "words": [{"text": "[Lyrics not yet available]", "start": 0}]
            }]
            continue

        print(f"[{count}/{total}] 🔍 Searching: {title} — {artist} ... ", end="", flush=True)

        temp_out = os.path.join(SONG_DIR, f"{song_id}.%(ext)s")

        cmd = [
            "yt-dlp",
            f"ytsearch1:{title} {artist} audio",
            "--extract-audio",
            "--audio-format", "mp3",
            "--audio-quality", "0",
            "--write-thumbnail",
            "--convert-thumbnails", "jpg",
            "-o", temp_out,
            "--quiet",
            "--no-warnings"
        ]

        try:
            subprocess.run(cmd, check=True, timeout=120)

            # Move thumbnail to Images folder
            img_src  = os.path.join(SONG_DIR, f"{song_id}.jpg")
            img_dest = os.path.join(IMG_DIR, f"{song_id}.jpg")
            if os.path.exists(img_src):
                os.rename(img_src, img_dest)

            songs.append({
                "id": song_id,
                "title": title,
                "artist": artist,
                "duration": duration,
                "src": f"/music/{song_id}.mp3",
                "art": f"/images/{song_id}.jpg",
                "bpm": 120, "energy": 0.8,
                "inmixPoint": 10, "outmixPoint": 10,
                "tags": [genre.lower().strip()]
            })

            lyrics_db[song_id] = [{
                "start": 0, "end": 10, "trending": False,
                "words": [{"text": "[Lyrics not yet available]", "start": 0}]
            }]

            print("✅")

        except subprocess.TimeoutExpired:
            print("⏰ Timed out, skipping")
            failed.append(f"{title} — {artist} (timeout)")
        except Exception as e:
            print(f"❌ {e}")
            failed.append(f"{title} — {artist} ({e})")

# Save the generated database
output_file = os.path.join(SONG_DIR, "generated_database.json")
with open(output_file, "w") as f:
    json.dump({"librarySongs": songs, "lyricsData": lyrics_db}, f, indent=4)

print("\n" + "=" * 60)
print(f"  🎉 DONE!")
print(f"  Successfully processed: {len(songs)}/{total}")
print(f"  Failed: {len(failed)}")
print(f"  Database saved to: {output_file}")
print("=" * 60)

if failed:
    print("\nFailed songs:")
    for f_item in failed:
        print(f"  ❌ {f_item}")
