const x = 1;
function renderCheckoutPage() {
    let discount = 0;
    const updateSummaryUI = () => { console.log('inner'); }
    updateSummaryUI();
}
function updateSummaryUI() { console.log('outer'); }
renderCheckoutPage();
