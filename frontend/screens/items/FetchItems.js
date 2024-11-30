import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { BasicSection, Heading } from '../../components/CommonComponents';
import { paginateItems } from '../../services/firestoreItems.js';
import { ItemJoinOnQueue } from './ItemQueues.js';
import globalStyles from '../../assets/styles/Styles.js';
import { formatTimestamp } from '../../services/firestoreGlobal.js';
import { useLoading } from '../../context/LoadingContext.js';
import { set } from 'lodash';

export const AllItems = () => {
    const [items, setItems] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const { isLoading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const pageSize = 4;

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            await loadItems();
            setLoading(false);
        };
        initialize();
    }, []);

    const loadItems = async () => {
        setError(null);
        try {
            const { items: newItems, lastDoc: newLastDoc } = await paginateItems(lastDoc, pageSize);
            setItems((prevItems) => [...prevItems, ...newItems]);
            setLastDoc(newLastDoc);

            if (newItems.length < pageSize) {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Virhe ladattaessa kohteita:', err);
            setError(err);
        }
    };

    if (error) {
        return (
            <BasicSection> <Text>Virhe: {error.message}</Text> </BasicSection>
        );
    }

    return (
        <View style={{ flex: 1, padding: 8 }}>

            {isLoading ? (
                <BasicSection> <Text>Ladataan...</Text> </BasicSection>
            ) : (
                <>
                    {items.map((item) => (
                        <View key={item.id} style={globalStyles.itemContainer}>
                            <Text style={globalStyles.itemName}>{item.itemname}</Text>
                            <Text>{item.itemdescription}</Text>
                            <Text>Paikkakunta: {item.city}</Text>
                            <Text>Julkaisija: {item.givername}</Text>
                            <Text>{formatTimestamp(item.createdAt)}</Text>
                            <ItemJoinOnQueue itemId={item.id} />
                        </View>
                    ))}

                    {hasMore && (
                        <Button title="Näytä lisää" onPress={async () => {
                            await loadItems();
                        }} disabled={isLoading} />
                    )}

                    {!hasMore && (
                        <Text style={{ textAlign: 'center', marginTop: 16 }}>Ei enempää kohteita</Text>
                    )}
                </>
            )}
        </View>
    );
};
