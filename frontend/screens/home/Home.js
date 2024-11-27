import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthenticationContext";
import { ScrollView, Text, View } from "react-native";
import { Heading } from "../../components/CommonComponents";
import AuthScreen from "../auth/AuthScreen";
import globalStyles from "../../assets/styles/Styles";
import { Image } from "react-native";

const Home = () => {
  const authState = useAuth();

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      {authState ? (
        <>
          <View style={globalStyles.separatorThin} />
          <Text
            style={globalStyles.defText}
          >{`Olet kirjautunut käyttäjänä:`}</Text>
          <Text
            style={globalStyles.defTitle}
          >{`${authState.user.username}`}</Text>
          <View style={globalStyles.separatorBold} />

          <Image
            source={require("../../assets/images/bg2.png")}
            style={globalStyles.image}
            resizeMode="contain"
          />
        </>
      ) : (
        <AuthScreen />
      )}
    </ScrollView>
  );
};

export default Home;
