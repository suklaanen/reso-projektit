import React, { useEffect, useState, useContext } from 'react';
import { ButtonCancel, ButtonConfirm, ButtonPage } from '../../components/Buttons';
import { Text, View } from 'react-native';
import { BasicSection } from '../../components/CommonComponents';
import globalStyles from "../../assets/styles/Styles.js";
import Toast from 'react-native-toast-message';
import { deleteItemFromFirestore, fetchFirstInQueue, getCurrentUserItems } from '../../services/firestoreItems.js';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useLoading } from '../../context/LoadingContext.js';
import { ItemJoinOnQueue } from './ItemQueues.js';
import { IconTrash, IconChat } from '../../components/Icons.js';
import { useNavigation } from '@react-navigation/native';

export const MyItems = () => {
    const [items, setItems] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const { isLoading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [activeToggleId, setActiveToggleId] = useState(null);
    const [someoneOnQueue, setSomeoneOnQueue] = useState(false);
    const [queueUsernames, setQueueUsernames] = useState({});
    const authState = useContext(AuthenticationContext);
    const navigation = useNavigation(); 
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

    const checkIfSomeoneOnQueue = async (itemId) => {
        try {
            const firstInQueue = await fetchFirstInQueue(itemId);
            setSomeoneOnQueue(firstInQueue !== null);
            
            if (firstInQueue) {
                setQueueUsernames((prevState) => ({
                    ...prevState,
                    [itemId]: firstInQueue,
                }));
            }
        } catch (error) {
            console.error('Virhe jonottajien tarkistamisessa:', error);
        }
    };

    useEffect(() => {
        if (items.length > 0) {
            items.forEach(item => {
                checkIfSomeoneOnQueue(item.id); 
            });
        }
    }, [items]);

    if (error) {
        return <Toast type="error" text1="Virhe omien julkaisujen hakemisessa" text2={error.message} />;
    }

    return (
        <View style={globalStyles.container}>
            {isLoading ? ( 
                <BasicSection>
                    <Text>Ladataan...</Text>
                </BasicSection>
            ) : items.length > 0 ? (
                items.map((item) => (
                    <View key={item.id} style={globalStyles.items}>
                        <Text style={globalStyles.itemName}>{item.itemname}</Text>
                        <Text>{item.itemdescription}</Text>
                        <Text>Paikkakunta: {item.city}</Text>
                        <ItemJoinOnQueue itemId={item.id} />
                        
                        {someoneOnQueue && queueUsernames[item.id] ? (
                             <>
                             <Text>Noutosijalla: {queueUsernames[item.id]}</Text>
                             </>
                        ) : (
                            <>
                            <Text>Ei vielä varaajia.</Text>
                            </>
                        )}

                        {activeToggleId !== item.id && (
                            <View style={globalStyles.viewButtons}>
                                <IconChat onPress={() => navigation.navigate('ItemsMain')} disabled={!queueUsernames[item.id]} />
                                <IconTrash onPress={() => toggleItem(item.id)} />
                            </View>
                        )}

                        {activeToggleId === item.id && (
                            <View style={globalStyles.viewButtons}>
                                <ButtonConfirm title="Poista" onPress={() => handleDelete(item.id)} />
                                <ButtonCancel title="Peruuta" onPress={() => toggleItem(null)} />
                            </View>
                        )}
                    </View>
                ))
            ) : (
                <Text>Julkaisuja ei löytynyt.</Text>
            )}

            {items.length > 0 && (
                <ButtonPage 
                    title="Lataa lisää" 
                    onPress={async () => {
                        const { items: newItems, lastDoc: newLastDoc } = await getCurrentUserItems(authState.user.id, lastDoc, pageSize);
                        setItems((prevItems) => [...prevItems, ...newItems]);
                        setLastDoc(newLastDoc);
                    }} 
                />
            )}
        </View>
    );
};