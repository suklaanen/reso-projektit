import React, { useContext } from 'react';
import { ScrollView,Text} from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { ChangePasswordOfThisUser, DeleteAccountOfThisUser, LogoutFromThisUser, UserLogin, UserRegister, UserResetPassword, MessagingSystem, AccountSystem } from './FindUser';
import { NavigateToThisUsersItems, NavigateToThisUsersQueue } from '../items/FindItems';
import { BasicsOfSecuringThisAccount, BasicsOfGettingAnAccount } from '../../components/Textblocks';
import { AuthenticationContext } from '../../services/auth';


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
      <MessagingSystem />
      <NavigateToThisUsersItems />
      <NavigateToThisUsersQueue />
      <AccountSystem />
      <LogoutFromThisUser />
    </ScrollView>
  );
};

export const AccountMaintain = () => {
  const {authState} = useContext(AuthenticationContext);

  if (!authState) {
    return <Text>No user data found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicsOfSecuringThisAccount />
      <ChangePasswordOfThisUser />
      <DeleteAccountOfThisUser />
    </ScrollView>
  );
};
