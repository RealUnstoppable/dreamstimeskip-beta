import os
import re

def process_file(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    # check if fetchCollectionData is imported or if db-utils is imported
    if "fetchCollectionData" in content or "db-utils.js" in content:
        print(f"File: {filepath}")
        imports = re.findall(r'^import .*? from .*?;', content, re.MULTILINE)
        for i in imports:
            if "fetchCollectionData" in i or "db-utils.js" in i:
                print(f"  {i}")

for root, _, files in os.walk('js'):
    for file in files:
        if file.endswith('.js'):
            process_file(os.path.join(root, file))
