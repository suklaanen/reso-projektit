import React from 'react';
import { View, Text } from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { ButtonAdd } from '../../components/Buttons';

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

export const JoinOnQueue = () => {
  return (
    <>
      <BasicSection>
        Tähän tulee puiston tapaaminen ja osallistujat listattuna. {'\n\n'}
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

export const NoMeetingsAtSpecificParkWhenLoggedOut = () => {
  return (
    <>
      <Heading title="Tämän puiston tapahtumat" />
      <BasicSection>
        Kirjaudu sisään löytääksesi puistokohtaiset tapahtumat. {'\n\n'}
      </BasicSection>
    </>
  );
};

export const MeetingsWhereThisUserHasJoined = () => {
  return (
    <>
      <Heading title="Ilmoittautumiset" />
      <BasicSection>
        Löydät aktiiviset ilmoittautumisesi puistotreffeille täältä.{"\n"}
        Menneet puistotreffit poistuvat automaattisesti listasta. {"\n\n"}
        <Text style={{ fontStyle: 'italic' }}>Jos haluat peruuttaa ilmoittautumisen, siirry tapaamisen näkymään ja peruuta ilmoittautumisesi sieltä.</Text>
      </BasicSection>

      <BasicSection>
        Tapaaminen ja osallistuva koira {"\n\n"}
      </BasicSection>
    </>
  );
};
