import React, { createContext, useState, useEffect, useContext } from "react";
import {
  doc,
  onSnapshot,
  query,
  where,
  collection,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";
import { AuthenticationContext, useAuth } from "./AuthenticationContext";

const ThreadsContext = createContext();

export const ThreadsProvider = ({ children }) => {
  const [threads, setThreads] = useState([]);
  const authState = useAuth();

  const fetchLatestMessage = async (threadId) => {
    const messagesRef = collection(firestore, "threads", threadId, "messages");
    const messageQuery = query(
      messagesRef,
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const messageSnapshot = await getDocs(messageQuery);

    if (!messageSnapshot.empty) {
      return messageSnapshot.docs[0].data();
    }
    return null;
  };

  const fetchThreadData = async (docSnap) => {
    const thread = docSnap.data();
    const threadId = docSnap.id;
    const latestMessage = await fetchLatestMessage(threadId);

    return {
      ...thread,
      id: threadId,
      latestMessage,
    };
  };

  useEffect(() => {
    if (authState) {
      const { user } = authState;
      const threadsRef = collection(firestore, "threads");
      const userRef = doc(firestore, "users", user?.uid);
      const q = query(
        threadsRef,
        where("participants", "array-contains", userRef)
      );
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const threadsData = await Promise.all(
          snapshot.docs.map(fetchThreadData)
        );
        const sortedThreads = threadsData.sort((a, b) => {
          if (!a.latestMessage || !b.latestMessage) return 0;
          return (
            b.latestMessage.createdAt.seconds -
            a.latestMessage.createdAt.seconds
          );
        });
        setThreads(sortedThreads);
      });
      return unsubscribe;
    }
  }, [authState]);

  return (
    <ThreadsContext.Provider value={threads}>
      {children}
    </ThreadsContext.Provider>
  );
};

export const useThreads = () => useContext(ThreadsContext);
