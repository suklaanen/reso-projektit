import React from "react";
import { ScrollView } from "react-native";
import {
  AllItems,
  NavigateToThisUsersItems,
  NavigateToThisUsersQueue,
  ItemAddNew,
  ItemModify,
  ItemDelete,
  ItemJoinOnQueue,
  MyItems,
} from "./FindItems";
import { Heading, BasicSection } from "../../components/CommonComponents";

export const ItemAddView = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <ItemAddNew />
    </ScrollView>
  );
};

export const ItemsFromThisUser = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Omat ilmoitukset" />
      <MyItems />
    </ScrollView>
  );
};

export const QueuesOfThisUser = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicSection>
        Käyttäjän omat varaukset/listautumiset tänne ja jonotussijat sekä
        varauksen peruutus
      </BasicSection>
    </ScrollView>
  );
};
