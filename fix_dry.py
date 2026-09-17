import re
import os

# We will just remove fetchCollectionData from firebase.js and utils/db-utils.js completely.
# Since no other file calls them! (We grep'ed and only admin.html had it, which we'll check too).

def fix_file(path, regex_str):
    with open(path, 'r') as f:
        content = f.read()

    content = re.sub(regex_str, '', content, flags=re.DOTALL)

    with open(path, 'w') as f:
        f.write(content)


fix_file('js/firebase.js', r'/\*\*\n \* Shared Utility to fetch a collection\'s data.*?\n \*/\nexport async function fetchCollectionData\(.*?\n\}\n')
fix_file('js/utils/db-utils.js', r'/\*\*\n \* Fetches all documents from a Firestore collection\..*?\n \*/\nexport async function fetchCollectionData\(.*?\n\}\n')

# Check admin.html
with open('admin.html', 'r') as f:
    admin_content = f.read()

# We can see in admin.html it uses: import { fetchCollectionData, escapeHTML } from '/js/utils.js';
# And we can see if it calls it.
