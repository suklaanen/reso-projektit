import React, { useState, useEffect } from 'react';
import { ButtonNavigate } from '../../components/Buttons';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BasicSection, Heading } from '../../components/CommonComponents';
import { addItemToFirestore, fetchUsername } from '../../services/firebaseController.js';
import { firestore,} from '../../services/firebaseConfig';
import { collection, getDocs, getDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

const itemsCollection = collection(firestore, 'items');

const fetchGiverData = async (giverRef) => {
  try {
    if (!giverRef) return null;
    const giverDoc = await getDoc(giverRef);
    if (giverDoc.exists()) {
      return giverDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Virhe haettaessa julkaisijaa', error);
    return null;
  }
};

export const fetchItems = async () => {
  try {
    const querySnapshot = await getDocs(itemsCollection);
    const items = querySnapshot.docs.map(doc => {
      const data = doc.data();

      const createdAt = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'No date available';
      const expirationAt = data.expirationAt ? new Date(data.expirationAt.seconds * 1000).toLocaleString() : 'No expiration date';

      return {
        id: doc.id,
        ...data,
        createdAt,
        expirationAt,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [giverData, setGiverData] = useState({});

  useEffect(() => {
    const getItemsFromFirestore = async () => {
      try {
        const fetchedItems = await fetchItems();
        console.log('Fetched items:', fetchedItems);  
        setItems(fetchedItems);

        if (fetchedItems.length > 0) {
          const giverRef = fetchedItems[0].giverid; 
          const giverDetails = await fetchGiverData(giverRef);
          setGiverData(giverDetails);
        }

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getItemsFromFirestore();
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
      <View key={item.id} style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.itemname}</Text>
        <Text>{item.itemdescription}</Text>
        <Text>Sijainti: {item.postalcode}, {item.city}</Text>
        <Text>Julkaisija: {giverData ? giverData.username : 'Ei saatavilla'} </Text>
        <Text>Julkaistu: {item.createdAt}</Text>
        <Text>Vanhenee: {item.expirationAt}</Text>
      </View>
    ))}
    </>
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
      Toast.show({
        type: 'success',
        text1: 'Julkaisu lisätty!',
      });

      navigation.navigate('ItemsMain');
    } catch (error) {
      console.error('Add item error:', error);
      Toast.show({
        type: 'error',
        text1: 'Virhe julkaisua lisättäessä',
        text2: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Heading title="Lisää uusi ilmoitus" />
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

      <Button title="Julkaise" onPress={handleAddItem} color="#4CAF50" />
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

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const fetchedItems = await getItemsByUser();
        setItems(fetchedItems.items);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
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
        <Toast type="error" text1="Virhe omien julkaisujen hakemisessa" text2={error.message} />
        <Text>Virhe: {error.message}</Text>
      </BasicSection>
    );
  }

  return (
    <View style={styles.container}>
      <Heading title="Omat ilmoitukset" />
      
      {items.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Text style={styles.itemName}>{item.itemname}</Text>
          <Text>{item.itemdescription}</Text>
          <Text>{item.city}</Text>
          <Text>{item.postalcode}</Text>
        </View>
      ))}
      
    </View>
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
