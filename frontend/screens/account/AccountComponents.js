import React, { useContext, useState } from 'react';
import { ScrollView,Text} from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { ChangePasswordOfThisUser, DeleteAccountOfThisUser, LogoutFromThisUser, UserLogin, UserRegister, UserResetPassword, MessagingSystem, AccountSystem } from './FindUser';
import { NavigateToThisUsersItems, NavigateToThisUsersQueue } from '../items/FindItems';
import { BasicsOfSecuringThisAccount, BasicsOfGettingAnAccount } from '../../components/Textblocks';
import { AuthenticationContext } from '../../services/auth';


export const AccountLoggedOut = () => { 
  const [visibleSection, setVisibleSection] = useState(null);

  const toggleSection = (sectionName) => {
    setVisibleSection((prevSection) => prevSection === sectionName ? null : sectionName);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      <BasicsOfGettingAnAccount />
      <UserLogin 
        isVisible={visibleSection === 'login'} 
        toggleVisible={() => toggleSection('login')} 
      />
      <UserRegister 
        isVisible={visibleSection === 'register'} 
        toggleVisible={() => toggleSection('register')} 
      />
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
          Tervetuloa, {authState.username} {"\n\n"}
          Tämän näkymän kautta löytyy toiminnot, jotka liittyvät käyttäjätilin hallinnointiin, käyttäjän omiin ilmoituksiin ja varauksiin sekä tuotteisiin liittyvät aktiiviset viestiketjut.
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
      <DeleteAccountOfThisUser />
    </ScrollView>
  );
};
