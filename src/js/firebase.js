import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmP6hJrpE774PN5rnK3NH3WF_jwJmtlsc",
  authDomain: "syntaxforge-61123.firebaseapp.com",
  projectId: "syntaxforge-61123",
  storageBucket: "syntaxforge-61123.firebasestorage.app",
  messagingSenderId: "645115417875",
  appId: "1:645115417875:web:cc0d8549f71265f158f6e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();