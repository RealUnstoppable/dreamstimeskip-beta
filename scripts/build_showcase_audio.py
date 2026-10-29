
import subprocess
import os

tmp = '/tmp/showcase_parts'
os.makedirs(tmp, exist_ok=True)

# p1: 0.0 - 6.0: ad-preview-3 from 14.5 to 20.2 -> pad to 6.0s
subprocess.run([
    'ffmpeg', '-y', '-ss', '14.5', '-to', '20.2', '-i', 'music/ads/ad-preview-3.mp3',
    '-af', 'apad=whole_dur=6.0', '-ar', '44100', '-ac', '2', f'{tmp}/p1.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# p2: 6.0 - 9.6: ad-preview-3 from 20.25 to 23.85 -> pad to 3.6s
subprocess.run([
    'ffmpeg', '-y', '-ss', '20.25', '-to', '23.85', '-i', 'music/ads/ad-preview-3.mp3',
    '-af', 'apad=whole_dur=3.6', '-ar', '44100', '-ac', '2', f'{tmp}/p2.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# p3: 9.6 - 16.8 (7.2s):
# Beat: 4.5s from damn-i-love-miami 0.0 to 4.5
subprocess.run([
    'ffmpeg', '-y', '-ss', '0.0', '-to', '4.5', '-i', 'music/damn-i-love-miami-pitbull-lil-jon.mp3',
    '-ar', '44100', '-ac', '2', f'{tmp}/p3_beat.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
# Voice: ad-preview-4 from 0.0 to 2.5 ('Oh, and we also have this...')
subprocess.run([
    'ffmpeg', '-y', '-ss', '0.0', '-to', '2.5', '-i', 'music/ads/ad-preview-4.mp3',
    '-af', 'apad=whole_dur=2.7', '-ar', '44100', '-ac', '2', f'{tmp}/p3_voice.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
# Concat p3
subprocess.run([
    'ffmpeg', '-y', '-i', f'{tmp}/p3_beat.wav', '-i', f'{tmp}/p3_voice.wav',
    '-filter_complex', '[0:a][1:a]concat=n=2:v=0:a=1[outa]', '-map', '[outa]',
    '-ar', '44100', '-ac', '2', f'{tmp}/p3.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# p4: 16.8 - 21.8 (5.0s):
# User: 'Hey Lexi, skip to the good part.' (2.4s)
subprocess.run([
    'ffmpeg', '-y', '-ss', '0.0', '-to', '2.4', '-i', 'music/ads/ad-preview-2.mp3',
    '-af', 'apad=whole_dur=2.4', '-ar', '44100', '-ac', '2', f'{tmp}/p4_user.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
# Lexi: 'I got you twin' (1.3s) + 'let's go' (0.7s) -> pad to 2.6s
subprocess.run([
    'ffmpeg', '-y', '-ss', '3.1', '-to', '4.4', '-i', 'music/ads/ad-preview-2.mp3',
    '-ar', '44100', '-ac', '2', f'{tmp}/p4_twin.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
subprocess.run([
    'ffmpeg', '-y', '-ss', '7.2', '-to', '7.89', '-i', 'music/ads/ad-preview-2.mp3',
    '-ar', '44100', '-ac', '2', f'{tmp}/p4_go.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
subprocess.run([
    'ffmpeg', '-y', '-i', f'{tmp}/p4_twin.wav', '-i', f'{tmp}/p4_go.wav',
    '-filter_complex', '[0:a][1:a]concat=n=2:v=0:a=1,apad=whole_dur=2.6[outa]', '-map', '[outa]',
    '-ar', '44100', '-ac', '2', f'{tmp}/p4_lexi.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
subprocess.run([
    'ffmpeg', '-y', '-i', f'{tmp}/p4_user.wav', '-i', f'{tmp}/p4_lexi.wav',
    '-filter_complex', '[0:a][1:a]concat=n=2:v=0:a=1[outa]', '-map', '[outa]',
    '-ar', '44100', '-ac', '2', f'{tmp}/p4.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# p5: 21.8 - 28.8 (7.0s):
# Miami vocal drop ('Ey, I love Miami... What happens in Miami never happened... Dale!')
subprocess.run([
    'ffmpeg', '-y', '-ss', '4.8', '-to', '11.8', '-i', 'music/damn-i-love-miami-pitbull-lil-jon.mp3',
    '-ar', '44100', '-ac', '2', f'{tmp}/p5.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# p6: 28.8 - 43.8 (15.0s):
# Promo pitch ('We're dropping prices starting at just 99 cents today...')
subprocess.run([
    'ffmpeg', '-y', '-ss', '24.2', '-to', '39.2', '-i', 'music/ads/ad-preview-3.mp3',
    '-af', 'apad=whole_dur=15.0', '-ar', '44100', '-ac', '2', f'{tmp}/p6.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# p7: 43.8 - 57.0 (13.2s):
# Outro beat with 2.0s fadeout at end
subprocess.run([
    'ffmpeg', '-y', '-ss', '12.0', '-to', '25.2', '-i', 'music/damn-i-love-miami-pitbull-lil-jon.mp3',
    '-af', 'afade=t=out:st=11.2:d=2.0', '-ar', '44100', '-ac', '2', f'{tmp}/p7.wav'
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# Concat all 7 phases with filter_complex
inputs = []
for i in range(1, 8):
    inputs.extend(['-i', f'{tmp}/p{i}.wav'])

filter_complex = ''.join([f'[{i}:a]' for i in range(7)]) + 'concat=n=7:v=0:a=1[outa]'

target_mp3 = 'music/ads/ad-preview-showcase.mp3'
subprocess.run([
    'ffmpeg', '-y', *inputs,
    '-filter_complex', filter_complex,
    '-map', '[outa]',
    '-ar', '44100', '-ac', '2', '-b:a', '192k',
    target_mp3
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

dur = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', target_mp3]).decode().strip()
size = os.path.getsize(target_mp3)
print(f'Successfully generated {target_mp3}: duration={dur}s, size={size} bytes')
