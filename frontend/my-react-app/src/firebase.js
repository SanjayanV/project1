import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import {admin} from "firebase-admin";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzBNj20JCE39AUvRXWoV5VlgNaiL-o_94",
  authDomain: "sendora-9e14f.firebaseapp.com",
  databaseURL: "https://sendora-9e14f-default-rtdb.firebaseio.com",
  projectId: "sendora-9e14f",
  storageBucket: "sendora-9e14f.appspot.com",
  messagingSenderId: "844599229027",
  appId: "1:844599229027:web:a6d6751f4d50d6680dd656",
  measurementId: "G-HEYHYSGKBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount.default),
});
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

export { auth, provider, signInWithPopup, sendPasswordResetEmail, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword };