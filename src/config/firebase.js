import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "final-lms-project-mod-B",
  authDomain: "final-lms-project-mod-B",
  databaseURL: "final-lms-project-mod-B",
  projectId: "final-lms-project-mod-B",
  storageBucket: "final-lms-project-mod-B",
  messagingSenderId: "final-lms-project-mod-B",
  appId: "final-lms-project-mod-B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
