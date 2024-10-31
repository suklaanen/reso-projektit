import React, { useContext } from 'react';
import { ScrollView,Text} from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { ChangePasswordOfThisUser, DeleteAccountOfThisUser, LogoutFromThisUser, UserLogin, UserRegister, UserResetPassword } from './FindUser';
import { BasicsOfSecuringThisAccount, BasicsOfGettingAnAccount } from '../../components/Textblocks';
import { AuthenticationContext } from '../../services/auth';

export const AccountLoggedIn = () => {
  const {authState} = useContext(AuthenticationContext);

  if (!authState) {
    return <Text>No user data found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <Heading title="Käyttäjäsivu" />
      <BasicSection>
        <Text>
          Olet kirjautunut käyttäjänä: {authState.username} {"\n\n"}
          Tämän näkymän kautta löydät omat aktiiviset ilmoituksesi, jonotuksesi ja viestiyhteydet sekä tilisi hallinnointiin liittyvät toiminnot.
        </Text>
      </BasicSection>
      {/* <MessagingSystem /> */}
      {/* <ItemsFromThisUser /> */}
      {/* <QueuesOfThisUser /> */}
      <BasicsOfSecuringThisAccount />
      <ChangePasswordOfThisUser />
      <DeleteAccountOfThisUser />
      <LogoutFromThisUser />
    </ScrollView>
  );
};

export const AccountLoggedOut = () => { 

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicsOfGettingAnAccount />
      <UserLogin />
      <UserRegister />
      <UserResetPassword />
    </ScrollView>
  );
};
