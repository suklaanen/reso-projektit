import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,
  getDoc
} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
import { firestore } from './firebaseConfig'; 
import { serverTimestamp } from 'firebase/firestore';

// Tallennetaan käyttäjätunnus Firestoreen
export const  saveUserToFirestore = async (uid, username, email) => {

    try {
      await addDoc(collection(firestore, 'users'), {
        username,
        email: email.toLowerCase(),
        uid,
      });
      console.log('Käyttäjä lisätty Firestoreen');
    } catch (error) {
      console.error('Virhe lisättäessä käyttäjää Firestoreen:', error);
      throw error;
    }
  };

// Poistetaan käyttäjän tiedot Firestoresta
export const deleteUserDataFromFirestore = async (uid) => {

    try {
        const collectionsToClean = ["users", "items"];

        for (const collectionName of collectionsToClean) {
          const userRef = collection(firestore, collectionName);

          const uidQuery = query(userRef, where("uid", "==", uid));
          const giveridQuery = query(userRef, where("giverid", "==", uid));

          const uidSnapshot = await getDocs(uidQuery);
          const giveridSnapshot = await getDocs(giveridQuery);

          uidSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            console.log(`Rivi ${doc.id} poistettu kokoelmasta ${collectionName} (uid-ehto)`);
          });

          giveridSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            console.log(`Rivi ${doc.id} poistettu kokoelmasta ${collectionName} (giverid-ehto)`);
          });

        }
    } catch (error) {
      console.error("Virhe käyttäjän tietojen poistossa Firestoresta:", error);
      throw error;
    }
};

// Lisätään tuote Firestoreen
export const addItemToFirestore = async (itemname, itemdescription, postalcode, city ) => {
  const auth = getAuth();
  const user = auth.currentUser; 
  const uid = user ? user.uid : null; 

  if (!itemname || !itemdescription || !postalcode || !city) {
    console.error('Virhe: Yksi tai useampi kenttä on tyhjä!');
    throw new Error('Täytä puuttuvat kentät.');
  }

  if (!uid) {
    console.error('Virhe: Käyttäjä ei ole kirjautunut!');
    throw new Error('Käyttäjä ei ole kirjautunut.');
  }

  try {
    const itemData = {
      itemname,
      itemdescription,
      postalcode,
      city,
      giverid: uid, 
      createdAt: serverTimestamp(),
      expirationAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(firestore, 'items'), itemData);
    console.log('Tavara lisätty Firestoreen, ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Virhe lisättäessä tavaraa Firestoreen:', error);
    throw error;
  }
};