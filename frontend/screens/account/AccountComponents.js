import React, { useContext } from "react";
import { ScrollView, Text } from "react-native";
import { Heading, BasicSection } from "../../components/CommonComponents";
import { ButtonNavigate } from "../../components/Buttons";
import {
  DeleteAccountOfThisUser,
  LogoutFromThisUser,
  MessagingSystem,
  AccountSystem,
} from "./FindUser";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { useNavigation } from "@react-navigation/native";


export const AccountLoggedIn = () => {
  const authState = useContext(AuthenticationContext);
  const navigation = useNavigation();

  if (!authState) {
    return <Text>Ei käyttäjätietoja saatavilla.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Käyttäjän omat" />
        <MessagingSystem />
        <ButtonNavigate title="Ilmoitukset" onPress={() => navigation.navigate("MyItems")} />
        <ButtonNavigate title="Varaukset" onPress={() => navigation.navigate("MyQueues")} />
      <Heading title="Tilin hallinta" />
        <AccountSystem />
        <LogoutFromThisUser />
    </ScrollView>
  );
};

export const AccountMaintain = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <DeleteAccountOfThisUser />
    </ScrollView>
  );
};
