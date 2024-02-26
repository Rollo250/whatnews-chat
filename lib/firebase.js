import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB2Iek-CpA8NhURlRQ5AKmmH910CXFxCqQ",
  authDomain: "whatsnewschat-app.firebaseapp.com",
  projectId: "whatsnewschat-app",
  storageBucket: "whatsnewschat-app.appspot.com",
  messagingSenderId: "807562154888",
  appId: "1:807562154888:web:2844d61b2d40a6ce0ca03d",
  measurementId: "G-11F9FTHSCQ"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export {app,firestore, auth};
