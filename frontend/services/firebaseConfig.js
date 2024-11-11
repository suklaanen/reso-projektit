import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIKEY, AUTHDOMAIN, PROJECTID, STORAGEBUCKET, MESSAGINGSENDERID, APPID } from "@env";

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const LISTITEMS = 'listitems';

export { app, auth, firestore, collection, addDoc, query, onSnapshot, deleteDoc, LISTITEMS };