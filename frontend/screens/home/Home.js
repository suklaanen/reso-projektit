import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthenticationContext";
import { ScrollView, View } from "react-native";
import { Heading } from "../../components/CommonComponents";
import { ButtonAdd } from "../../components/Buttons";
import {
  AllItems,
  NavigateToThisUsersItems,
  NavigateToThisUsersQueue,
} from "../items/FindItems";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const auth = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    console.log("Current user in Home.js: ", user);
    console.log("Auth state in Home.js: ", auth);
  }, [auth, auth.currentUser]);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <View>
        <ScrollView contentContainerStyle={{ padding: 8 }}>
          <Heading title="Ilmoitukset" />
          <ButtonAdd
            title="Uusi ilmoitus"
            onPress={() => navigation.navigate("ItemAddView")}
          ></ButtonAdd>
          <AllItems />
          <Heading title="Omat listaukset" />
          <NavigateToThisUsersItems />
          <NavigateToThisUsersQueue />
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Home;
