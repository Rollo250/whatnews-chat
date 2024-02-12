import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJCSz-Z7raEnE8Kkwe3awMN3puciaHaoo",
  authDomain: "whatsnews-chat.firebaseapp.com",
  projectId: "whatsnews-chat",
  storageBucket: "whatsnews-chat.appspot.com",
  messagingSenderId: "982589458024",
  appId: "1:982589458024:web:f342abfe6d833bd29f9ddd",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };
