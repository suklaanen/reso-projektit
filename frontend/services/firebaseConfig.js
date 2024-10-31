import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc } from 'firebase/firestore';
import { APIKEY, AUTHDOMAIN, PROJECTID, STORAGEBUCKET, MESSAGINGSENDERID, APPID } from "@env";

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID
};

initializeApp(firebaseConfig);

const firestore = getFirestore();
const LISTITEMS = 'listitems';

export { firestore, collection, addDoc, query, onSnapshot, deleteDoc, LISTITEMS };