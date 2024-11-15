import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "@env";

// headers
export const HEADERS = { 'Content-Type': 'application/json' };
// auth routes
export const REGISTER = `${BASE_URL}/auth/register`;
export const SET_USERNAME = `${BASE_URL}/auth/setusername`;
export const DELETE_USER = `${BASE_URL}/auth/deleteuser`;
// item routes
export const ADD_ITEM = `${BASE_URL}/items/additem`;
export const GET_ITEMS = `${BASE_URL}/items/getitems`;
export const GET_ITEM_BY_ID = `${BASE_URL}/items/getitembyid`;
export const DELETE_ITEM = `${BASE_URL}/items/deleteitem`;
export const UPDATE_ITEM = `${BASE_URL}/items/updateitem`;

// check if dev has set the environment variables set
export const CHECK_BASE_URL = () => !!BASE_URL;
const NO_BASE_URL = () => {
  console.warn('BASE_URL ei ole määritetty. Ohitetaan backend-kutsu.');
}

export const postUserToBackend = async (email, uid, registerUsername) => {

  if (!CHECK_BASE_URL()) {
    NO_BASE_URL();
    return;
  }

    const response = await fetch(REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, uid, username: registerUsername }),
        });

    if (!response.ok) {
        throw new Error('Käyttäjän tallentaminen tietokantaan epäonnistui.');
    }

    const result = await response.json();
    return result;
}

export const deleteUserFromBackend = async () => {
  if (!CHECK_BASE_URL()) {
    NO_BASE_URL();
    return;
  }

  const userid = await AsyncStorage.getItem('userId');
  const accessToken = await AsyncStorage.getItem('accessToken');

  try {
      const response = await fetch(DELETE_USER, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userid }),
          });

      if (!response.ok) {
          throw new Error('Palvelimen pyyntö epäonnistui');
      }

  } catch (error) {
      console.error('Delete user error:', error);
      throw error;
  }
}


export const setUsernameToBackend = async (username) => {
  if (!CHECK_BASE_URL()) {
    NO_BASE_URL();
    return;
  }

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



export const addItem = async (itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse) => {
  if (!CHECK_BASE_URL()) {
    NO_BASE_URL();
    return;
  }

  try {
    const userid = await AsyncStorage.getItem('userId');
    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await fetch(ADD_ITEM, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse, userid }),
    });

    return await response.json();
  } catch (error) {

    console.error('Add item error:', error);
    throw error;
  }
};

export const getItems = async () => {
try {
  if (!CHECK_BASE_URL()) {
    NO_BASE_URL();
    return;
  }

  const accessToken = await AsyncStorage.getItem('accessToken');

  const response = await fetch(GET_ITEMS, {
  method: 'GET',
  headers: {
  ...HEADERS,
  'Authorization': `Bearer ${accessToken}`,
  },
  });

  if (!response.ok) {
      const text = await response.text();  
      console.error('Virhe haettaessa ilmoituksia:', text);
      throw new Error(`Virhe: ${response.status}`);
  }
  
  return await response.json();
  } catch (error) {
  console.error('Get items error:', error);
  throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    if (!CHECK_BASE_URL()) {
      NO_BASE_URL();
      return;
    }

    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await fetch(DELETE_ITEM, {
      method: 'DELETE',
      headers: {
        ...HEADERS,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ itemId }),
    });

    return await response.json();
  } catch (error) {
    console.error('Delete item error:', error);
    throw error;
  }
};

export const updateItem = async (itemId, itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse) => {
  try {
    if (!CHECK_BASE_URL()) {
      NO_BASE_URL();
      return;
    }

    const accessToken = await AsyncStorage.getItem('accessToken');

    const response = await fetch(UPDATE_ITEM, {
      method: 'PUT',
      headers: {
        ...HEADERS,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ itemId, itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse }),
    });

    return await response.json();
  } catch (error) {
    console.error('Update item error:', error);
    throw error;
  }
};