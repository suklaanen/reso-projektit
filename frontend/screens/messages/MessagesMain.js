import React, { useContext, useState } from 'react';
import { ScrollView, Text} from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { AuthenticationContext } from '../../services/auth';

const MessagesMain = () => {
    const {authState} = useContext(AuthenticationContext);


    if (!authState) {
      return <Text>No user data found.</Text>;
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 8 }}>
            <Heading title="Omat keskustelut" />

            <BasicSection>
                Tähän käyttäjän aktiiviset keskustelut
            </BasicSection>

        </ScrollView>
    );
};

export default MessagesMain;