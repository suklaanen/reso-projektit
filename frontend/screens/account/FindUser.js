import React, { useState } from "react";
import { auth } from "../../services/firebaseConfig";
import { Alert, View } from "react-native";
import { BasicSection, Heading } from "../../components/CommonComponents";
import {
  ButtonCancel,
  ButtonConfirm,
  ButtonDelete,
  ButtonNavigate,
} from "../../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../assets/styles/Styles.js";
import Toast from "react-native-toast-message";
import { deleteUserDataFromFirestore } from "../../services/firebaseController.js";

const DeleteAccountOfThisUser = () => {
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDelete = async () => {
    try {
      await userDelete();
      navigation.navigate("Home");
      Alert.alert("Tilin poisto onnistui");
    } catch (error) {
      Alert.alert("Tapahtui virhe", error.message);
    }
  };

  const showDoubleCheck = () => setIsDeleting(true);
  const confirmDelete = () => handleDelete();
  const cancelDelete = () => setIsDeleting(false);

  return (
    <>
      <Heading title="Poista tili" />
      {!isDeleting ? (
        <>
          <BasicSection>
            Mikäli poistat käyttäjätilisi palvelusta, sen kaikki tiedot
            poistetaan. Vahvistusta kysytään kerran painaessasi "Poista tili".
            {"\n\n"}
          </BasicSection>
          <View style={globalStyles.viewButtons}>
            <ButtonDelete title="Poista" onPress={showDoubleCheck} />
            <ButtonCancel title="Peruuta" onPress={navigation.goBack} />
          </View>
        </>
      ) : (
        <>
          <BasicSection>Oletko varma? {"\n\n"}</BasicSection>
          <View style={globalStyles.viewButtons}>
            <ButtonConfirm title="Vahvista" onPress={confirmDelete} />
            <ButtonCancel title="Peruuta" onPress={cancelDelete} />
          </View>
        </>
      )}
    </>
  );
};

const LogoutFromThisUser = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
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

  return <ButtonNavigate title="Kirjaudu ulos" onPress={handleLogout} />;
};

const MessagingSystem = () => {
  const navigation = useNavigation();
  return (
    <ButtonNavigate
      title="Keskustelut"
      onPress={() => navigation.navigate("MessagesMain")}
    />
  );
};

const NavigateToThisUsersItems = () => {
  const navigation = useNavigation();
  return (
    <ButtonNavigate
      title="Ilmoitukset"
      onPress={() => navigation.navigate("MessagesMain")}
    />
  );
};

const NavigateToThisUsersQueue = () => {
  const navigation = useNavigation();
  return (
    <ButtonNavigate
      title="Varaukset"
      onPress={() => navigation.navigate("MessagesMain")}
    />
  );
};

const AccountSystem = () => {
  const navigation = useNavigation();
  return (
    <ButtonNavigate
      title="Poista tili"
      onPress={() => navigation.navigate("AccountMaintain")}
    />
  );
};

export {
  DeleteAccountOfThisUser,
  LogoutFromThisUser,
  MessagingSystem,
  NavigateToThisUsersItems,
  NavigateToThisUsersQueue,
  AccountSystem,
};
