import React, { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../services/firebaseConfig";
import { getUserData } from "../services/firestoreUsers";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("User in AuthenticationProvider: ", user);

      if (user) {
        const data = await getUserData(user.uid);
        console.log("Data from getUserData: ", data);

        setAuthState({
          user: {
            id: user.uid,
            ...data,
          },
          auth: auth.currentUser,
        });
      } else {
        setAuthState(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthenticationContext.Provider value={authState}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuth = () => useContext(AuthenticationContext);
