import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, Text} from 'react-native';
import { Heading, BasicSection } from '../../components/CommonComponents';
import { AuthenticationContext } from '../../services/auth';
import { firestore } from '../../services/firebaseConfig';
import { doc, onSnapshot, query, where, collection } from 'firebase/firestore';

const MessagesMain = () => {
    // const {authState} = useContext(AuthenticationContext);
    const [threads, setThreads] = useState([]);
    const sampleUserId = "2vpqcqFcuHNJvhJOldR2"

    useEffect(() => {
        const threadsRef = collection(firestore, "threadstest");
        const userRef = doc(firestore, "users", sampleUserId);

        const q = query(threadsRef, where('participants', 'array-contains', userRef));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const threadsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setThreads(threadsData); 
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log(threads);
    }, [threads]);

    return (
        <ScrollView contentContainerStyle={{ padding: 8 }}>
            <Heading title="Omat keskustelut" />

            <BasicSection>
                {threads.length > 0 ? (
                    threads.map(thread => (
                        <Text key={thread.id}>{thread.id}{"\n"}</Text>
                    ))
                ) : (
                    <Text>Aktiivisia keskusteluja ei löytynyt</Text>
                )}
            </BasicSection>

        </ScrollView>
    );
};

export default MessagesMain;