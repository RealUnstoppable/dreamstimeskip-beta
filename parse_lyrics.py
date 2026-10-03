import json

lyrics = """See u so excited
U got him locked down
Ur moving like I did
Before I found out
He ain’t just a pretty faced talker
Good with his money
Close to his mother
Ur seeing one-sided
U got him right now

And she be like he’s so perfect
I be like oh, what version ?
Ain’t nobody got me this nervous
Oh baby I been there
And right in that same position
So baby don’t get this twisted
No, nothing could make me miss it
Take him he’s yours

It’s ok I’m ok
Had him in the 1st place
It’s ok I’m ok
It’s ok I’m ok
I don’t rlly gotta say it’s ok
You can have him anyway
Anyway
You can have him anyway
Anyway

Was such a romantic
U got me like fuck that
Some months and some long flights
Now I can’t go near that

And she be like he’s so perfect
I be like oh, what version ?
Ain’t nobody got me this nervous
Oh baby I been there
And right in that same position
So baby don’t get this twisted
No, nothing could make me miss it
Take him he’s yours

It’s ok I’m ok
Had him in the 1st place
It’s ok I’m ok
It’s ok I’m ok
I don’t rlly gotta say it’s ok
You can have him anyway
Anyway
You can have him anyway
Anyway

When he leaves u in the dirt
Don’t tell me u didn’t hear it from me first
When u realize he’s a flirt
Don’t say I didn’t warn u cause it hurts

It’s ok I’m ok
Had him in the 1st place
It’s ok I’m ok
It’s ok I’m ok
I don’t rlly gotta say it’s ok
You can have him anyway
Anyway
You can have him anyway
Anyway"""

blocks = lyrics.strip().split('\n\n')
all_lines = []
for i, block in enumerate(blocks):
    for line in block.split('\n'):
        if line.strip():
            # mark whether this line is the start of the second half (Block 3)
            # which is right after the first Chorus.
            is_start_of_second_half = False
            if i == 3 and line == block.split('\n')[0]:
                is_start_of_second_half = True
            all_lines.append((line.strip(), is_start_of_second_half))

start_time = 13.0
end_time = 158.0
gap_duration = 1.0

# Total duration for lyrics text
text_duration = (end_time - start_time) - gap_duration
time_per_line = text_duration / len(all_lines)

result = []
current_time = start_time

for line_text, is_gap_start in all_lines:
    if is_gap_start:
        current_time += gap_duration

    words = line_text.split()
    word_duration = time_per_line / len(words)
    word_objs = []

    word_time = current_time
    for word in words:
        word_objs.append({
            "text": word,
            "start": round(word_time, 2),
            "duration": round(word_duration, 2)
        })
        word_time += word_duration

    result.append({
        "start": round(current_time, 2),
        "end": round(current_time + time_per_line, 2),
        "words": word_objs
    })
    current_time += time_per_line

print(json.dumps(result, indent=4))
