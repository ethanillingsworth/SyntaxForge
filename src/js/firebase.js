// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {

    apiKey: "AIzaSyC6j74iFFOH2q5U4kul-R74Z_IOkPyS0yo",

    authDomain: "syntaxforge-fb.firebaseapp.com",

    projectId: "syntaxforge-fb",

    storageBucket: "syntaxforge-fb.firebasestorage.app",

    messagingSenderId: "874960583919",

    appId: "1:874960583919:web:b9fa27d775b508fb53ef1a"

};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const auth = getAuth(app)
