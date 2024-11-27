import React, { memo, useEffect, useState } from "react";
import { Button, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BasicSection, Heading } from "../../components/CommonComponents";
import {
  ButtonAdd,
  ButtonCancel,
  ButtonConfirm,
  ButtonDelete,
  ButtonNavigate,
} from "../../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../assets/styles/Styles";
import { ItemJoinOnQueue, ItemQueues } from "./ItemQueues";
import Icon from "react-native-vector-icons/Ionicons";
import useItemStore from "../../store/useItemStore";
import { formatTimestamp } from "../../services/firestoreGlobal";
import { useAuth } from "../../context/AuthenticationContext";
import { deleteItemFromFirestore } from "../../services/firestoreItems";
import Toast from "react-native-toast-message";
import { LoadingIndicator } from "../../components/LoadingIndicator";

const ItemList = memo(({ items, fetchItems, hasMore }) => {
  const loading = useItemStore((state) => state.loading);

  return (
    <>
      {items.map((item) => (
        <View key={item.id} style={globalStyles.itemContainer}>
          <Text style={globalStyles.itemName}>{item.itemname}</Text>
          <Text>{item.itemdescription}</Text>
          <Text>
            Sijainti: {item.postalcode}, {item.city}
          </Text>
          <Text>Julkaisija: {item.givername}</Text>
          <Text>{formatTimestamp(item.createdAt)}</Text>
          <ItemJoinOnQueue itemId={item.id} />
        </View>
      ))}
      {loading ? <LoadingIndicator /> : null}
      {hasMore ? (
        <Button
          title="Näytä lisää"
          onPress={() => fetchItems(4)}
          disabled={loading}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 16 }}>
          Ei enempää kohteita
        </Text>
      )}
    </>
  );
});

const ItemsMain = () => {
  // deleteExpiredStuff();
  const navigation = useNavigation();
  const items = useItemStore((state) => state.items);
  const fetchItems = useItemStore((state) => state.fetchItems);
  const error = useItemStore((state) => state.error);
  const hasMore = useItemStore((state) => state.hasMore);

  useEffect(() => {
    if (items.length === 0) {
      fetchItems(4);
    }
  }, []);

  if (error) {
    return (
      <BasicSection>
        <Text>Virhe: {error.message}</Text>
      </BasicSection>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Ilmoitukset" />
      <ButtonAdd
        title="Uusi ilmoitus"
        onPress={() => navigation.navigate("AddItemView")}
      />
      <View style={{ flex: 1, padding: 8 }}>
        {items.length === 0 ? (
          <LoadingIndicator />
        ) : (
          <ItemList items={items} fetchItems={fetchItems} hasMore={hasMore} />
        )}
      </View>
      <Heading title="Omat listaukset" />
      <ButtonNavigate
        title="Ilmoitukset"
        onPress={() => navigation.navigate("MyItems")}
      />
      <ButtonNavigate
        title="Varaukset"
        onPress={() => navigation.navigate("MyQueues")}
      />
    </ScrollView>
  );
};

export default ItemsMain;

export const ItemsFromThisUser = () => {
  const navigation = useNavigation();

  const [activeToggleId, setActiveToggleId] = useState(null);
  const authState = useAuth();
  const pageSize = 4;
  const userItems = useItemStore((state) => state.userItems);
  const fetchUserItems = useItemStore((state) => state.fetchUserItems);
  const deleteUserItem = useItemStore((state) => state.deleteUserItem);
  const loading = useItemStore((state) => state.loading);
  const error = useItemStore((state) => state.error);

  useEffect(() => {
    if (userItems.length === 0) fetchUserItems(authState.user.id, pageSize);
  }, [authState.user.id]);

  const handleDelete = async (itemId) => {
    try {
      await deleteItemFromFirestore(authState.user.id, itemId);
      console.log(`Item ${itemId} poistettu.`);
    } catch (error) {
      console.error("Virhe poistettaessa itemiä:", error);
    }
  };

  const toggleItem = (itemId) => {
    setActiveToggleId((prevId) => (prevId === itemId ? null : itemId));
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

      {error ? (
        <Toast
          type="error"
          text1="Virhe omien julkaisujen hakemisessa"
          text2={error.message}
        />
      ) : (
        <View style={globalStyles.container}>
          {loading ? (
            <BasicSection>
              <Text>Ladataan...</Text>
            </BasicSection>
          ) : userItems.length > 0 ? (
            userItems.map((item) => (
              <View key={item.id} style={globalStyles.itemContainer}>
                <Text style={globalStyles.itemName}>{item.itemname}</Text>
                <Text>{item.itemdescription}</Text>
                <Text>{item.city}</Text>
                <Text>{item.postalcode}</Text>
                {activeToggleId !== item.id && (
                  <View style={globalStyles.viewButtons}>
                    <ButtonDelete
                      title="Poista"
                      onPress={() => toggleItem(item.id)}
                    />
                  </View>
                )}
                {activeToggleId === item.id && (
                  <View style={globalStyles.viewButtons}>
                    <ButtonConfirm
                      title="Vahvista"
                      onPress={() => handleDelete(item.id)}
                    />
                    <ButtonCancel
                      title="Peruuta"
                      onPress={() => toggleItem(null)}
                    />
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text>Julkaisuja ei löytynyt.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export const QueuesOfThisUser = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Omat varaukset" />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={globalStyles.iconContainer}
      >
        <View style={globalStyles.iconTextContainer}>
          <Icon name="arrow-back" size={30} color="#000" />
          <Text style={globalStyles.iconText}>Takaisin</Text>
        </View>
      </TouchableOpacity>

      <ItemQueues />
    </ScrollView>
  );
};
