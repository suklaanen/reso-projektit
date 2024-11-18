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
import { take } from 'lodash';

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
        const collectionsToClean = ["items", "users"];

        for (const collectionName of collectionsToClean) {
          const userRef = collection(firestore, collectionName);
          const giverRef = doc(firestore, 'users', uid);

          const giveridQuery = query(userRef, where("giverid", "==", giverRef)); 
          const uidQuery = query(userRef, where("uid", "==", uid));

          const giveridSnapshot = await getDocs(giveridQuery);
          const uidSnapshot = await getDocs(uidQuery);

          giveridSnapshot.forEach(async (doc) => {
            const itemRef = doc.ref; 
            const takersRef = collection(itemRef, "takers"); 

            const takersSnapshot = await getDocs(takersRef);
            takersSnapshot.forEach(async (takerDoc) => {
              await deleteDoc(takerDoc.ref); 
              console.log(`Taker ${takerDoc.id} poistettu tuotteesta ${doc.id}`);
            });

            await deleteDoc(doc.ref);
            console.log(`Rivi ${doc.id} poistettu kokoelmasta ${collectionName} (giverid-ehto)`);
          });

          uidSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            console.log(`Rivi ${doc.id} poistettu kokoelmasta ${collectionName} (uid-ehto)`);
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
    const giverRef = doc(firestore, 'users', uid);

    const itemData = {
      itemname,
      itemdescription,
      postalcode,
      city,
      giverid: giverRef,
      createdAt: serverTimestamp(),
      expirationAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(firestore, 'items'), itemData);
    console.log('Tavara lisätty Firestoreen, ID:', docRef.id);

    const takersRef = collection(firestore, `items/${docRef.id}/takers`);
    await addDoc(takersRef, { placeholder: true });
    console.log('Alikokoelma "takers" luotu tuotteelle:', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('Virhe lisättäessä tavaraa Firestoreen:', error);
    throw error;
  }

};