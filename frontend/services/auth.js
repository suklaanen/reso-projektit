import { createContext } from 'react';

import { fetchUserDataFromStorage } from './asyncStorageHelper';
data = (async () => fetchUserDataFromStorage())();
export const AuthenticationContext = createContext([data, () => {}]);
//export const AuthenticationContext = createContext([null, () => {}]);