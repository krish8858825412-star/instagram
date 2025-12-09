import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1rFDsXNwqnOrawI4S_GxbGPOwDmeAkYE",
  authDomain: "spare-study.firebaseapp.com",
  databaseURL: "https://spare-study-default-rtdb.firebaseio.com",
  projectId: "spare-study",
  storageBucket: "spare-study.firebasestorage.app",
  messagingSenderId: "729648401813",
  appId: "1:729648401813:web:bd6daf4f54133d74c1fa9c"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
