import React, { useState, useContext } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { Alert, View } from "react-native";
import {
  Heading,
  AccountSection,
  CommonText,
  BasicSection,
} from "../../components/CommonComponents";
import {
  ButtonCancel,
  ButtonDelete,
  ButtonConfirm,
  ButtonContinue,
  ButtonNavigate,
} from "../../components/Buttons";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import globalStyles from "../../assets/styles/Styles.js";
import Toast from "react-native-toast-message";
import { saveUserToFirestore } from "../../services/firebaseController.js";

export const UserLogin = ({ isVisible, toggleVisible }) => {
  const [usermail, setLoginUsername] = useState("");
  const [password, setLoginPassword] = useState("");
  const { setAuthState } = useContext(AuthenticationContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const data = await signInWithEmailAndPassword(auth, usermail, password);
      if (data) {
        setAuthState(data);
      } else {
        Alert.alert(
          "Kirjautuminen epäonnistui",
          "Virheellinen käyttäjätunnus tai salasana"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Virhe kirjautumisessa", error.message || "Yhteysvirhe");
      Toast.show({
        type: "error",
        text1: "Kirjautuminen epäonnistui",
        text2: error.message || "Yhteysvirhe",
      });
    }
  };

  return (
    <View>
      <Heading
        title="Kirjaudu sisään"
        onPress={toggleVisible}
        style={{
          backgroundColor: isVisible
            ? "rgba(25, 26, 30, 0.7)"
            : "rgba(18, 18, 18, 0.9)",
        }}
      />
      {isVisible && (
        <AccountSection>
          <CommonText
            value="Kirjaudu sisään omalla käyttäjätunnuksellasi ja salasanallasi."
            editable={false}
          />
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
          <ButtonContinue title="Kirjaudu" onPress={handleLogin} />
        </AccountSection>
      )}
    </View>
  );
};

export const UserRegister = ({ isVisible, toggleVisible }) => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  const userRegister = async (email, password, registerUsername) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      Toast.show({
        type: "success",
        text1: "Käyttäjätunnus luotu!",
        text2: "Voit nyt kirjautua!",
      });

      await saveUserToFirestore(uid, registerUsername, email);

      return { success: true, uid, username: registerUsername, email };
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Käyttäjän luominen epäonnistui.",
        text2: error.message,
      });
      console.error("Rekisteröinnissä tapahtui virhe:", error.message);
      throw error;
    }
  };

  const handleRegister = async () => {
    try {
      const data = await userRegister(
        registerEmail,
        registerPassword,
        registerUsername
      );
      if (data) {
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterUsername("");
      } else {
        Alert.alert(
          "Rekisteröityminen epäonnistui",
          "Virhe rekisteröitymisessä"
        );
      }
    } catch (error) {
      Alert.alert("Tapahtui virhe", error.message || "Ei yhteyttä palvelimeen");
    }
  };

  return (
    <>
      <Heading
        title="Rekisteröidy"
        onPress={toggleVisible}
        style={{
          backgroundColor: isVisible
            ? "rgba(25, 26, 30, 0.7)"
            : "rgba(18, 18, 18, 0.9)",
        }}
      />
      {isVisible && (
        <AccountSection>
          <CommonText
            value="Rekisteröidy palvelun käyttäjäksi täyttämällä pyydetyt kohdat."
            editable={false}
          />
          <CommonText
            placeholder="Käyttäjätunnus"
            value={registerUsername}
            onChangeText={setRegisterUsername}
            editable={true}
            trailingIcon={() => <Icon name="person" />}
          />
          <CommonText
            placeholder="Sähköposti"
            value={registerEmail}
            onChangeText={setRegisterEmail}
            editable={true}
            trailingIcon={() => <Icon name="email" />}
          />
          <CommonText
            placeholder="Salasana"
            value={registerPassword}
            onChangeText={setRegisterPassword}
            editable={true}
            trailingIcon={() => <Icon name="lock" />}
            secureTextEntry
          />
          <ButtonContinue title="Rekisteröidy" onPress={handleRegister} />
        </AccountSection>
      )}
    </>
  );
};

export const DeleteAccountOfThisUser = () => {
  const { setAuthState } = useContext(AuthenticationContext);
  const [isDeletingThisAccount, setDeletingThisAccount] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigation = useNavigation();

  const userDelete = async () => {
    try {
      const user = auth.currentUser;

      await deleteUserDataFromFirestore(user.uid);

      await user.delete();
      console.log("Käyttäjän autentikointitili poistettu");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Poistovirhe",
        text2: error.message,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await userDelete();
      setAuthState(null);
      Alert.alert("Tilin poisto onnistui");
    } catch (error) {
      Alert.alert("Tapahtui virhe", error.message);
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
    navigation.navigate("Home");
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
            Mikäli poistat käyttäjätilisi palvelusta, sen kaikki tiedot
            poistetaan. Vahvistusta kysytään kerran painaessasi "Poista tili".{" "}
            {"\n\n"}
          </BasicSection>
          <View style={globalStyles.viewButtons}>
            <ButtonDelete
              title="Poista tili"
              onPress={handleDoubleCheckWhenDeleting}
            />
            <ButtonCancel
              title="Peruuta"
              onPress={handleDeletingThisAccountCancel}
            />
          </View>
        </>
      )}

      {isConfirmed && (
        <>
          <BasicSection>Oletko varma? {"\n\n"}</BasicSection>
          <View style={globalStyles.viewButtons}>
            <ButtonConfirm
              title="Vahvista"
              onPress={handleConfirmWhenDeleting}
            />
            <ButtonCancel
              title="Peruuta"
              onPress={handleDeletingThisAccountCancel}
            />
          </View>
        </>
      )}
    </>
  );
};

export const LogoutFromThisUser = () => {
  const { authState, setAuthState } = useContext(AuthenticationContext);
  const { userid, accessToken } = authState;
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      setAuthState(null);
      await auth.signOut();
      navigation.navigate("AccountMain");
    } catch (error) {
      console.error("Virhe uloskirjautumisessa:", error);
      Alert.alert(
        "Virhe",
        "Uloskirjautumisessa tapahtui virhe. Yritä uudelleen."
      );
    }
  };

  return (
    <>
      <ButtonNavigate title="Kirjaudu ulos" onPress={handleLogout} />
    </>
  );
};

export const MessagingSystem = () => {
  const navigation = useNavigation();

  return (
    <>
      <ButtonNavigate
        title="Keskustelut"
        onPress={() => navigation.navigate("MessagesMain")}
      />
    </>
  );
};

export const NavigateToThisUsersItems = () => {
  const navigation = useNavigation();

  return (
    <>
      <ButtonNavigate
        title="Ilmoitukset"
        onPress={() => navigation.navigate("MessagesMain")}
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
        onPress={() => navigation.navigate("MessagesMain")}
      />
    </>
  );
};

export const AccountSystem = () => {
  const navigation = useNavigation();

  return (
    <>
      <ButtonNavigate
        title="Tilin hallinta"
        onPress={() => navigation.navigate("AccountMaintain")}
      />
    </>
  );
};
