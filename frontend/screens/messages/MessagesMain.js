import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Heading } from "../../components/CommonComponents";
import ThreadCard from "./ThreadCard";
import useThreads from "../../hooks/useThreads";

const ThreadList = ({ threads }) => {
  return (
    <ScrollView style={styles.scrollContainer}>
      {threads.length > 0 ? (
        threads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
      ) : (
        <Text style={styles.noThreadsText}>
          Aktiivisia keskusteluja ei löytynyt
        </Text>
      )}
    </ScrollView>
  );
};

const MessagesMain = () => {
  const { threads, loading, error } = useThreads((state) => ({
    threads: state.threads,
    loading: state.loading,
    error: state.error,
  }));

  return (
    <View style={styles.container}>
      <Heading title="Omat keskustelut" />
      <ThreadList threads={threads} />
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
