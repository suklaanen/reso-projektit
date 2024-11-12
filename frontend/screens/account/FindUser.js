import React, { useState, useEffect, useContext } from 'react';
import { Text, Alert, ToastAndroid, Image, TouchableOpacity, View } from 'react-native';
import { Heading, AccountSection, CommonText, CommonTitle, BasicSection } from '../../components/CommonComponents';
import { ButtonSave, ButtonCancel, ButtonDelete, ButtonConfirm, ButtonAdd, ButtonContinue, ButtonNavigate } from '../../components/Buttons';
import { Icon } from 'react-native-elements';
import { userDelete, userLogin, userLogout, userRegister } from '../../services/api.js';
import { useNavigation } from '@react-navigation/native';
import { AuthenticationContext } from '../../services/auth.js';
import { clearUserData, saveUserData } from '../../services/asyncStorageHelper';
import globalStyles from '../../assets/styles/Styles.js';

export const UserLogin = ({ isVisible, toggleVisible }) => {
  const [usermail, setLoginUsername] = useState('');
  const [password, setLoginPassword] = useState('');
  const { authState, setAuthState } = useContext(AuthenticationContext);
  const navigation = useNavigation();

  const handleLoginSuccess = async (data) => {
    console.log('Kirjautuminen onnistui käyttäjätiedoilla:', data);
    saveUserData(data);
    setAuthState(data);
  };

  const handleLogin = async () => {
    try {
      const data = await userLogin( usermail, password);
      console.log('Login result:', data); 
      if (data) {
        handleLoginSuccess({
          userId: data.userId,
          accessToken: data.accessToken,
        });
        navigation.navigate('AccountLoggedIn');
      } else {
        Alert.alert('Kirjautuminen epäonnistui', 'Tuntematon virhe');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Virhe kirjautumisessa', error.message || 'Yhteysvirhe');
    }
  };

  return (
    <View>
      <Heading title="Kirjaudu sisään" onPress={toggleVisible} style={{ backgroundColor: isVisible ? 'rgba(25, 26, 30, 0.7)' : 'rgba(18, 18, 18, 0.9)' }}/>
      {isVisible && ( 
        <AccountSection>
          <CommonText value="Kirjaudu sisään omalla käyttäjätunnuksellasi ja salasanallasi." editable={false} />
          <CommonText
            value={usermail}
            onChangeText={setLoginUsername}
            editable={true}
            trailingIcon={() => <Icon name="person" />}
          />
          <CommonText
            value={password}
            onChangeText={setLoginPassword}
            editable={true}
            trailingIcon={() => <Icon name="lock" />}
            secureTextEntry
          />
          <ButtonContinue title="Kirjaudu" onPress={handleLogin}/>
        </AccountSection>
      )}
    </View>
  );
};

export const UserRegister = ({ isVisible, toggleVisible }) => {
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');

  const handleRegister = async () => {
    try {
      const data = await userRegister(registerEmail, registerPassword);
      if (data) {
        setRegisterEmail('');
        setRegisterPassword('');
        setIsVisible(false);
      } else {
        Alert.alert('Rekisteröityminen epäonnistui', 'Virhe rekisteröitymisessä');
      }
    } catch (error) {
      Alert.alert('Tapahtui virhe', error.message || 'Ei yhteyttä palvelimeen');
    }
  };

  return (
    <>
      <Heading title="Rekisteröidy" onPress={toggleVisible} style={{ backgroundColor: isVisible ? 'rgba(25, 26, 30, 0.7)' : 'rgba(18, 18, 18, 0.9)' }}/>
      {isVisible && ( 
        <AccountSection>
          <CommonText value="Rekisteröidy palvelun käyttäjäksi täyttämällä pyydetyt kohdat." editable={false} />
          <CommonText
            value={registerEmail}
            onChangeText={setRegisterEmail}
            editable={true}
            trailingIcon={() => <Icon name="email" />}
          />
          <CommonText
            value={registerPassword}
            onChangeText={setRegisterPassword}
            editable={true}
            trailingIcon={() => <Icon name="lock" />}
            secureTextEntry
          />
          <ButtonContinue title="Rekisteröidy" onPress={handleRegister}/>
        </AccountSection>
      )}
    </>
  );
};

export const DeleteAccountOfThisUser = () => {
  const {authState, setAuthState} = useContext(AuthenticationContext);
  const {userid, accessToken} = authState;
  const [isDeletingThisAccount, setDeletingThisAccount] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigation = useNavigation();
  
  const handleDeleteUser = async () => {
    try {
      const data = await userDelete(userid, accessToken);
      if (data.success) {
        Alert.alert('Tilin poisto onnistui');
      } else {
        Alert.alert('Tilin poisto epäonnistui', data.message || 'Virhe tilin poistossa');
      }
    } catch (error) {
      Alert.alert('Tapahtui virhe', error.message || 'Ei yhteyttä palvelimeen');
    }
  };

  const toggleDeletingThisAccount = () => {
    setDeletingThisAccount(!isDeletingThisAccount);
    setIsConfirmed(false);
  };

  const handleDoubleCheckWhenDeleting = () => {
    setDeletingThisAccount(false);
    setIsConfirmed(true);
  };

  const handleConfirmWhenDeleting = () => {
    handleDeleteUser();
    setAuthState(null);
    clearUserData();
    navigation.navigate('Home');
    console.log(userid, accessToken);
    setDeletingThisAccount(true);
  }

  const handleDeletingThisAccountCancel = () => {
    setDeletingThisAccount(false);
    setIsConfirmed(false);
  };

  return (
    <>
      <Heading title="Poista tili" onPress={toggleDeletingThisAccount} />

      {!isDeletingThisAccount ? (
          <></>
        ) : (
        <>
        <BasicSection>
            Mikäli poistat käyttäjätilisi palvelusta, sen kaikki tiedot poistetaan. Vahvistusta kysytään kerran painaessasi "Poista tili". {"\n\n"}

          <View style={globalStyles.viewButtons}>
            <ButtonDelete title="Poista tili" onPress={handleDoubleCheckWhenDeleting} />
            <ButtonCancel title="Peruuta" onPress={handleDeletingThisAccountCancel} />
          </View>
          </BasicSection>
          </>
        )}

      {isConfirmed && (
          <>
          <BasicSection>
            Oletko varma? {"\n\n"}

          <View style={globalStyles.viewButtons}>
            <ButtonConfirm title="Vahvista" onPress={handleConfirmWhenDeleting}/>
            <ButtonCancel title="Peruuta" onPress={handleDeletingThisAccountCancel} />
          </View>
          </BasicSection>
          </>
        )}
    </>
  );
};

export const LogoutFromThisUser = () => {
  const {authState, setAuthState} = useContext(AuthenticationContext);
  const {userid, accessToken} = authState;
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
        clearUserData();
        setAuthState(null);
        console.log(userid, accessToken);
        navigation.navigate('AccountMain');
    } catch (error) {
        console.error('Virhe uloskirjautumisessa:', error);
        Alert.alert('Virhe', 'Uloskirjautumisessa tapahtui virhe. Yritä uudelleen.');
    }
  };

  return (
    <>
      <ButtonNavigate title="Kirjaudu ulos" onPress={handleLogout}/>
    </>
  );
}

export const MessagingSystem = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonNavigate title="Keskustelut" onPress={() => navigation.navigate('MessagesMain')}/>
    </>
  );
};

export const NavigateToThisUsersItems = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonNavigate title="Ilmoitukset"  onPress={() => navigation.navigate('MessagesMain')}/>
    </>
  );
};

export const NavigateToThisUsersQueue = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonNavigate title="Varaukset" onPress={() => navigation.navigate('MessagesMain')}/>
    </>
  );
};

export const AccountSystem = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonNavigate title="Tilin hallinta" onPress={() => navigation.navigate('AccountMaintain')}
      />
    </>
  );
};