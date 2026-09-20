import fs from 'fs';

let code = fs.readFileSync('js/checkout.js', 'utf-8');

// Replace inner let discount and appliedPromo with outer declarations
code = code.replace(
    'let userCart = {};',
    `let userCart = {};

let discount = 0;
let appliedPromo = '';
let pointsToRedeem = 0;`
);

// Remove the local declarations inside renderCheckoutPage
code = code.replace(
    /    let discount = 0;\n    let appliedPromo = '';\nlet pointsToRedeem = 0;\n/,
    ''
);

// Remove the first inner updateSummaryUI inside renderCheckoutPage
code = code.replace(
    /    const updateSummaryUI = \(\) => \{\n        const \{ subtotal, discountAmount, discountedSubtotal, tax, total \} = renderSummary\(\);\n        document\.getElementById\('summary-subtotal'\)\.textContent = `\$$\{subtotal\.toFixed\(2\)\}`;\n        document\.getElementById\('summary-discount'\)\.textContent = `-\$\$`\+`\{discountAmount\.toFixed\(2\)\}`;\n        document\.getElementById\('summary-discount-row'\)\.style\.display = discount > 0 \? 'flex' : 'none';\n        document\.getElementById\('summary-tax'\)\.textContent = `\$$\{tax\.toFixed\(2\)\}`;\n        document\.getElementById\('summary-total'\)\.textContent = `\$$\{total\.toFixed\(2\)\}`;\n        const points = Math\.floor\(subtotal \* 10\);\n        document\.getElementById\('summary-points'\)\.textContent = `✨ You will earn \$\{points\} Unstoppable Points with this order!`;\n\n    \};\n/g,
    ''
);

// We should also look at renderSummary. Since the outer updateSummaryUI handles the calculations by itself without using renderSummary, we can just use the outer updateSummaryUI logic for the initial render. Wait, the inner one is using renderSummary.
// Let's see what outer updateSummaryUI does.

fs.writeFileSync('js/checkout.js.new', code);
