import React, { useEffect } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { BasicSection, Heading } from "../../components/CommonComponents";
import { ButtonAdd, ButtonNavigate } from "../../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import useItemStore from "../../store/useItemStore";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { deleteExpiredStuff } from "../../services/firestoreQueues";
import { deleteExpiredItems } from "../../services/firestoreItems";
import { ItemCard } from "./ItemCard";

const ItemsMain = () => {
  const navigation = useNavigation();
  const items = useItemStore((state) => state.items);
  const fetchItems = useItemStore((state) => state.fetchItems);
  const error = useItemStore((state) => state.error);
  const hasMore = useItemStore((state) => state.hasMore);

  useEffect(() => {
    if (items.length === 0) {
      fetchItems(4);
    }
    deleteExpiredItems();
    deleteExpiredStuff();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Ilmoitukset" />
      <ButtonAdd
        title="Uusi ilmoitus"
        onPress={() => navigation.navigate("AddItemView")}
      />
      <View style={{ flex: 1, padding: 8 }}>
        {error ? (
          <ErrorSection error={error} />
        ) : !items.length ? (
          <LoadingIndicator />
        ) : (
          <ItemList items={items} fetchItems={fetchItems} hasMore={hasMore} />
        )}
      </View>
      <Heading title="Omat listaukset" />
      <NavigationButtons navigation={navigation} />
    </ScrollView>
  );
};

const ErrorSection = ({ error }) => (
  <BasicSection>
    <Text>Virhe: {error.message}</Text>
  </BasicSection>
);

const ItemList = ({ items, fetchItems, hasMore }) => {
  const loading = useItemStore((state) => state.loading);

  return (
    <>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
      {loading && <LoadingIndicator />}
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
};

const NavigationButtons = ({ navigation }) => (
  <>
    <ButtonNavigate
      title="Ilmoitukset"
      onPress={() => navigation.navigate("MyItems")}
    />
    <ButtonNavigate
      title="Varaukset"
      onPress={() => navigation.navigate("MyQueues")}
    />
  </>
);

export default ItemsMain;
