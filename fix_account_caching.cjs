const fs = require('fs');

let content = fs.readFileSync('js/account.js', 'utf8');

content = content.replace(/console\.error\("Error rendering profile:", error\);/g, 'console.error("Manager info: Error rendering profile:", error);');
content = content.replace(/console\.error\("Error rendering orders:", error\);/g, 'console.error("Manager info: Error rendering orders:", error);');
content = content.replace(/console\.error\("Error fetching user profile:", e\);/g, 'console.error("Manager info: Error fetching user profile:", e);');
content = content.replace(/console\.error\("Error fetching rewards:", e\);/g, 'console.error("Manager info: Error fetching rewards:", e);');

content = content.replace(
    /const querySnapshot = await getDocs\(q\);\s*\/\/\s*Memoization check\s*const serializedOrders = JSON\.stringify\(querySnapshot\.docs\.map\(d => \(\{ id: d\.id, \.\.\.d\.data\(\) \}\)\)\);\s*if \(serializedOrders === currentOrdersCache\) return;\s*currentOrdersCache = serializedOrders;/g,
    `const querySnapshot = await getDocs(q);\n\n        // Memoization check\n        const serializedOrders = JSON.stringify(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));\n        if (serializedOrders === currentOrdersCache) return;\n        currentOrdersCache = serializedOrders;`
);

fs.writeFileSync('js/account.js', content, 'utf8');
