export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith('https://')) {
    return { url: specifier, shortCircuit: true, format: 'builtin' };
  }
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (url.startsWith('https://')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        export default {};
        export const initializeApp = () => {};
        export const getAuth = () => {};
        export const onAuthStateChanged = () => {};
        export const createUserWithEmailAndPassword = () => {};
        export const signInWithEmailAndPassword = () => {};
        export const signOut = () => {};
        export const sendEmailVerification = () => {};
        export const getFirestore = () => {};
        export const serverTimestamp = () => {};
        export const doc = () => {};
        export const getDoc = () => {};
        export const setDoc = () => {};
        export const updateDoc = () => {};
        export const arrayUnion = () => {};
        export const arrayRemove = () => {};
      `
    };
  }
  return defaultLoad(url, context, defaultLoad);
}
