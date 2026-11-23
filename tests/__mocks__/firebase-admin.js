// tests/__mocks__/firebase-admin.js
const createMockDoc = (id = 'mock-doc') => ({
  id,
  exists: false,
  data: () => ({}),
  get: async () => ({ exists: false, data: () => ({}) }),
  set: async () => {},
  update: async () => {},
  delete: async () => {},
});

const createMockQuery = () => {
  const query = {
    where: () => query,
    orderBy: () => query,
    limit: () => query,
    startAfter: () => query,
    get: async () => ({
      empty: true,
      size: 0,
      docs: [],
    }),
    doc: (id) => createMockDoc(id),
    add: async (data) => ({ id: 'mock-doc-id', ...data }),
  };
  return query;
};

export const adminDb = {
  collection: (name) => createMockQuery(),
  batch: () => ({
    set: () => {},
    update: () => {},
    delete: () => {},
    commit: async () => {},
  }),
};

export const FieldValue = {
  serverTimestamp: () => ({ _seconds: Math.floor(Date.now() / 1000), toMillis: () => Date.now() }),
  increment: (n) => n,
  arrayUnion: (...items) => items,
  arrayRemove: (...items) => items,
};

export const Timestamp = {
  now: () => ({ toMillis: () => Date.now() }),
  fromMillis: (ms) => ({ toMillis: () => ms }),
};

export const adminApp = {};
export const admin = {
  apps: [adminApp],
  initializeApp: () => adminApp,
};
export const getFirestore = () => adminDb;

export default adminDb;
