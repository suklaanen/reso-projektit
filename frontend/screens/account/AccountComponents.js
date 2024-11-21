import React, { useContext } from "react";
import { ScrollView, Text } from "react-native";
import { Heading } from "../../components/CommonComponents";
import {
  DeleteAccountOfThisUser,
  LogoutFromThisUser,
  MessagingSystem,
  AccountSystem,
} from "./FindUser";
import {
  NavigateToThisUsersItems,
  NavigateToThisUsersQueue,
} from "../items/FindItems";
import { AuthenticationContext } from "../../context/AuthenticationContext";

export const AccountLoggedIn = () => {
  const authState = useContext(AuthenticationContext);

  if (!authState) {
    return <Text>No user data found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Käyttäjän omat" />
      <MessagingSystem />
      <NavigateToThisUsersItems />
      <NavigateToThisUsersQueue />
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
