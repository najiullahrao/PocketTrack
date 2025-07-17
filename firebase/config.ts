import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAueUWjcnd6BWlgSr16d7XlqIC2MTcSEBQ",
  authDomain: "pockettrack-fbae1.firebaseapp.com",
  projectId: "pockettrack-fbae1",
  storageBucket: "pockettrack-fbae1.appspot.com",
  messagingSenderId: "729583008302",
  appId: "1:729583008302:web:022c97b64a08e978187dbf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
