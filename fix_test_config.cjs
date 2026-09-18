const { execSync } = require('child_process');

try {
  execSync('git checkout origin/testing-improvement-handleupdatequantity-15079331358395511670 -- tests/ js/__tests__/ js/auth.test.js js/shop.test.js js/tests/ jest.config.js jest.setup.js package.json');
} catch(e) {
  console.log(e.message);
}
