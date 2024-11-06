import React, { useRef, useContext } from 'react';
import { ScrollView } from 'react-native';
import { NoItemsWhenLoggedOut, AllItems, NavigateToThisUsersItems, NavigateToThisUsersQueue, ItemAddNew, ItemModify, ItemDelete, ItemJoinOnQueue } from './FindItems';
import { BasicSection } from '../../components/CommonComponents';

export const ItemsLoggedOut = () => {
  const scrollViewRef = useRef(null);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
        <NoItemsWhenLoggedOut />
    </ScrollView>
  );
};

export const ItemsLoggedIn = () => {
  const scrollViewRef = useRef(null);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
        <AllItems />
        <ItemAddNew />
        <NavigateToThisUsersItems />
        <NavigateToThisUsersQueue />
    </ScrollView>
  );
};

export const ItemsFromThisUser = () => {
  const scrollViewRef = useRef(null);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicSection>
        Käyttäjän omat julkaisut tänne ja niiden muokkaus / poisto / merkintä noudetuksi
      </BasicSection>
    </ScrollView>
  );
}

export const QueuesOfThisUser = () => {
  const scrollViewRef = useRef(null);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicSection>
        Käyttäjän omat varaukset/listautumiset tänne ja jonotussijat sekä varauksen peruutus
      </BasicSection>
    </ScrollView>
  );
}