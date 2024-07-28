import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_firebase_api,
  authDomain: import.meta.env.VITE_REACT_APP_firebase_authDomain,
  projectId: import.meta.env.VITE_REACT_APP_firebase_projectId,
  storageBucket: import.meta.env.VITE_REACT_APP_firebase_storageBucket,
  messagingSenderId: import.meta.env.VITE_REACT_APP_firebase_messagingSenderId,
  appId: import.meta.env.VITE_REACT_APP_firebase_appId,
  measurementId: import.meta.env.VITE_REACT_APP_firebase_measurementId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);
