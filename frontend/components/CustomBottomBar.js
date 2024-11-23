import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Image, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../assets/styles/Styles';
import logo from '../assets/images/kierttisTitle.png';
import { AuthenticationContext } from "../context/AuthenticationContext";

const CustomBottomBar = () => {
  const navigation = useNavigation(); 
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const authState = useContext(AuthenticationContext);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true); 
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false); 
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const shouldShowBottomBar = !isKeyboardVisible;

  return (
    authState && shouldShowBottomBar && (
      <View style={globalStyles.bottomBar}>
        <TouchableOpacity style={globalStyles.iconButton}>
          <MaterialIcons name="home" size={40} color="#ffffff" onPress={() => { navigation.navigate('Home'); }}/>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.iconButton} onPress={() => { navigation.navigate('ItemsMain'); }}>
          <Image source={logo} style={globalStyles.findItems} />
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.iconButton}>
          <MaterialIcons name="person" size={40} color="#ffffff" onPress={() => { navigation.navigate('AccountLoggedIn'); }}/>
        </TouchableOpacity>
      </View>
    )
  );
};

export default CustomBottomBar;