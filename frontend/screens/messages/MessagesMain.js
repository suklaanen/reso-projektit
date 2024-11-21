import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Heading } from "../../components/CommonComponents";
import ThreadCard from "./ThreadCard";
import { useThreads } from "../../context/ThreadsContext";
import Toast from "react-native-toast-message";

const MessagesMain = () => {
  const threads = useThreads();

  useEffect(() => {
    if (threads.length > 0) {
      Toast.show({
        type: "info",
        text1: "Uusi viesti",
        text2: "Sait viestin yhteen keskusteluun",
      });
    }
  }, [threads]);

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
