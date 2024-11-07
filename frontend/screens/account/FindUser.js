import React, { useState, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Heading, AccountSection, CommonText, BasicSection } from '../../components/CommonComponents';
import { ButtonSave, ButtonCancel, ButtonDelete, ButtonConfirm, ButtonNavigate } from '../../components/Buttons';
import { ButtonContinue } from '../../components/Buttons';
import { Icon } from 'react-native-elements';
import { userDelete, userLogin, userRegister, userReset } from '../../services/api.js';
import { useNavigation } from '@react-navigation/native';
import { AuthenticationContext } from '../../services/auth.js'
import { clearUserData, saveUserData } from '../../services/asyncStorageHelper';
import globalStyles from '../../assets/styles/Styles.js';

export const UserLogin = ({ isVisible, toggleVisible })  => {
  const [username, setLoginUsername] = useState('');
  const [password, setLoginPassword] = useState('');
  const {authState, setAuthState} = useContext(AuthenticationContext);
  const navigation = useNavigation();

  const handleLoginSuccess = async (data) => {
      console.log('Kirjautuminen onnistui käyttäjätiedoilla:', data);
      saveUserData(data);
      setAuthState(data);
  };

  const handleLogin = async () => {
    try {
        const result = await userLogin(username, password);
        console.log('Login result:', result); 
        if (result && result.success) {
          handleLoginSuccess({
                userId: result.userid,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                username: result.username
            });
            navigation.navigate('AccountLoggedIn');
        } else {
            Alert.alert('Kirjautuminen epäonnistui', result.message || 'Tuntematon virhe');
        }
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Virhe kirjautumisessa', error.message || 'Yhteysvirhe');
    }
};

  return (
    <>
      <Heading title="Kirjaudu sisään" onPress={toggleVisible} style={{ backgroundColor: isVisible ? 'rgba(25, 26, 30, 0.7)' : 'rgba(18, 18, 18, 0.9)' }}/>
      {isVisible && ( 
        <AccountSection>
          <CommonText value="Kirjaudu sisään omalla käyttäjätunnuksellasi ja salasanallasi." editable={false} />
          <CommonText
            value={username}
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
    </>
  );
};

export const UserRegister = ({ isVisible, toggleVisible }) => {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');

  const handleRegister = async () => {
    try {
      const data = await userRegister(registerUsername, registerEmail, registerPassword);
      if (data.success) {
        Alert.alert('Rekisteröityminen onnistui', 'Voit nyt kirjautua sisään');
        setRegisterEmail('');
        setRegisterUsername('');
        setRegisterPassword('');
        setIsVisible(false);
      } else {
        Alert.alert('Rekisteröityminen epäonnistui', data.message || 'Virhe rekisteröitymisessä');
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
          value={registerUsername}
          onChangeText={setRegisterUsername}
          editable={true}
          trailingIcon={() => <Icon name="person" />}
        />
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

export const UserResetPassword = ({ isVisible, toggleVisible }) => {
  const [forgottenEmail, setForgottenEmail] = useState('');
  const handlePasswordReset = async () => {
    try {
      const data = await userReset(forgottenEmail);
      if (data.success) {
        Alert.alert('Salasanan palautuspyyntö', 'Uusi salasana on lähetetty sähköpostiisi');
        setForgottenEmail('');
        setIsVisible(false);
      } else {
        Alert.alert('Tapahtui Virhe', data.message || 'Salasanan palautus epäonnistui');
      }
    } catch (error) {
      Alert.alert('Tapahtui virhe', error.message || 'Ei yhteyttä palvelimeen');
    }
  };

  return (
    <>
      <Heading title="Salasanan palautus" onPress={toggleVisible} style={{ backgroundColor: isVisible ? 'rgba(25, 26, 30, 0.7)' : 'rgba(18, 18, 18, 0.9)' }}/>

      {isVisible && (
      <AccountSection>
      <CommonText value="Palauta salasana rekisteröimääsi sähköpostiin." editable={false} />

        <CommonText
          value={forgottenEmail}
          onChangeText={setForgottenEmail}
          editable={true}
          trailingIcon={() => <Icon name="email" />}
        />
        <ButtonContinue title="Palauta salasana" onPress={handlePasswordReset} />
      </AccountSection>
    )}
    </>
  );
};

export const ChangePasswordOfThisUser = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const togglePasswordChange = () => {
    setIsChangingPassword(!isChangingPassword);
  };

  const handlePasswordChangeConfirm = async () => {
    
    const data = await userReset(newPassword);
    if (data.success) {
      Alert.alert('Salasanan vaihto onnistui', 'Voit nyt kirjautua sisään uudella salasanallasi');
      setIsChangingPassword(false);
      setNewPassword('');
    } else {
      Alert.alert('Salasanan vaihto epäonnistui', data.message || 'Virhe salasanan vaihdossa');
    }
  };

  const handlePasswordChangeCancel = () => {
    setIsChangingPassword(false);
    setNewPassword('');
  };

  return (
    <>
      <Heading title="Vaihda salasana" onPress={togglePasswordChange}/>
      
        {!isChangingPassword ? (
          <></>
        ) : (
          <>
            <AccountSection>
              <CommonText
                placeholder="Uusi salasana"
                value={newPassword}
                onChangeText={setNewPassword}
                trailingIcon={() => <Icon name="lock" />}
                secureTextEntry
              />
            </AccountSection>
            
            <View style={globalStyles.viewButtons}>
              <ButtonSave title="Vahvista" onPress={handlePasswordChangeConfirm} />
              <ButtonCancel title="Peruuta" onPress={handlePasswordChangeCancel} />
            </View>
          </>
        )}

    </>
  );
};

export const DeleteAccountOfThisUser = () => {
  const {authState, setAuthState} = useContext(AuthenticationContext);
  const {userid, accessToken, refreshToken, username} = authState;
  const [isDeletingThisAccount, setDeletingThisAccount] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigation = useNavigation();
  
  const handleDeleteUser = async () => {
    try {
      const data = await userDelete(userid, accessToken, refreshToken, username);
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
    console.log(userid, accessToken, refreshToken);
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
          </BasicSection>
          <View style={globalStyles.viewButtons}>
            <ButtonDelete title="Poista tili" onPress={handleDoubleCheckWhenDeleting} />
            <ButtonCancel title="Peruuta" onPress={handleDeletingThisAccountCancel} />
          </View>
          </>
        )}

      {isConfirmed && (
          <>
          <BasicSection>
            Oletko varma? {"\n\n"}
          </BasicSection>
          <View style={globalStyles.viewButtons}>
            <ButtonConfirm title="Vahvista" onPress={handleConfirmWhenDeleting}/>
            <ButtonCancel title="Peruuta" onPress={handleDeletingThisAccountCancel} />
          </View>
          </>
        )}
    </>
  );
};

export const LogoutFromThisUser = () => {
  const {authState, setAuthState} = useContext(AuthenticationContext);
  const {userid, accessToken, refreshToken} = authState;
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
        clearUserData();
        setAuthState(null);
        console.log(userid, accessToken, refreshToken);
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
};

export const MessagingSystem = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonNavigate title="Keskustelut" onPress={() => navigation.navigate('MessagesMain')}/>
    </>
  );
};

export const AccountSystem = () => {
  const navigation = useNavigation(); 

  return (
    <>
      <ButtonNavigate title="Tilin hallinta" onPress={() => navigation.navigate('AccountMaintain')}/>
    </>
  );
};