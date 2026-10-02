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
blocks = lyrics.strip().split('\n\n')

print(f"Total blocks: {len(blocks)}")
for i, b in enumerate(blocks):
    print(f"Block {i} lines: {len(b.split(chr(10)))}")
