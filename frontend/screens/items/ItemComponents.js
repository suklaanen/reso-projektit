import React, { useRef } from 'react';
import { ScrollView } from 'react-native';
import { AllItems, NoItemsWhenLoggedOut } from './ItemExports';

export const ItemsLoggedIn = () => {
  const scrollViewRef = useRef(null);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }} ref={scrollViewRef}>
        <AllItems />
    </ScrollView>
  );
};

export const ItemsLoggedOut = () => {
  const scrollViewRef = useRef(null);

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }} ref={scrollViewRef}>
        <NoItemsWhenLoggedOut />
    </ScrollView>
  );
};