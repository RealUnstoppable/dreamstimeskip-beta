import { loadFooter } from './footer.js';

async function runTest() {
    console.log('Running tests for loadFooter...');

    // Simple DOM Mock
    let footerElement = null;
    global.document = {
        querySelector: (selector) => {
            if (selector === '.main-footer') {
                return footerElement;
            }
            return null;
        }
    };

    // Test Case 1: .main-footer exists
    console.log('Test Case 1: .main-footer exists');
    footerElement = { innerHTML: '' };
    loadFooter();
    if (footerElement.innerHTML.includes('footer-container') && footerElement.innerHTML.includes('Unstoppable LLC')) {
        console.log('✅ Test Case 1 Passed: Footer HTML injected correctly.');
    } else {
        console.error('❌ Test Case 1 Failed: Footer HTML not injected correctly.');
        process.exit(1);
    }

    // Test Case 2: .main-footer does not exist
    console.log('Test Case 2: .main-footer does not exist');
    footerElement = null;
    try {
        loadFooter();
        console.log('✅ Test Case 2 Passed: Handles missing footer element gracefully.');
    } catch (e) {
        console.error('❌ Test Case 2 Failed: Threw error when footer element missing.', e);
        process.exit(1);
    }

    console.log('\n✨ All tests passed!');
}

runTest().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
