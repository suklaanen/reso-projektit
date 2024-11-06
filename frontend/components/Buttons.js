import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import GlobalButtons from '../assets/styles/GlobalButtons';

export const ButtonContinueOrig = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonContinue}
      onPress={onPress}
    >
      <Text style={GlobalButtons.whiteBase24}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonContinue = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonContinue}
      onPress={onPress}
    >
      <Text style={GlobalButtons.blackBase18}>{title}</Text>
    </TouchableOpacity>
  );
};


export const ButtonDelete = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonDelete}
      onPress={onPress}
    >
      <Text style={GlobalButtons.whiteBase16}>{title}</Text>
    </TouchableOpacity> 
  );
}

export const ButtonConfirm = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonConfirm}
      onPress={onPress} 
    >
      <Text style={GlobalButtons.whiteBase16}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonCancel = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonCancel}
      onPress={onPress} 
    >
      <Text style={GlobalButtons.blackBase16}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonEdit = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonEdit}
      onPress={onPress} 
    >
      <Text style={GlobalButtons.whiteBase16}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonAdd = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonAdd}
      onPress={onPress}
    >
      <Text style={GlobalButtons.whiteBase24}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonSave = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonSave}
      onPress={onPress} 
    >
      <Text style={GlobalButtons.whiteBase16}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonPage = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonPage}
      onPress={onPress}
    >
      <Text style={GlobalButtons.blackBase14}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonSetup = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonSetup}
      onPress={onPress} 
    >
      <Text style={GlobalButtons.blackBase14}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonReset = ({ title, onPress}) => {
  return (
    <TouchableOpacity
      style={GlobalButtons.buttonReset}
      onPress={onPress} 
    >
      <Text style={GlobalButtons.blackBase14}>{title}</Text>
    </TouchableOpacity>
  );
}