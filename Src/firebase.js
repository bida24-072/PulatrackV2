import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your live PulaTrack web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6tFQD7tmxnz0k2bvvZEJTwM3QDSVir2c",
  authDomain: "pulatrack-2aae4.firebaseapp.com",
  projectId: "pulatrack-2aae4",
  storageBucket: "pulatrack-2aae4.firebasestorage.app",
  messagingSenderId: "975009403932",
  appId: "1:975009403932:web:4619d1914af40ce179fbd9",
  measurementId: "G-6Q3HPEYD55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances for the app to use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
