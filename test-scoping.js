function a() {
  let discount = 0;
  b();
}
function b() {
  console.log(discount);
}
try { a(); } catch (e) { console.log(e.message); }
