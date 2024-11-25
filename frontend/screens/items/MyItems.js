import React, { useEffect, useState, useContext } from 'react';
import { ButtonCancel, ButtonConfirm, ButtonDelete } from '../../components/Buttons';
import { Button, Text, View } from 'react-native';
import { BasicSection } from '../../components/CommonComponents';
import globalStyles from "../../assets/styles/Styles.js";
import Toast from 'react-native-toast-message';
import { deleteItemFromFirestore, getCurrentUserItems } from '../../services/firestoreItems.js';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useLoading } from '../../context/LoadingContext.js';
import { get, last } from 'lodash';

export const MyItems = () => {
    const [items, setItems] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const { isLoading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [activeToggleId, setActiveToggleId] = useState(null);
    const authState = useContext(AuthenticationContext);
    const pageSize = 4;

    useEffect(() => {
        const fetchItems = async () => {
            try {

                const { items: newItems, lastDoc: newLastDoc } = await getCurrentUserItems(authState.user.id, lastDoc, pageSize);
                setItems((prevItems) => [...prevItems, ...newItems]);
                setLastDoc(newLastDoc);

            } catch (error) {
                console.error('Virhe omien tavaroiden hakemisessa:', error);
            } finally {
                setLoading(false);
            }
        };

        const initialize = async () => {
            setLoading(true);
            await fetchItems();
            setLoading(false);
        };
        initialize();
    }, []);

    const handleDelete = async (itemId) => {
        try {
          await deleteItemFromFirestore(authState.user.id, itemId); 
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

      if (error) {
        return (
            <Toast type="error" text1="Virhe omien julkaisujen hakemisessa" text2={error.message} /> 
        );
      }

      return (

        <View style={globalStyles.container}>
        {isLoading ? ( 
            <BasicSection>
                <Text>Ladataan...</Text>
            </BasicSection>
        ) : items.length > 0 ? (
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