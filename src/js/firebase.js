import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// DO NOT CHANGE!!!
const firebaseConfig = {
	apiKey: "AIzaSyC6j74iFFOH2q5U4kul-R74Z_IOkPyS0yo",

	authDomain: "syntaxforge-fb.firebaseapp.com",

	projectId: "syntaxforge-fb",

	storageBucket: "syntaxforge-fb.firebasestorage.app",

	messagingSenderId: "874960583919",

	appId: "1:874960583919:web:b9fa27d775b508fb53ef1a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const db = getFirestore(app);
