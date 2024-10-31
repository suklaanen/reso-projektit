import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken, userDelete } from './api'; 

export const fetchUserDataFromStorage = async () => {
    try {
        const userid = await AsyncStorage.getItem('userid');
        const username = await AsyncStorage.getItem('username');
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');


        console.log('userid:', userid);
        console.log('accessToken:', accessToken);
        console.log('refreshToken:', refreshToken);
        if (userid && accessToken && refreshToken) {
            return { 
                userId: Number(userid), 
                username,
                accessToken, 
                refreshToken 
            };
        }
        return null; 
    } catch (error) {
        console.error('Failed to retrieve user data from AsyncStorage:', error);
        throw error; 
    }
};

export const loadUserData = async (setUserData) => {
    try {
        const data = await fetchUserDataFromStorage();

        if (data) {
            let validAccessToken = data.accessToken;

            if (isTokenExpired(validAccessToken)) {
                console.log('Access-token vanhentunut, uusitaan se...');
                validAccessToken = await refreshAccessToken(data.refreshToken);

                await AsyncStorage.setItem('accessToken', validAccessToken);
            }

            setUserData({ userId: data.userId, accessToken: validAccessToken });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

export const saveUserData = async (data) => {
    try {
        console.log('Saving user data:', data);
        await AsyncStorage.setItem('userid', String(data.userId));
        await AsyncStorage.setItem('accessToken', data.accessToken);
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        await AsyncStorage.setItem('username', data.username);
    } catch (error) {
        console.error('Failed to write user authentication data:', error);
    }
};

const isTokenExpired = (token) => {
    try {
        const [, payload] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedPayload.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true; 
    }
};

export const clearUserData = async () => {
    try {
        await AsyncStorage.removeItem('userid');
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('username');
    } catch (error) {
        console.error('Failed to clear user data:', error);
    }
};