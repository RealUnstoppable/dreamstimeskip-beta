const fs = require('fs');
let code = fs.readFileSync('js/shop.js', 'utf8');

code = code.replace(/if \(reviewModal\) reviewModal.style.display = 'flex';/g, "const reviewModal = document.getElementById('reviewModal');\n    if (reviewModal) reviewModal.style.display = 'flex';");

code = code.replace(/if \(writeReviewSection\) writeReviewSection.style.display = 'block';/g, "const writeReviewSection = document.getElementById('writeReviewSection');\n        if (writeReviewSection) writeReviewSection.style.display = 'block';");

code = code.replace(/if \(writeReviewSection\) writeReviewSection.style.display = 'none';/g, "const writeReviewSection = document.getElementById('writeReviewSection');\n        if (writeReviewSection) writeReviewSection.style.display = 'none';");

code = code.replace(/if \(loginToReviewMsg\) loginToReviewMsg.style.display = 'none';/g, "const loginToReviewMsg = document.getElementById('loginToReviewMsg');\n        if (loginToReviewMsg) loginToReviewMsg.style.display = 'none';");
code = code.replace(/if \(loginToReviewMsg\) loginToReviewMsg.style.display = 'block';/g, "const loginToReviewMsg = document.getElementById('loginToReviewMsg');\n        if (loginToReviewMsg) loginToReviewMsg.style.display = 'block';");

code = code.replace(/if \(closeReviewBtn && reviewModal\)/g, "const closeReviewBtn = document.getElementById('closeReviewBtn');\n    const reviewModal = document.getElementById('reviewModal');\n    if (closeReviewBtn && reviewModal)");

code = code.replace(/if \(writeReviewForm\)/g, "const writeReviewForm = document.getElementById('writeReviewForm');\n    if (writeReviewForm)");

fs.writeFileSync('js/shop.js', code, 'utf8');
console.log("Fixed shop.js reference errors!");
