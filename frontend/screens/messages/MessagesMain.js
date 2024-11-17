import React, { useContext, useState, useEffect } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { Heading, BasicSection } from "../../components/CommonComponents";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { firestore } from "../../services/firebaseConfig";
import {
  doc,
  onSnapshot,
  query,
  where,
  collection,
  getDoc,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import ThreadCard from "./ThreadCard";

const MessagesMain = () => {
  // const {authState} = useContext(AuthenticationContext);
  const [threads, setThreads] = useState([]);
  const sampleUserId = "CzmNeYO7av152mqA9SHY";

  useEffect(() => {
    const threadsRef = collection(firestore, "threads");
    const userRef = doc(firestore, "users", sampleUserId);

    const q = query(
      threadsRef,
      where("participants", "array-contains", userRef)
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const threadsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const thread = docSnap.data();
          const threadId = docSnap.id;

          const messagesRef = collection(
            firestore,
            "threads",
            threadId,
            "messages"
          );
          const messageQuery = query(
            messagesRef,
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const messageSnapshot = await getDocs(messageQuery);

          let latestMessage = null;
          if (!messageSnapshot.empty) {
            latestMessage = messageSnapshot.docs[0].data();
          }

          return {
            ...thread,
            id: threadId,
            latestMessage,
          };
        })
      );

      const sortedThreads = threadsData.sort((a, b) => {
        if (!a.latestMessage || !b.latestMessage) return 0;
        return (
          b.latestMessage.createdAt.seconds - a.latestMessage.createdAt.seconds
        );
      });

      setThreads(sortedThreads);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Heading title="Omat keskustelut" />

      <ScrollView style={styles.scrollContainer}>
        {threads.length > 0 ? (
          threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        ) : (
          <Text style={styles.noThreadsText}>
            Aktiivisia keskusteluja ei löytynyt
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  noThreadsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 16,
  },
});

export default MessagesMain;
