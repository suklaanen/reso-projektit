// Sijoite tänne Firestoreen liittyvät operaatiot
// Käytä jokaisen funktion alussa CHECK_BASE_URL() !!
// Koska halutaan tarkistaa, onko käyttäjälle asetettu BASE_URLia:
// Jos BASE_URL on asetettu, niin ei tehdä Firestore-operaatioita
// Jos BASE_URLia ei ole asetettu, niin Firestore-operaatiot tehdään
/***************************
    if (CHECK_BASE_URL()) {
        FOUND_BASE_URL();
        return;
      }
**********************************************************************/

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

import { CHECK_BASE_URL } from './backendController';
import { firestore } from './firebaseConfig'; 
import { serverTimestamp } from 'firebase/firestore';

const FOUND_BASE_URL = () => {
  console.log('BASE_URL on määritetty. Ohitetaan firestore. ');
}

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

    if (CHECK_BASE_URL()) {
        FOUND_BASE_URL();
        return;
      }

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

// kesken :) 
// Poistetaan vanhat ilmoitukset Firestoresta
export const deleteExpiredItems = async () => {
    try {
      const now = Date.now();
      const itemsRef = collection(firestore, 'items');
      const q = query(itemsRef, where('expirationAt', '<', now)); 
  
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);  
        console.log(`Tavara ${doc.id} poistettu Firestoresta.`);
      });
    } catch (error) {
      console.error('Virhe vanhentuneiden tavaroiden poistossa:', error);
      throw error;
    }
  };

  /*
  // Ajastettu / vanhojen ilmojen poisto vielä pittää miettii
export const scheduledDeleteExpiredItems = functions.pubsub.schedule('every 10 minutes').onRun(async (context) => {
    console.log('Poistetaan vanhentuneet tavarat...');
    await deleteExpiredItems();
  }); */
  