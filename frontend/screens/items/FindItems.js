import React from 'react';
import { ButtonContinue } from '../../components/Buttons';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heading, BasicSection } from '../../components/CommonComponents';

export const NoItemsWhenLoggedOut = () => {
  return (
    <>
      <BasicSection>
        Kirjaudu sisään palvelun käyttäjänä päästäksesi tekemään löytöjä ja julkaisemaan omia ilmoituksia! {"\n"}
      </BasicSection>
    </>
  );
};

export const NavigateToThisUsersItems = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonContinue
        title="Ilmoitukset"
        onPress={() => navigation.navigate('MyItems')}
        /* navin uudelleen ohjaus oikeille sijoilleen, kun löytyy */
      />
    </>
  );
};

export const NavigateToThisUsersQueue = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonContinue
        title="Varaukset"
        onPress={() => navigation.navigate('MyQueues')}
        /* navin uudelleen ohjaus oikeille sijoilleen, kun löytyy */
      />
    </>
  );
};

export const AllItems = () => {
  return (
    <>
      <Heading title="Ilmoitukset" />
      <BasicSection>
        <Text style={{ fontWeight: 'bold' }}>Dindin</Text>{"\n\n"}
        Tähän tulee haku ja sivutus kaikista ilmoituksista{"\n\n"}
      </BasicSection>
    </>
  );
};

export const ItemAddNew = () => {
  return (
    <>
      <Heading title="Lisää uusi ilmoitus" />
      <BasicSection>
        X{"\n\n"}
      </BasicSection>
    </>
  );
};

export const ItemModify = () => {
  return (
    <>
      <Heading title="Muokkaa" />
      <BasicSection>
        X{"\n\n"}
      </BasicSection>
    </>
  );
};

export const ItemDelete = () => {
  return (
    <>
      <Heading title="Delete" />
      <BasicSection>
        X{"\n\n"}
      </BasicSection>
    </>
  );
};

export const ItemJoinOnQueue = () => {
  return (
    <>
      <Heading title="Join" />
      <BasicSection>
        X{"\n\n"}
      </BasicSection>
    </>
  );
};
