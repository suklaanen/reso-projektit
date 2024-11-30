import React, { useState, useContext } from 'react';
import { addItemToFirestore } from '../../services/firestoreItems.js';
import { Heading } from '../../components/CommonComponents';
import { ButtonAdd } from '../../components/Buttons';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from "../../assets/styles/Styles.js";
import Toast from 'react-native-toast-message';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import regionsAndCities from '../../components/Sorted-maakunnat.json';

export const AddItem = () => {
    const [itemname, setItemname] = useState('');
    const [itemdescription, setItemdescription] = useState('');
    const [city, setCity] = useState('');
    const [filteredCities, setFilteredCities] = useState([]); 
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigation = useNavigation();
    const authState = useContext(AuthenticationContext);
    const allCities = Object.values(regionsAndCities).flat();

    const handleAddItem = async () => {
        if (!city) {
            Toast.show({ type: 'error', text1: 'Valitse paikkakunta ennen julkaisua' });
            return;
        }

        try {
            const response = await addItemToFirestore(authState.user.id, itemname, itemdescription, city);
            console.log('Add item response:', response);
            Toast.show({ type: 'success', text1: 'Julkaisu lisätty!' });
            navigation.navigate('ItemsMain');
        } catch (error) {
            console.error('Add item error:', error);
            Toast.show({ type: 'error', text1: 'Virhe julkaisua lisättäessä', text2: error.message });
        }
    };

    const handleCityInputChange = (input) => {
        setCity(input);

        if (input.trim() === '') {
            setFilteredCities([]);
            setShowSuggestions(false);
        } else {
            const filtered = allCities.filter((c) =>
                c.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredCities(filtered);
            setShowSuggestions(true);
        }
    };

    const handleCitySelection = (selectedCity) => {
        setCity(selectedCity);
        setFilteredCities([]);
        setShowSuggestions(false); 
        Keyboard.dismiss();
    };

    return (
        <View style={globalStyles.container}>
            <Heading title="Lisää uusi ilmoitus" />
            <TextInput
                style={globalStyles.textItemTitle}
                placeholder="Otsikko (tuotteen nimi)"
                value={itemname}
                onChangeText={setItemname}
            />
            <TextInput
                style={globalStyles.textDescription}
                placeholder="Kuvaus tuotteesta"
                value={itemdescription}
                onChangeText={setItemdescription}
                multiline
            />

            <TextInput
                style={globalStyles.textItemTitle}
                placeholder="Paikkakunta (tuotteen sijainti)"
                value={city}
                onChangeText={handleCityInputChange}
            />

            {showSuggestions && (
                <ScrollView style={globalStyles.suggestionsList}>
                    {filteredCities.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleCitySelection(item)}>
                            <Text style={globalStyles.autocompleteItem}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <ButtonAdd title="Julkaise" onPress={handleAddItem} color="#4CAF50" />
        </View>
    );
};
