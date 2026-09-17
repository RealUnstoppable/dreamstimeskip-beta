const fs = require('fs');

let content = fs.readFileSync('js/account.js', 'utf8');

const search = `<<<<<<< HEAD
        if (!userDoc.exists()) {
            userData = {
                email: user.email,
                username: user.email.split('@')[0],
                membershipLevel: 'free',
                isAdmin: false,
                isBanned: false,
                signupDate: new Date()
            };
            await setDoc(userRef, userData, { merge: true });
=======
        const cacheKey = \`profile_\${user.uid}\`;
        const cachedProfile = sessionStorage.getItem(cacheKey);

        if (cachedProfile) {
            userData = JSON.parse(cachedProfile);
>>>>>>> origin/main`;

const replace = `        const cacheKey = \`profile_\${user.uid}\`;
        const cachedProfile = sessionStorage.getItem(cacheKey);

        if (cachedProfile) {
            userData = JSON.parse(cachedProfile);`;

content = content.replace(search, replace);

// Let's make sure we put the dollar sign back to finalTotal.toFixed(2) in case it was lost in my previous attempt or git merge
content = content.replace(
    /<div style="font-weight: bold; margin-top: 5px;">\$\{finalTotal\.toFixed\(2\)\}<\/div>/,
    '<div style="font-weight: bold; margin-top: 5px;">$\\${finalTotal.toFixed(2)}</div>'
);

fs.writeFileSync('js/account.js', content);
