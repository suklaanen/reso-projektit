import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const ButtonContinue = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContinue, style]}
      onPress={onPress}
    >
      <Text style={styles.textContinue}>{title}</Text>
    </TouchableOpacity>
  );
};

export const ButtonDelete = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonDelete, style]}
      onPress={onPress}
    >
      <Text style={styles.textDelete}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonConfirm = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonConfirm, style]}
      onPress={onPress} 
    >
      <Text style={styles.textConfirm}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonCancel = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonCancel, style]}
      onPress={onPress} 
    >
      <Text style={styles.textCancel}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonEdit = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonEdit, style]}
      onPress={onPress} 
    >
      <Text style={styles.textEdit}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonAdd = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonAdd, style]}
      onPress={onPress}
    >
      <Text style={styles.textAdd}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonSave = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonSave, style]}
      onPress={onPress} 
    >
      <Text style={styles.textSave}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonPage = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonPage, style]}
      onPress={onPress}
    >
      <Text style={styles.textPage}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonSetup = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonSetup, style]}
      onPress={onPress} 
    >
      <Text style={styles.textSetup}>{title}</Text>
    </TouchableOpacity>
  );
}

export const ButtonReset = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonReset, style]}
      onPress={onPress} 
    >
      <Text style={styles.textSetup}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  buttonContinue: {
    backgroundColor: '#003366', 
    borderRadius: 22,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: '100%',
  },

  textContinue: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },

  buttonDelete: {
    backgroundColor: '#720002', 
    borderRadius: 22,
    borderColor: '#59050c',
    borderWidth: 3,
    borderStyle: 'solid',
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: '45%',
  },

  textDelete: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },

  buttonConfirm: {
    backgroundColor: '#c84244', 
    borderRadius: 22,
    borderColor: '#6f0914',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: '45%',
  },

  textConfirm: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },

  buttonCancel: {
    backgroundColor: '#c3c3c3', 
    borderRadius: 22,
    borderColor: '#3c3c3c',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: '45%',
  },

  textCancel: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },

  buttonEdit: {
    backgroundColor: '#113c6b', 
    borderRadius: 22,
    borderColor: '#050a59',
    borderWidth: 3,
    borderStyle: 'solid',
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: '45%',
  },

  textEdit: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },

  buttonAdd: {
    backgroundColor: '#003366', 
    borderRadius: 22,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: '100%',
  },

  textAdd: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },

  buttonSave: {
    backgroundColor: '#186b11', 
    borderRadius: 22,
    borderColor: '#0f4f1a',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: '45%',
  },

  textSave: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },

  buttonPage: {
    backgroundColor: '#d0d0d0', 
    borderRadius: 22,
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
    width: '30%',
  },

  textPage: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
  },

  buttonSetup: {
    backgroundColor: '#8bb1e7', 
    borderRadius: 22,
    padding: 12,
    borderColor: '#0f4f1a',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginHorizontal: 8,
    alignItems: 'center',
    width: '100%',
  },
  
  buttonReset: {
    backgroundColor: '#d0d0d0', 
    borderRadius: 22,
    padding: 12,
    borderColor: '#0f4f1a',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginHorizontal: 8,
    alignItems: 'center',
    width: '100%',
  },

  textSetup: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
  },

});
