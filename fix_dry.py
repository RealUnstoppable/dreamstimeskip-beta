import re
with open('js/utils.js', 'r') as f:
    content = f.read()

# We need mapCollectionData in utils.js
map_collection_data_code = """
export function mapCollectionData(querySnapshot, isMapWithId = true) {
    return querySnapshot.docs.map(doc => {
        return isMapWithId ? { id: doc.id, ...doc.data() } : doc.data();
    });
}
"""

content = content + map_collection_data_code
with open('js/utils.js', 'w') as f:
    f.write(content)
