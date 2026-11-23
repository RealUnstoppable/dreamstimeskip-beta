export default function test(name, fn) {
  return globalThis.test(name, async () => {
    const t = {
      test: async (_subname, subfn) => {
        return await subfn();
      }
    };
    await fn(t);
  });
}

export const describe = (name, fn) => globalThis.describe(name, fn);
export const it = (name, fn) => globalThis.it(name, fn);
export const testFn = test;
export { test };
export const beforeEach = (fn) => globalThis.beforeEach(fn);
export const afterEach = (fn) => globalThis.afterEach(fn);
export const before = (fn) => (globalThis.beforeAll ? globalThis.beforeAll(fn) : globalThis.beforeEach(fn));
export const after = (fn) => (globalThis.afterAll ? globalThis.afterAll(fn) : globalThis.afterEach(fn));
