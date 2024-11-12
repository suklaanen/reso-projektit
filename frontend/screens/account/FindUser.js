import React, { useState, useContext } from 'react';
import { View, Alert, ToastAndroid } from 'react-native';
import { Heading, AccountSection, CommonText, BasicSection } from '../../components/CommonComponents';
import { ButtonSave, ButtonCancel, ButtonDelete, ButtonConfirm, ButtonNavigate, ButtonContinue } from '../../components/Buttons';
import { Icon } from 'react-native-elements';
import { userReset } from '../../services/api.js';
import { useNavigation } from '@react-navigation/native';
import { AuthenticationContext } from '../../services/auth.js';
import { clearUserData, saveUserData } from '../../services/asyncStorageHelper';
import globalStyles from '../../assets/styles/Styles.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser} from "firebase/auth";
import { app, auth, firestore, collection, addDoc, getDocs, deleteDoc, query, where } from '../../services/firebaseConfig';


export const UserLogin = ({ isVisible, toggleVisible })  => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
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
      let result;
      let email;
      
      // Normalisoidaan syötetty teksti pieniksi kirjaimiksi
      const normalizedInput = usernameOrEmail.toLowerCase();

      // Tarkistetaan, että onko kirjautumisessa käytetty tunnus sähköpostiosoite
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);
  
      if (isValidEmail) {
        // Yritetään kirjautua sähköpostiosoitteella 
        result = await signInWithEmailAndPassword(auth, usernameOrEmail, password);
        email = usernameOrEmail;
      } else {
        // Muussa tapauksessa käyttäjätunnuksen perusteella firestoresta sähköpostitunnus
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('username', '==', usernameOrEmail));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          email = userData.email;
  
          // Yritetään kirjautua noudetulla sähköpostilla ja salasanalla
          result = await signInWithEmailAndPassword(auth, email, password);
        } else {
          Alert.alert('Kirjautuminen epäonnistui', 'Käyttäjätunnusta ei löytynyt');
          return;
        }
      }
  
      console.log('Login result:', result);
      if (result) {
        // Noudetaan käyttäjätunnus Firestoresta jos sitä ei ole jo tehty.
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const username = userData.username;
  
          handleLoginSuccess({
            userId: result.user.uid,
            accessToken: result.user.stsTokenManager.accessToken,
            refreshToken: result.user.stsTokenManager.refreshToken,
            username: username,
            email: result.user.email
          });
        } else {
          Alert.alert('Kirjautuminen epäonnistui', 'Käyttäjätunnusta ei löytynyt');
        }
        navigation.navigate('AccountLoggedIn');
      }
    } catch (error) {
      console.error('Virhe kirjautumisessa:', error);
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
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
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
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const [loginInfo, setLoginInfo] = useState('');

  const createAccount = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoginInfo("Käyttäjätunnus luotu! Voit nyt kirjautua!");
        ToastAndroid.show("Käyttäjätunnus luotu! Voit nyt kirjautua!", ToastAndroid.SHORT);
        return userCredential;
      })
      .catch((error) => {
        const errorMessage = error.message;
        setLoginInfo(`Käyttäjän luominen epäonnistui.\n\n ${errorMessage}`);
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        return null;
      });
  };

  // Tallennetaan käyttäjätunnus Firestoreen
  const saveUserToFirestore = async (user) => {
    try {
      await addDoc(collection(firestore, 'users'), {
        username: registerUsername,
        email: registerEmail.toLowerCase(),
        uid: user.uid
      });
      console.log('Käyttäjä lisätty Firestoreen');
    } catch (error) {
      console.error('Virhe lisättäessä käyttäjää Firestoreen:', error);
    }
  };

  // Tarkistetaanko, että täsmäävätkö reskisteröintin kirjoitetut salasanat
  const handleRegister = async () => {
    if (registerPassword !== confirmPassword) {
      Alert.alert('Virhe', 'Salasanat eivät täsmää');
      return;
    }

    // Jos salasanat täsmäävät niin rekisteröidytään ja tyhjennetään rekisteröintilomake.
    try {
      const normalizedEmail = registerEmail.toLowerCase();
      const data = await createAccount(normalizedEmail, registerPassword);
      if (data) {
        await saveUserToFirestore(data.user);
        Alert.alert('Rekisteröityminen onnistui', 'Voit nyt kirjautua sisään');
        setRegisterEmail('');
        setRegisterUsername('');
        setRegisterPassword('');
        setConfirmPassword('');
        toggleVisible(false);
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
          placeholder='Käyttäjätunnus'
          value={registerUsername}
          onChangeText={setRegisterUsername}
          editable={true}
          trailingIcon={() => <Icon name="person" />}
        />
        <CommonText
          placeholder='Sähköposti'
          value={registerEmail}
          onChangeText={setRegisterEmail}
          editable={true}
          trailingIcon={() => <Icon name="email" />}
        />
        <CommonText
          placeholder='Salasana'
          value={registerPassword}
          onChangeText={setRegisterPassword}
          editable={true}
          trailingIcon={() => <Icon name="lock" />}
          secureTextEntry
        />
        <CommonText
          placeholder='Toista salasana'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={true}
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
      const user = auth.currentUser;
      if (user) {
        // Poistetaan käyttäjään liittyvät tiedot Firestoresta
        // TÄTÄ PITÄÄ VIELÄ PÄIVITTÄÄ, ETTÄ POISTETAAN KAIKKI KÄYTTÄJÄN UIDHEN LIITTYVÄ MATERIAALI, MYÖS ILMOITUKSET
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          await deleteDoc(userDoc.ref);
          console.log('Käyttäjän tiedot poistettu Firestoresta');
        } else {
          console.log('Käyttäjän tietoja ei löytynyt Firestoresta');
        }
  
        // Poistetaan käyttäjätili Firebase Authenticationista
        await deleteUser(user);
        Alert.alert('Tilin poisto onnistui');
        setAuthState(null);
        clearUserData();
        navigation.navigate('Home');
      } else {
        Alert.alert('Tilin poisto epäonnistui', 'Käyttäjää ei löytynyt');
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
    setDeletingThisAccount(true);
  };

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
            <ButtonConfirm title="Vahvista" onPress={handleConfirmWhenDeleting} />
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