import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { ScrollView, Text, View } from 'react-native';
import { Heading } from '../../components/CommonComponents';
import AuthScreen from "../auth/AuthScreen";
import globalStyles from "../../assets/styles/Styles";

const Home = () => {
    const  authState  = useContext(AuthenticationContext);

    return (
      <ScrollView contentContainerStyle={{ padding: 8 }}>
          {authState ? (
            <ScrollView contentContainerStyle={{ padding: 8 }}>

              <View style={globalStyles.separatorThin} />
                <Text style={globalStyles.defText}>{`Olet kirjautunut käyttäjänä:`}</Text>
                <Text style={globalStyles.defTitle}>{`${authState.user.username}`}</Text>
              <View style={globalStyles.separatorBold} />

              <Text style={globalStyles.betwTitle}>{`Uusimmat ilmoitukset`} </Text>
              <Text style={globalStyles.defText}>{`Palvelun uudet julkaisut Here.. tai lähelläsi tai jotain`}</Text>

           </ScrollView>
        ) : (
            <AuthScreen />
        )}
    </ScrollView>
    );
};

export default Home;
