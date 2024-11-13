import React, { createContext, useState, useEffect } from 'react';
import { fetchUserDataFromStorage } from './asyncStorageHelper';

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
    const [authState, setAuthState] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            const userData = await fetchUserDataFromStorage();
            setAuthState(userData); 
            setLoading(false); 
        };
        loadUserData();
    }, []);

    return (
        <AuthenticationContext.Provider value={{ authState, setAuthState }}>
            {!loading ? children : null}
        </AuthenticationContext.Provider>
    );
};
