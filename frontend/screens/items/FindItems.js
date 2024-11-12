import React from 'react';
import { ButtonNavigate } from '../../components/Buttons';
import { Text } from 'react-native';
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
      <ButtonNavigate
        title="Ilmoitukset"
        onPress={() => navigation.navigate('MyItems')}
      />
    </>
  );
};

export const NavigateToThisUsersQueue = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonNavigate
        title="Varaukset"
        onPress={() => navigation.navigate('MyQueues')}
      />
    </>
  );
};

export const AllItems = () => {
  return (
    <>
      <BasicSection>
        <Text style={{ fontWeight: 'bold' }}>Kaikki ilmoitukset</Text>{"\n"}
        Tähän tulee haku ja sivutus kaikista ilmoituksista
      </BasicSection>
    </>
  );
};

export const ItemAddNew = () => {
  return (
    <>
      <Heading title="Lisää uusi ilmoitus" />
      <BasicSection>
        Tähän täytettävä ilmoituskaavake ja "julkaise" sekä "peruuta" {"\n\n"}
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
