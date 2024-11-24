import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { BasicSection } from '../../components/CommonComponents';
import globalStyles from "../../assets/styles/Styles.js";
import Toast from 'react-native-toast-message';
import { 
  addTakerToItem,
  deleteTakerFromItem,
  getCurrentUserQueues,
  getUserPositionInQueue,
} from '../../services/firestoreQueues.js';
import { 
    checkIfMyItem, 
    fetchQueueCount,
    getCurrentUserItemQueues,
 } from '../../services/firestoreItems.js';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { set } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatTimestamp } from '../../services/firestoreGlobal.js';

export const ItemJoinOnQueue = ({ itemId }) => {
    const [isOnQueue, setIsOnQueue] = useState(false);
    const [isMyItem, setIsMyItem] = useState(false);
    const [queueCount, setQueueCount] = useState(0);
    const [queuePosition, setQueuePosition] = useState(null);
    const authState = useContext(AuthenticationContext);

    const saveForQueue = async (itemId) => {
        try {
            await addTakerToItem(authState.user.id, itemId);
            setIsOnQueue(true);
            const updatedCount = await fetchQueueCount(itemId);
            const updatedPosition = await getUserPositionInQueue(authState.user.id, itemId);
            setQueueCount(updatedCount);
            setQueuePosition(updatedPosition);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Virhe varausta tehdessä', text2: error.message });
        }
    };

    const deleteFromQueue = async (itemId) => {
        try {
            await deleteTakerFromItem(authState.user.id, itemId);
            setIsOnQueue(false);
            const updatedCount = await fetchQueueCount(itemId);
            setQueueCount(updatedCount);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Virhe jonosta poistettaessa', text2: error.message });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isOwner = await checkIfMyItem(authState.user.id, itemId);
                setIsMyItem(isOwner);

                const onQueue = await getCurrentUserQueues(authState.user.id, itemId);
                setIsOnQueue(onQueue);

                const count = await fetchQueueCount(itemId);
                setQueueCount(count);

                if (onQueue) {
                    const position = await getUserPositionInQueue(authState.user.id, itemId);
                    setQueuePosition(position);
                }
            } catch (error) {
                console.error('Virhe tietojen hakemisessa:', error);
            }
        };

        fetchData();
    }, [itemId]);

    return (
        <>
            {isMyItem ? (
                <Text>Oma ilmoitus: Jonottajia: {queueCount}</Text>
            ) : (
                <View style={globalStyles.iconContainer}>
                    <TouchableOpacity 
                        onPress={() => saveForQueue(itemId)} 
                        disabled={isOnQueue} 
                        style={[globalStyles.iconButton]}>
                        <Icon 
                            name="checkmark-circle" 
                            color={isOnQueue ? '#bdbdbd' : '#195010'} 
                            style={globalStyles.iconsOnUse} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => deleteFromQueue(itemId)} 
                        disabled={!isOnQueue} 
                        style={[globalStyles.iconButton]}>
                        <Icon 
                            name="close-circle" 
                            color={!isOnQueue ? '#bdbdbd' : '#790809'} 
                            style={globalStyles.iconsOnUse} 
                        />
                    </TouchableOpacity>

                    {isOnQueue ? (
                        <Text style={globalStyles.iconText}>Varauksen sija: {queuePosition}</Text>
                    ) : (
                        <Text style={globalStyles.iconText}>Jonottajia: {queueCount}</Text>
                    )}
                </View>
            )}
        </>
    );
    };

    export const ItemQueues = () => {
        const [items, setItems] = useState([]);
        const [lastDoc, setLastDoc] = useState(null);
        const authState = useContext(AuthenticationContext);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const [hasMore, setHasMore] = useState(true);
        const pageSize = 4;

        const fetchData = async () => {
            if (loading || !hasMore) return;

            setLoading(true);
            setError(null);

            try {
                const { items: newItems, lastDoc: newLastDoc } = await getCurrentUserItemQueues(authState.user.id, lastDoc, pageSize);
                setItems((prevItems) => [...prevItems, ...newItems]);
                setLastDoc(newLastDoc);

                if (newItems.length < pageSize) {
                    setHasMore(false);
                }
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Ei enempää kohteita' });
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
        
            fetchData();
        }, []);

        
        if (loading && items.length === 0) {
            return (
            <BasicSection> <Text>Ladataan...</Text> </BasicSection>
            );
        }

        if (error) {
            return (
                <BasicSection> <Text>Virhe: {error.message}</Text> </BasicSection>
            );
        }
        
    return (
        <View style={globalStyles.container}>
            {items.length > 0 ? (
                items.map((item) => (
                    <View key={item.id} style={globalStyles.itemContainer}>
                        <Text style={globalStyles.itemName}>{item.itemname}</Text>
                        <Text>{item.itemdescription}</Text>
                        <Text>Sijainti: {item.city}, {item.postalcode}</Text>
                        <Text>Julkaisija: {item.givername}</Text>
                        <Text>{formatTimestamp(item.createdAt)}</Text>
                        <ItemJoinOnQueue itemId={item.id} />
                    </View>
                ))
            ) : (
                <BasicSection>
                    <Text>Ei varauksia</Text>
                </BasicSection>
            )}

        {hasMore && (
            <Button title="Näytä lisää" onPress={fetchData} disabled={loading} />
        )}

        {!hasMore && (
            <Text style={{ textAlign: 'center', marginTop: 16 }}>Ei enempää kohteita</Text>
        )}

        </View>
    );
}