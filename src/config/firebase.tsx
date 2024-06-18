import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDENRl9aTGHqlTZ5C_EYzwCFUeDPhKXDcI",
  authDomain: "food-saviour-d4edb.firebaseapp.com",
  projectId: "food-saviour-d4edb",
  storageBucket: "food-saviour-d4edb.appspot.com",
  messagingSenderId: "143331820755",
  appId: "1:143331820755:web:b4952c3b0f6e1130278026",
  measurementId: "G-N4KQBXLH37",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);
