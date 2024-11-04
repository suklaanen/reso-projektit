import React from 'react';
import { Text } from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';

export const AllItems = () => {
  return (
    <>
      <Heading title="Ilmoitukset" />
      <BasicSection>
          <Text style={{ fontWeight: 'bold' }}>Dindin</Text>{"\n\n"}
          Tähän tulee listaus ilmoituksista{"\n\n"}
        </BasicSection>
    </>
  );
};

export const ItemAdd = () => {
  return (
    <>
      <BasicSection>
        Tuotteen lisäys palveluun. Tuotetiedot etc. {"\n"}
      </BasicSection>
    </>
  );
};

export const ItemModify = () => {
  return (
    <>
      <BasicSection>
        Tuotteen tietojen muokkaus. {"\n"}
      </BasicSection>
    </>
  );
};

export const ItemDelete = () => {
  return (
    <>
      <BasicSection>
        Tuotteen poistaminen (ja merkitseminen luovutetuksi) {"\n"}
      </BasicSection>
    </>
  );
};

export const ItemQueue = () => {
  return (
    <>
      <BasicSection>
         {'\n\n'}
      </BasicSection>
    </>
  );
};

export const NoItemsWhenLoggedOut = () => {
  return (
    <>
      <BasicSection>
        Kirjaudu sisään palvelun käyttäjänä päästäksesi tekemään löytöjä ja julkaisemaan omia ilmoituksia! {"\n"}
      </BasicSection>
    </>
  );
};

