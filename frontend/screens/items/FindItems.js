import React, { useState, useEffect } from 'react';
import { ButtonNavigate } from '../../components/Buttons';
import { FlatList, Text, View, ActivityIndicator, StyleSheet, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { addItem, getItems, getItemById, deleteItem, updateItem } from '../../services/items.js';
import Toast from 'react-native-toast-message';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig.js'; 

/*const itemsCollection = collection(firestore, 'items'); 

const getItemsFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(itemsCollection);
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return items;
  } catch (error) {
    throw new Error('Error fetching items from Firestore: ' + error.message);
  }
*/

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        //relaatiokannasta haku:
        const fetchedItems = await getItems();
        // firebase cloud storagesta haku:
        //const fetchedItems = await getItemsFromFirestore();
        console.log('Fetched items:', fetchedItems);  
        setItems(fetchedItems.items); 
        //setItems(fetchedItems);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
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
    <>
      {items.map((item) => (
        <View key={item.itemid} style={styles.itemContainer}>
          <Text style={styles.itemName}>{item.itemname}</Text>
          <Text>{item.itemdescription}</Text>
          <Text>{item.city}</Text>
          <Text>{item.postalcode}</Text>
          <Text>{item.giverid}</Text>
          <Text>{item.created_at}</Text>
          <Text>{item.expiration_at}</Text>
          <Text>{item.queuetruepickfalse}</Text>
        </View>
      ))}
    </>
  );
};

export const ItemAddNew = () => {
  const [itemname, setItemname] = useState('');
  const [itemdescription, setItemdescription] = useState('');
  const [itempicture, setItempicture] = useState('');
  const [postalcode, setPostalcode] = useState('');
  const [city, setCity] = useState('');
  const [queuetruepickfalse, setQueuetruepickfalse] = useState(false); 
  const navigation = useNavigation();

  const handleAddItem = async () => {
    if (!itemname || !itemdescription || !itempicture || !postalcode || !city) {
      Toast.show({
        type: 'error',
        text1: 'Kaikki kentät ovat pakollisia!',
      });
      return;
    }

    try {
      const response = await addItem(itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse);
      console.log('Add item response:', response);
      Toast.show({
        type: 'success',
        text1: 'Julkaisu lisätty!',
      });

      navigation.navigate('ItemsMain');
    }
    catch (error) {
      console.error('Add item error:', error);
      Toast.show({
        type: 'error',
        text1: 'Virhe julkaisua lisättäessä',
        text2: error.message,
      });
    }
  }
  
  return (
    <View style={styles.container}>
      <Heading title="Lisää uusi ilmoitus" />
      <>
        <TextInput
          style={styles.input}
          placeholder="Otsikko (tuotteen nimi)"
          value={itemname}
          onChangeText={setItemname}
        />

        <TextInput
          style={styles.input}
          placeholder="Kuvaus tuotteesta"
          value={itemdescription}
          onChangeText={setItemdescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Kuva URL"
          value={itempicture}
          onChangeText={setItempicture}
        />
        <TextInput
          style={styles.input}
          placeholder="Postinumero"
          keyboardType="numeric"
          value={postalcode}
          onChangeText={setPostalcode}
        />
        <TextInput
          style={styles.input}
          placeholder="Kaupunki"
          value={city}
          onChangeText={setCity}
        />
        
        <View style={styles.queueContainer}>
          <Text>Valitse ilmoituksen tyyppi:</Text>
          <View style={styles.radioGroup}>
            <Button
              title="Jonotus"
              onPress={() => setQueuetruepickfalse(true)}
              color={queuetruepickfalse ? 'blue' : 'gray'}
            />
            <Button
              title="Poiminta"
              onPress={() => setQueuetruepickfalse(false)}
              color={!queuetruepickfalse ? 'blue' : 'gray'}
            />
          </View>
        </View>

        <Button title="Julkaise" onPress={handleAddItem} color="#4CAF50" />
      </>
    </View>
  );
};

export const ItemModify = () => {
  return (
    <>
      <Heading title="Muokkaa" />
      <BasicSection>
        X{"\n\n"}
      </BasicSection>
    </>
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

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 16,
  },
  itemContainer: {
      marginBottom: 16,
      padding: 12,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
  },
  itemName: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  errorText: {
      color: 'red',
      fontSize: 16,
  },

  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 8,
  },
  queueContainer: {
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
});
