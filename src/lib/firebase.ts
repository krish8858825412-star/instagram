
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5o-FeeN_CdaTJQC9bp15kpwlVZBheCcE",
  authDomain: "instagram-d7fcb.firebaseapp.com",
  projectId: "instagram-d7fcb",
  storageBucket: "instagram-d7fcb.firebasestorage.app",
  messagingSenderId: "334000887042",
  appId: "1:334000887042:web:d0318720d0bead5f2cde1b"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
