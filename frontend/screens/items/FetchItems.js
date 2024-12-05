import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, Keyboard, Image } from 'react-native';
import { paginateItems } from '../../services/firestoreItems.js';
import { ItemJoinOnQueue } from './ItemQueues.js';
import globalStyles from '../../assets/styles/Styles.js';
import { formatTimestamp } from '../../services/firestoreGlobal.js';
import { useLoading } from '../../context/LoadingContext.js';
import regionsAndCities from '../../components/Sorted-maakunnat.json';
import { ButtonPage } from '../../components/Buttons.js';
import { where } from 'firebase/firestore';
import placeholderImage from '../../assets/images/kiertis-icon.png';

export const AllItems = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pages, setPages] = useState([]);
    const { isLoading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [isLastPage, setIsLastPage] = useState(false);

    const pageSize = 5;

    const [city, setCity] = useState('');
    const [filteredCities, setFilteredCities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const allCities = Object.values(regionsAndCities).flat();
    const placeholderImageUrl = Image.resolveAssetSource(placeholderImage).uri;

    const loadItems = async (pageIndex, selectedCity = '') => {
        setError(null);
        try {
            setLoading(true);

            const lastDoc = pages[pageIndex - 1] || null;
            const { items: newItems, lastDoc: newLastDoc } = await paginateItems(lastDoc, pageSize, () => 
                selectedCity ? where('city', '==', selectedCity) : undefined
            );

            if (!pages[pageIndex]) {
                setPages((prevPages) => {
                    const updatedPages = [...prevPages];
                    updatedPages[pageIndex] = newLastDoc;
                    return updatedPages;
                });
            }

            setItems(newItems);
            setIsLastPage(newItems.length < pageSize);


            setLoading(false);
        } catch (err) {
            console.error('Virhe ladattaessa kohteita:', err);
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems(0); 
    }, []);

    const handleCityInputChange = async (input) => {
        setCity(input);
    
        if (input.trim() === '') {
            setFilteredCities([]);
            setShowSuggestions(false);
            await loadItems(0);
        } else {
            const filtered = allCities.filter((c) =>
                c.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredCities(filtered);
            setShowSuggestions(true);
        }
    };

    const handleCitySelection = async (selectedCity) => {
        setCity(selectedCity);
        setFilteredCities([]);
        setShowSuggestions(false);
        Keyboard.dismiss();
        setCurrentPage(0); 
        await loadItems(0, selectedCity);

        if (!selectedCity.trim()) {
            await loadItems(0);
        } else {
            await loadItems(0, selectedCity);
        }

    };

    const handleNextPage = async () => {
        if (isLastPage) return;
        setCurrentPage((prev) => prev + 1);
        await loadItems(currentPage + 1, city);
    };

    const handlePreviousPage = async () => {
        if (currentPage === 0) return;
        setCurrentPage((prev) => prev - 1);
        await loadItems(currentPage - 1, city);
    };

    if (error) {
        return (
            <View>
                <Text>Virhe: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 8 }}>
            <TextInput
                style={globalStyles.textItemTitle}
                placeholder="Hae paikkakunnan mukaan"
                value={city}
                onChangeText={handleCityInputChange}
            />
            {showSuggestions && (
                <ScrollView style={globalStyles.suggestionsList}>
                    {filteredCities.map((cityName, index) => (
                        <TouchableOpacity key={index} onPress={() => handleCitySelection(cityName)}>
                            <Text style={globalStyles.autocompleteItem}>{cityName}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {isLoading ? (
                <Text>Ladataan...</Text>
            ) : (
                <>
                    {items.map((item) => (
                        <View key={item.id} style={globalStyles.itemContainer}>
                            <Text style={globalStyles.itemName}>{item.itemname}</Text>
                            <Image source={{ uri: item.imageUrl }} style={globalStyles.itemImage} />
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
                            Sivu {currentPage + 1}
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
