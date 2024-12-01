import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthenticationContext";
import Toast from "react-native-toast-message";
import { ScrollView, TextInput, View } from "react-native";
import globalStyles from "../../assets/styles/Styles";
import { Heading } from "../../components/CommonComponents";
import { ButtonAdd } from "../../components/Buttons";
import useItemStore from "../../store/useItemStore";

const ItemForm = ({ itemData, handleChange, onPress }) => {
  return (
    <>
      <TextInput
        style={globalStyles.textInput}
        placeholder="Otsikko (tuotteen nimi)"
        value={itemData.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={globalStyles.textInput}
        placeholder="Kuvaus tuotteesta"
        value={itemData.description}
        onChangeText={(value) => handleChange("description", value)}
        multiline
      />
      <TextInput
        style={globalStyles.textInput}
        placeholder="Postinumero"
        keyboardType="numeric"
        value={itemData.postcode}
        onChangeText={(value) => handleChange("postcode", value)}
      />
      <TextInput
        style={globalStyles.textInput}
        placeholder="Kaupunki"
        value={itemData.city}
        onChangeText={(value) => handleChange("city", value)}
      />

      <ButtonAdd title="Julkaise" onPress={onPress} color="#4CAF50" />
    </>
  );
};

export const AddItemView = () => {
  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    postcode: "",
    city: "",
  });
  const navigation = useNavigation();
  const { user } = useAuth();
  const addItem = useItemStore((state) => state.addItem);

  const handleAddItem = async () => {
    try {
      await addItem(
        user.id,
        itemData.name,
        itemData.description,
        itemData.postcode,
        itemData.city
      );
      Toast.show({ type: "success", text1: "Julkaisu lisätty!" });

      navigation.navigate("ItemsMain");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Virhe julkaisua lisättäessä",
        text2: error.message,
      });
    }
  };

  const handleChange = (name, value) => {
    setItemData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <View style={globalStyles.container}>
        <Heading title="Lisää uusi ilmoitus" />
        <ItemForm
          itemData={itemData}
          handleChange={handleChange}
          onPress={handleAddItem}
        />
      </View>
    </ScrollView>
  );
};
