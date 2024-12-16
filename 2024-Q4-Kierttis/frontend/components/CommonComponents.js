import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import globalStyles from '../assets/styles/Styles'; 

export const Heading = ({ 
  title, 
  fontSize = 24, 
  backgroundColor = '#113859', 
  textColor = '#C9FFD9',
  onPress,
  style
}) => {
  return (
    <View style={[globalStyles.headingContainer, style || { backgroundColor }]}>
      <TouchableOpacity onPress={onPress}>
      <Text style={[globalStyles.title, { fontSize, color: textColor }, onPress]}>
        {title}
      </Text>
      </TouchableOpacity>
    </View>
  );
};

export const AccountSection = ({ 
  backgroundColor = 'rgba(243, 243, 243, 0.4)', 
  children }) => {
  return (
    <View style={[globalStyles.sectionContainer, { backgroundColor }]}>

      <View>
        {children}
      </View>

    </View>
  );
};

export const BasicSection = ({
  value,
  children,
  textStyle = { fontSize: 16, padding: 8 },
  backgroundColor = 'rgba(243, 243, 243, 0.88)',
  cornerRadius = 8,
}) => {
  return (
    <View style={[globalStyles.sectionContainer, { backgroundColor }]}>
      <Text style={[globalStyles.text, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

export const CommonText = ({
    children,
    value,
    onChangeText,
    textStyle = { fontSize: 16 },
    backgroundColor = 'rgba(233, 233, 233, 0.8)',
    editable = true,
    placeholder = '',
    cornerRadius = 8,
    trailingIcon = null,
    boxColor = '#000000',
    textColor = '#000000',
    secureTextEntry = false,
  }) => {
    return (
      <View style={[globalStyles.textContainer, { backgroundColor, borderRadius: cornerRadius }]}>
         <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        
        {editable ? (
          <TextInput
            value={value}
            onChangeText={onChangeText} 
            style={[globalStyles.textInput, textStyle, { color: boxColor, flex:1 }]}
            placeholder={placeholder}
            placeholderTextColor="#999999"
            secureTextEntry={secureTextEntry}
          />
        ) : (
          <Text style={[globalStyles.text, textStyle, { color: textColor }]}>
            {value || children}
          </Text>
        )}
        {trailingIcon && <View>{trailingIcon()}</View>}
        </View>
      </View>
    );
  };

export const CommonTitle = ({
    value,
    textStyle = { fontSize: 24, textAlign: 'center', padding: 8 },
    backgroundColor = 'rgba(25, 26, 30, 0.8)',
    cornerRadius = 8,
    textColor = '#ffffff',
  }) => {
    return (
      <View style={[globalStyles.textContainer, { backgroundColor, borderRadius: cornerRadius }]}>

          <Text style={[globalStyles.text, textStyle, { color: textColor }]}>
            {value}
          </Text>

      </View>   
    );
  };