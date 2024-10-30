// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: `AIzaSyDpaYdAag8HvpAet_79zxPVIC09UpB797w`,
  authDomain: `posacro-95de0.firebaseapp.com`,
  projectId: `posacro-95de0`,
  storageBucket: `posacro-95de0.appspot.com`,
  messagingSenderId: `782448179607`,
  appId: `1:782448179607:web:28c8f27b5c6b14de356cd2`,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
export const leaderboardCollection = collection(db, "leaderboard");
