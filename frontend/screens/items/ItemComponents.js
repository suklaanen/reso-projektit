import React, { useRef, useContext } from 'react';
import { ScrollView, Text } from 'react-native';
import { NoItemsWhenLoggedOut, AllItems, NavigateToThisUsersItems, NavigateToThisUsersQueue, ItemAddNew, ItemModify, ItemDelete, ItemJoinOnQueue } from './FindItems';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { ButtonAdd } from '../../components/Buttons';
import { useNavigation } from '@react-navigation/native';

export const ItemsLoggedOut = () => {
  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
        <NoItemsWhenLoggedOut />
    </ScrollView>
  );
};

export const ItemsLoggedIn = () => {
  const navigation = useNavigation(); 

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
        <Heading title="Ilmoitukset" />
        <AllItems />
        <ButtonAdd title="Uusi ilmoitus" onPress={() => navigation.navigate('ItemAddView')}></ButtonAdd>
        <Heading title="Omat listaukset" />
        <NavigateToThisUsersItems />
        <NavigateToThisUsersQueue />
    </ScrollView>
  );
};

export const ItemAddView = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <ItemAddNew />
    </ScrollView>
  );
}

export const ItemsFromThisUser = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicSection>
        Käyttäjän omat julkaisut tänne ja niiden muokkaus / poisto / merkintä noudetuksi
      </BasicSection>
    </ScrollView>
  );
}

export const QueuesOfThisUser = () => {

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicSection>
        Käyttäjän omat varaukset/listautumiset tänne ja jonotussijat sekä varauksen peruutus
      </BasicSection>
    </ScrollView>
  );
}