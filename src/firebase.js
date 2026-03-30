import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDHiEoBtEzNNnBbL0oKLMFlzJZAB4Ty2o",
  authDomain: "marketpin-6076d.firebaseapp.com",
  projectId: "marketpin-6076d",
  storageBucket: "marketpin-6076d.firebasestorage.app",
  messagingSenderId: "405013662200",
  appId: "1:405013662200:web:a1d20519837e50ec8b2e0d",
  measurementId: "G-RH1SG5YPEB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);