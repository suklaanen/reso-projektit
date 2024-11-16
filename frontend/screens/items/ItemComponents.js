import React from 'react';
import { ScrollView } from 'react-native';
import { NoItemsWhenLoggedOut, AllItems, NavigateToThisUsersItems, NavigateToThisUsersQueue, ItemAddNew, ItemModify, ItemDelete, ItemJoinOnQueue, MyItems } from './FindItems';
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
        <ButtonAdd title="Uusi ilmoitus" onPress={() => navigation.navigate('ItemAddView')}></ButtonAdd>
        <AllItems />
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

      <MyItems />
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