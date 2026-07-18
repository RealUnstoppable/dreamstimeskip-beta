import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import fs from 'fs';

let testEnv;

async function run() {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-test',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });

  const alice = testEnv.authenticatedContext('alice');
  const db = alice.firestore();

  console.log('Testing old rules - Privilege Escalation...');
  try {
    await assertSucceeds(db.collection('users').doc('alice').set({ isAdmin: true }));
    console.log('Privilege escalation successful (VULNERABLE)');
  } catch (e) {
    console.log('Privilege escalation failed (SECURE)');
  }

  await testEnv.cleanup();
}

run();
