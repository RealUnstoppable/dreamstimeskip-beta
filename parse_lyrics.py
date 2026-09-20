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

lines = lyrics.strip().split('\n')
lines = [l for l in lines if l.strip()]

start_time = 9
end_time = 153 # shifted back by 5s from 158
time_per_line = (end_time - start_time) / len(lines)

result = []
current_time = start_time

for line in lines:
    words = line.split()
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
