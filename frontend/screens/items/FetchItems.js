import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { getTotalItems, paginateItems } from '../../services/firestoreItems.js';
import { ItemJoinOnQueue } from './ItemQueues.js';
import globalStyles from '../../assets/styles/Styles.js';
import { formatTimestamp } from '../../services/firestoreGlobal.js';
import { useLoading } from '../../context/LoadingContext.js';
import { get, last, update } from 'lodash';
import { ButtonPage } from '../../components/Buttons.js';

export const AllItems = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [pages, setPages] = useState([]); 
    const { isLoading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState([]);
    const [isLastPage, setIsLastPage] = useState(false); 

    const pageSize = 5; 

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            await loadItems(0); 
            setLoading(false);
        };
        initialize();
    }, []);

    const loadItems = async (pageIndex) => {
        setError(null);
        try {
            const lastDoc = pages[pageIndex - 1] || null;
            const { items: newItems, lastDoc: newLastDoc } = await paginateItems(lastDoc, pageSize);

            if (!pages[pageIndex]) {
                setPages((prevPages) => {
                    const updatedPages = [...prevPages];
                    updatedPages[pageIndex] = newLastDoc;
                    return updatedPages;
                });
            }

            setItems(newItems);
            setIsLastPage(newItems.length < pageSize);

            const totalItemCount = await getTotalItems();
            console.log(totalItemCount);

            const totalPagesCalculated = Math.ceil(totalItemCount / pageSize);
            setTotalPages(totalPagesCalculated);


        } catch (err) {
            console.error('Virhe ladattaessa kohteita:', err);
            setError(err);
        }
    };

    const handleNextPage = async () => {
        if (isLastPage) return; 
        setLoading(true);
        const nextPage = currentPage + 1;
        await loadItems(nextPage);
        setCurrentPage(nextPage); 
        setLoading(false);
    };

    const handlePreviousPage = async () => {
        const previousPage = currentPage - 1;
        if (previousPage < 0) return;
        setLoading(true);
        await loadItems(previousPage); 
        setCurrentPage(previousPage);
        setIsLastPage(false);
        setLoading(false);
    };

    if (error) {
        return (
            <BasicSection> <Text>Virhe: {error.message}</Text> </BasicSection>
        );
    }

    return (
        <View style={{ flex: 1, padding: 8 }}>
            {isLoading ? (
                <Text>Ladataan...</Text>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                    <ButtonPage
                        title="Edellinen"
                        onPress={handlePreviousPage}
                        disabled={currentPage === 0 || isLoading}
                    />
                    <Text style={{ alignSelf: 'center' }}>
                        Sivu {currentPage + 1} / {totalPages}
                    </Text>
                    <ButtonPage
                        title="Seuraava"
                        onPress={handleNextPage}
                        disabled={isLoading || isLastPage}
                    />
                    </View>
                </>
            )}
        </View>
    );
};
