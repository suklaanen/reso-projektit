import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, collection, addDoc } from './firebaseConfig';
import { deleteDoc, query, where, getDocs } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { BASE_URL } from "@env";
import { postUserToBackend, deleteUserFromBackend } from './backendController';

// siirrän näitä reittejä vähitellen backendControlleriin : 
export const REGISTER = `${BASE_URL}/auth/register`;
export const SET_USERNAME = `${BASE_URL}/auth/setusername`;
export const DELETE_USER = `${BASE_URL}/auth/deleteuser`;
export const HEADERS = { 'Content-Type': 'application/json' };

export const userRegister = async ( email, password, registerUsername ) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    Toast.show({
      type: 'success',
      text1: 'Käyttäjätunnus luotu!',
      text2: 'Voit nyt kirjautua!',
    });

  // Tallennetaan käyttäjätunnus Firestoreen
  const saveUserToFirestore = async (uid, username, email) => {
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

  await saveUserToFirestore(uid, registerUsername, email);

  postUserToBackend(email, uid, registerUsername);

  return { success: true, uid, username: registerUsername, email };
  
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Käyttäjän luominen epäonnistui.',
      text2: error.message,
    });
    console.error('Rekisteröinnissä tapahtui virhe:', error.message);
    throw error;
  }
};

export const userLogin = async (credential, password) => {
  try {
    let email = credential;

    if (!credential.includes('@')) {
      const usersRef = collection(firestore, 'users');
      const usernameQuery = query(usersRef, where('username', '==', credential));
      const querySnapshot = await getDocs(usernameQuery);

      if (querySnapshot.empty) {
        throw new Error('Käyttäjätunnusta ei löytynyt');
      }

      const userDoc = querySnapshot.docs[0];
      email = userDoc.data().email;
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const accessToken = await userCredential.user.getIdToken();

    if (accessToken) {
      await AsyncStorage.setItem('userId', uid);
      await AsyncStorage.setItem('accessToken', accessToken);
    } else {
      console.warn('accessToken was undefined. Skipping storage of access token.');
    }

    return { success: true, userId: uid, accessToken };
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Kirjautuminen epäonnistui',
      text2: error.message,
    });
    console.error('Kirjautuminen epäonnistui:', error.message);
    throw error;
  }
};

export const userDelete = async (userid, accessToken, navigation, setAuthState) => {

  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Käyttäjää ei löytynyt');
    }

    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await deleteDoc(userDoc.ref);
      console.log('Käyttäjän tiedot poistettu Firestoresta');
    } else {
      console.log('Käyttäjän tietoja ei löytynyt Firestoresta');
    }

    deleteUserFromBackend();
    
    await user.delete();
    console.log('Käyttäjän autentikointitili poistettu');

    setAuthState(null);
    clearUserData();
    
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Poistovirhe',
        text2: error.message,
      });
  }
};


export const userLogout = async () => {
  try {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('accessToken');
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Virhe uloskirjautumisessa',
      text2: error.message,
    });
    console.error('Logout error:', error);
    throw error;
  }
};

export const setUsername = async (username) => {
  try {
    const userid = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await fetch(SET_USERNAME, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userid, username }),
    });

    return await response.json();
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Virhe asettaessa nimimerkkiä',
      text2: error.message,
    });
    console.error('Set username error:', error);
    throw error;
  }
};
