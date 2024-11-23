import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import Toast from "react-native-toast-message";
import { saveUserToFirestore } from "../../services/firestoreUsers";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import globalStyles from "../../assets/styles/Styles";
import GlobalButtons from "../../assets/styles/GlobalButtons";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // for registration

  const toggleAuthForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const showToast = (type, title, message) => {
    Toast.show({ type, text1: title, text2: message });
  };

  const handleRegister = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await saveUserToFirestore(user.uid, username, email.toLocaleLowerCase());
      showToast("success", "Käyttäjätunnus luotu!", "Voit nyt kirjautua!");
      setIsLogin(true);
    } catch (error) {
      showToast(
        "error",
        "Rekisteröinti epäonnistui",
        error.message || "Yhteysvirhe"
      );
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      showToast(
        "error",
        "Kirjautuminen epäonnistui",
        error.message || "Yhteysvirhe"
      );
    }
  };

  const authButtonText = isLogin ? "Kirjaudu sisään" : "Rekisteröidy";
  const switchText = isLogin
    ? "Eikö sinulla ole tiliä?"
    : "Onko sinulla jo tili?";

  return (
    <View style={[styles.container, globalStyles.container]}>
      <Text style={[styles.title, globalStyles.title]}>
        {isLogin ? "Kirjaudu sisään" : "Rekisteröidy"}
      </Text>
      {!isLogin && (
          <TextInput
              placeholder="Käyttäjänimi"
              value={username}
              onChangeText={setUsername}
              style={[styles.input, globalStyles.input]}
          />
      )}
      <TextInput
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, globalStyles.input]}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        style={[styles.input, globalStyles.input]}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={GlobalButtons.buttonContinue}
          onPress={isLogin ? handleLogin : handleRegister}
        >
          <Text style={GlobalButtons.whiteBase16}>{authButtonText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.switchContainer}>
        <Text style={[styles.caption, globalStyles.caption]}>{switchText}</Text>
        <TouchableOpacity onPress={toggleAuthForm} style={styles.switchButton}>
          <Text style={[styles.switchButtonText, globalStyles.text]}>
            {isLogin ? "Rekisteröidy" : "Kirjaudu"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 25,
  },
  switchButton: {
    marginStart: 4,
  },
  switchButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  caption: {
    fontSize: 16,
    color: "#666",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

export default AuthScreen;
