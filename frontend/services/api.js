import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebaseConfig';
import Toast from 'react-native-toast-message';
import { BASE_URL } from "@env";

export const REGISTER = `${BASE_URL}/auth/register`;
export const SET_USERNAME = `${BASE_URL}/auth/setusername`;
export const DELETE_USER = `${BASE_URL}/auth/deleteuser`;
export const HEADERS = { 'Content-Type': 'application/json' };

export const userRegister = async ( email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    Toast.show({
      type: 'success',
      text1: 'Käyttäjätunnus luotu!',
      text2: 'Voit nyt kirjautua!',
    });

  // post user data into database
    const response = await fetch(REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, uid }),
    });

    if (!response.ok) {
      throw new Error('Käyttäjän tallentaminen tietokantaan epäonnistui.');
    }

    const result = await response.json();
    return result;
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

export const userLogin = async (email, password) => {
  try {
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
    const userid = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await fetch(DELETE_USER, {
      method: 'DELETE',
      headers: {
        ...HEADERS,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userid }),
    });

    return await response.json();
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
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
