import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, collection, addDoc } from './firebaseConfig';
import { deleteDoc, query, where, getDocs } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { postUserToBackend, deleteUserFromBackend } from './backendController';
import { deleteUserDataFromFirestore, saveUserToFirestore } from './firebaseController';

// Sijoitetaan operaatiot omiin kontrollereihin: 
// backendController.js: jos käyttää databasea
// firebaseController.js: jos käyttää firestorea
// ja kutsutaan niitä esim. täältä

export const userRegister = async ( email, password, registerUsername ) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    Toast.show({
      type: 'success',
      text1: 'Käyttäjätunnus luotu!',
      text2: 'Voit nyt kirjautua!',
    });

  await saveUserToFirestore(uid, registerUsername, email);
  await postUserToBackend(email, uid, registerUsername);

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

export const userDelete = async () => {

  try {
    const user = auth.currentUser;

    await deleteUserDataFromFirestore(user.uid);
    await deleteUserFromBackend();

    await user.delete();
    console.log('Käyttäjän autentikointitili poistettu');
    
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
