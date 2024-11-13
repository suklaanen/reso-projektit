import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "@env";

export const ADD_ITEM = `${BASE_URL}/items/additem`;
export const GET_ITEMS = `${BASE_URL}/items/getitems`;
export const GET_ITEM_BY_ID = `${BASE_URL}/items/getitembyid`;
export const DELETE_ITEM = `${BASE_URL}/items/deleteitem`;
export const UPDATE_ITEM = `${BASE_URL}/items/updateitem`;
export const HEADERS = { 'Content-Type': 'application/json' };

console.log('GET_ITEMS:', GET_ITEMS);

export const addItem = async (itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse) => {
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
    const accessToken = await AsyncStorage.getItem('accessToken');

    console.log('accessToken:', accessToken);

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