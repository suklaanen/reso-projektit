// Sijoite tänne Firestoreen liittyvät operaatiot
// Käytä jokaisen funktion alussa CHECK_BASE_URL() !!
// Koska halutaan tarkistaa, onko käyttäjälle asetettu BASE_URLia:
// Jos BASE_URL on asetettu, niin ei tehdä Firestore-operaatioita
// Jos BASE_URLia ei ole asetettu, niin Firestore-operaatiot tehdään
/* Voit kopioida tarkistuksen käyttöön alta: **************************

    if (CHECK_BASE_URL()) {
        FOUND_BASE_URL();
        return;
      }

**********************************************************************/
import { auth, firestore, collection, addDoc } from './firebaseConfig';
import { deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { CHECK_BASE_URL } from './backendController';

const FOUND_BASE_URL = () => {
  console.log('BASE_URL on määritetty. Ohitetaan firestore. ');
}

// Tallennetaan käyttäjätunnus Firestoreen
export const  saveUserToFirestore = async (uid, username, email) => {

    if (CHECK_BASE_URL()) {
        FOUND_BASE_URL();
        return;
      }

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
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await deleteDoc(userDoc.ref);
        console.log('Käyttäjän tiedot poistettu Firestoresta');
      } else {
        console.log('Käyttäjän tietoja ei löytynyt Firestoresta');
      }
    } catch (error) {
      console.error('Virhe poistettaessa käyttäjää Firestoresta:', error);
      throw error;
    }
  };