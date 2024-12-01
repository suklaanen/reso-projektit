import { useNavigation } from "@react-navigation/native";
import React from "react";
import useUserData from "../../hooks/useUserData";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BasicSection, Heading } from "../../components/CommonComponents";
import globalStyles from "../../assets/styles/Styles";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { ItemCard } from "./ItemCard";

export const UserItemsView = () => {
  const navigation = useNavigation();
  const { items, userItemsLoading, userItemsError, removeItem } = useUserData();

  const handleDelete = async (itemId) => {
    try {
      await removeItem(itemId);
      console.log(`Item ${itemId} poistettu.`);
    } catch (error) {
      console.error("Virhe poistettaessa itemiä:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Omat ilmoitukset" />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={globalStyles.iconContainer}
      >
        <View style={globalStyles.iconTextContainer}>
          <Icon name="arrow-back" size={30} color="#000" />
          <Text style={globalStyles.iconText}>Takaisin</Text>
        </View>
      </TouchableOpacity>

      {userItemsError ? (
        <Toast
          type="error"
          text1="Virhe omien julkaisujen hakemisessa"
          text2={userItemsError.message}
        />
      ) : (
        <View style={globalStyles.container}>
          {userItemsLoading ? (
            <BasicSection>
              <Text>Ladataan...</Text>
            </BasicSection>
          ) : items.length > 0 ? (
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                showActions={true}
                onRemove={handleDelete}
              />
            ))
          ) : (
            <Text>Julkaisuja ei löytynyt.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};
