import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-9370066213-e8465",
  "appId": "1:814198702972:web:3fc7d967138f1dd1e25af9",
  "apiKey": "AIzaSyA5oWqovB78-ZA2EH2WaK9NOQTvAiv3fUM",
  "authDomain": "studio-9370066213-e8465.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "814198702972"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
