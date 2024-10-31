import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.101.132:8080/api';

export const LOGIN = `${BASE_URL}/auth/try/login`;
export const REGISTER = `${BASE_URL}/auth/try/register`;
export const RESET_PASSWORD = `${BASE_URL}/auth/try/forgot-password`;
export const DELETE_USER = `${BASE_URL}/auth/try/delete-user`;
export const USER = `${BASE_URL}/users`;
export const HEADERS = {'Content-Type': 'application/json'};

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

const getValidAccessToken = async () => {
    let accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (accessToken && !isTokenExpired(accessToken)) {
        return accessToken;
    }

    if (!refreshToken) {
        throw new Error('Refresh token missing or invalid. Please log in again.');
    }

    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` }
    });

    if (!response.ok) {
        throw new Error('Failed to refresh access token.');
    }

    const data = await response.json();
    accessToken = data.accessToken;

    await AsyncStorage.setItem('accessToken', accessToken);
    return accessToken;
};

const fetchWithAuthorization = async (url, options = {}) => {
    const token = await getValidAccessToken(); 
    const headers = HEADERS + { 
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorDetail = await response.json();
        console.error('Error fetching data:', errorDetail);
        throw new Error(`Network response was not ok: ${errorDetail.message}`);
    }

    return await response.json(); 
};

export const userLogin = async (username, password) => {
  try {
      console.log('Sending login request for:', username);

      if (!username || !password) {
          throw new Error('Käyttäjätunnus tai salasana ei voi olla tyhjät.');
      }
      
      const response = await fetch(LOGIN, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
          const errorResponse = await response.json();
          console.error('Login failed:', errorResponse.message);
          throw new Error(errorResponse.message || 'Kirjautuminen epäonnistui.');
      }
      
      const result = await response.json();
      console.log('API response:', result); 

      if (!result || typeof result.userid === 'undefined') { 
          throw new Error('Käyttäjätunnusta ei löytynyt API-vastauksesta.');
      }

      await AsyncStorage.setItem('userId', result.userid.toString());
      await AsyncStorage.setItem('accessToken', result.accessToken);
      await AsyncStorage.setItem('refreshToken', result.refreshToken);
      
      return result; 
  } catch (error) {
      console.error('Login error:', error);
      throw error; 
  }
};

export const fetchUserData = async () => {
  try {
    const userid = await AsyncStorage.getItem('userid'); 
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (userid && accessToken && refreshToken) {
        return { 
            userId: Number(userid),
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

export const userRegister = async (username, email, password) => {
    try {
        const response = await fetch(REGISTER, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ username, email, password }),
        });
        return await response.json();
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const userReset = async (email) => {
    try {
        const response = await fetch(RESET_PASSWORD, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ email }),
        });
        return await response.json();
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

export const userDelete = async () => {
    try {
        const userid = await AsyncStorage.getItem('userId');
        const accessToken = await AsyncStorage.getItem('accessToken');

        const response = await fetch(DELETE_USER, {
            method: 'DELETE',
            headers: {
                ...HEADERS,
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ userid }),
        });
        return await response.json();
    } catch (error) {
        console.error('Delete user error:', error);
        throw error;
    }
};