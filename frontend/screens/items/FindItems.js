import React, { useState, useEffect } from 'react';
import { ButtonAdd, ButtonCancel, ButtonConfirm, ButtonDelete, ButtonNavigate } from '../../components/Buttons';
import { Text, View, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BasicSection, Heading } from '../../components/CommonComponents';
import { addItemToFirestore, getItemsByUser, deleteItemFromFirestore } from '../../services/firebaseController.js';
import { firestore } from '../../services/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, getDoc, query, orderBy, limit, startAfter, } from 'firebase/firestore';
import globalStyles from "../../assets/styles/Styles.js";
import Toast from 'react-native-toast-message';

const itemsCollection = collection(firestore, 'items');

export const fetchPaginatedItems = async (collectionRef, lastDoc = null, pageSize = 10) => {
  try {
    let q = query(collectionRef, orderBy('createdAt', 'desc'), limit(pageSize));
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      items,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1],
    };
  } catch (error) {
    console.error('Virhe sivutuksen aikana:', error);
    throw error;
  }
};

export const fetchItems = async () => {
  try {
    const querySnapshot = await getDocs(itemsCollection);
    const items = querySnapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data
      };
    });
    console.log(items);
    return items;
  } catch (error) {
    console.error('Virhe tavaroiden hakemisessa:', error);
  }
};

export const NoItemsWhenLoggedOut = () => {
  return (
    <>
      <BasicSection>
        Kirjaudu sisään palvelun käyttäjänä päästäksesi tekemään löytöjä ja julkaisemaan omia ilmoituksia! {"\n"}
      </BasicSection>
    </>
  );
};

export const NavigateToThisUsersItems = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonNavigate
        title="Ilmoitukset"
        onPress={() => navigation.navigate('MyItems')}
      />
    </>
  );
};

export const NavigateToThisUsersQueue = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonNavigate
        title="Varaukset"
        onPress={() => navigation.navigate('MyQueues')}
      />
    </>
  );
};

export const AllItems = () => {
  const [items, setItems] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 4;

  const loadItems = async () => {

    setLoading(true);
    try {
      const { items: newItems, lastVisible } = await fetchPaginatedItems(itemsCollection, lastDoc, pageSize);

      setItems(prevItems => [...prevItems, ...newItems]);
      setLastDoc(lastVisible);

      if (!lastVisible || newItems.length < pageSize) {
        setHasMore(false);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  if (loading && items.length === 0) {
    return (
      <BasicSection>
        <Text>Ladataan...</Text>
      </BasicSection>
    );
  }

  if (error) {
    return (
      <BasicSection>
        <Toast type="error" text1="Virhe julkaisujen hakemisessa" text2={error.message} />
        <Text>Virhe: {error.message}</Text>
      </BasicSection>
    );
  }
  
  return (
    <View>
    {items.map((item) => (
      <View key={item.id} style={globalStyles.itemContainer}>
        <Text style={globalStyles.itemName}>{item.itemname}</Text>
        <Text>{item.itemdescription}</Text>
        <Text>Sijainti: {item.postalcode}, {item.city}</Text>
        <Text>Julkaisija: -- </Text>
      </View>
    ))}

      {hasMore && ( <Button title="Näytä lisää" onPress={loadItems} disabled={loading} /> )}

      {!hasMore && <Text style={{ textAlign: 'center', marginTop: 16 }}>Ei enempää kohteita</Text>}
    </View>
  );
};

export const ItemAddNew = () => {
  const [itemname, setItemname] = useState('');
  const [itemdescription, setItemdescription] = useState('');
  const [postalcode, setPostalcode] = useState('');
  const [city, setCity] = useState('');
  const navigation = useNavigation();

  const handleAddItem = async () => {

    try {
      const response = await addItemToFirestore(itemname, itemdescription, postalcode, city);
      console.log('Add item response:', response);
      Toast.show({ type: 'success', text1: 'Julkaisu lisätty!',  });

      navigation.navigate('ItemsMain');
    } catch (error) {
      console.error('Add item error:', error);
      Toast.show({ type: 'error', text1: 'Virhe julkaisua lisättäessä', text2: error.message, });
    }
  };

  return (
    <View style={globalStyles.container}>
      <Heading title="Lisää uusi ilmoitus" />
      <TextInput
        style={globalStyles.textInput}
        placeholder="Otsikko (tuotteen nimi)"
        value={itemname}
        onChangeText={setItemname}
      />
      <TextInput
        style={globalStyles.textInput}
        placeholder="Kuvaus tuotteesta"
        value={itemdescription}
        onChangeText={setItemdescription}
        multiline
      />
      <TextInput
        style={globalStyles.textInput}
        placeholder="Postinumero"
        keyboardType="numeric"
        value={postalcode}
        onChangeText={setPostalcode}
      />
      <TextInput
        style={globalStyles.textInput}
        placeholder="Kaupunki"
        value={city}
        onChangeText={setCity}
      />

      <ButtonAdd title="Julkaise" onPress={handleAddItem} color="#4CAF50" />
    </View>
  );
};

export const ItemDelete = () => {
  return (
    <>
      <Heading title="Delete" />
      <BasicSection>
        X{"\n\n"}
      </BasicSection>
    </>
  );
};

export const ItemJoinOnQueue = () => {
  return (
    <>
      <Heading title="Join" />
      <BasicSection>
        X{"\n\n"}
      </BasicSection>
    </>
  );
};

export const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeToggleId, setActiveToggleId] = useState(null);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('Käyttäjä ei ole kirjautunut sisään.');
        }

        const fetchedItems = await getItemsByUser(user.uid);
        setItems(fetchedItems.items);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      await deleteItemFromFirestore(itemId); 
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId)); 
      console.log(`Item ${itemId} poistettu.`);
    } catch (error) {
      console.error('Virhe poistettaessa itemiä:', error);
      setError(error);
    }
  };

  const toggleItem = (itemId) => {
    setActiveToggleId((prevId) => (prevId === itemId ? null : itemId)); 
  };

  if (loading) {
    return (
      <BasicSection> <Text>Ladataan...</Text> </BasicSection>
    );
  }

  if (error) {
    return (
        <Toast type="error" text1="Virhe omien julkaisujen hakemisessa" text2={error.message} /> 
    );
  }

  return (
    <View style={globalStyles.container}>

      {items.length > 0 ? (
        items.map((item) => (
          <View key={item.id} style={globalStyles.itemContainer}>
            <Text style={globalStyles.itemName}>{item.itemname}</Text>
            <Text>{item.itemdescription}</Text>
            <Text>{item.city}</Text>
            <Text>{item.postalcode}</Text>

            {activeToggleId !== item.id && (
              <View style={globalStyles.viewButtons}>
                <ButtonDelete title="Poista" onPress={() => toggleItem(item.id)} />
              </View>
            )}

            {activeToggleId === item.id && (
              <View style={globalStyles.viewButtons}>
                <ButtonConfirm title="Vahvista" onPress={() => handleDelete(item.id)} />
                <ButtonCancel title="Peruuta" onPress={() => toggleItem(null)} />
              </View>
            )}
            
          </View>
        ))
      ) : (
        <Text>Julkaisuja ei löytynyt.</Text>
      )}

    </View>
  );
}; 