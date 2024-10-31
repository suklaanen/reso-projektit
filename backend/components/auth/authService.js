const AuthModel = require('./authModel');
const bcrypt = require('bcryptjs');
const { createAccessToken, createRefreshToken } = require('../middleware/auth');

class AuthService {

    static async getUserById(userId) {
        return AuthModel.getUserById(userId); 
    }

    static async getUserByUsername(username) {
        return AuthModel.getUserByUsername(username);
    }

    static async getUserByEmail(email) {
        return AuthModel.getUserByEmail(email);
    }

    static async createUser(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return AuthModel.createUser(username, email, hashedPassword);
    }

    static async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return AuthModel.updatePassword(userId, hashedPassword);
    }

    static async forgotPassword(email) {
        try {
            const user = await AuthModel.getUserByEmail(email);
            if (!user) {
                return { success: false, message: 'Sähköpostia ei löydy' };
            }
            const newPassword = Math.random().toString(36).substring(2, 15);
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await AuthModel.updatePassword(user.userid, hashedPassword);
            await AuthModel.sendEmail(email, newPassword);

            return { success: true, message: 'Salasanan vaihto onnistui', newPassword };
        } catch (error) {
            console.error('Virhe salasanan vaihdossa:', error);
            return { success: false, message: 'Salasanan vaihto epäonnistui', error };
        }
    }

    static async registerUser(username, password, email) {
        try {
            const existingUser = await AuthModel.getUserByUsername(username);
            if (existingUser) {
                return { success: false, message: 'Käyttäjätunnus varattu' };
            }
            if (password.length < 4) {
                return { success: false, message: 'Salasanan tulee olla vähintään 4 merkkiä pitkä' };
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await AuthModel.createUser(username, email, hashedPassword);

            return { success: true, message: 'Rekisteröinti onnistui' };
        } catch (error) {
            console.error('Virhe rekisteröinnissä:', error);
            return { success: false, message: 'Rekisteröinti epäonnistui', error };
        }
    }

    static async loginUser(username, password) {
        try {
            const user = await AuthModel.getUserByUsername(username);
            if (!user) {
                return { success: false, message: 'Käyttäjätunnusta ei löydy' };
            }

            const passwordMatch = await bcrypt.compare(password, user.hashedpassword);
            if (!passwordMatch) {
                return { success: false, message: 'Kirjautuminen epäonnistui' };
            }

            const accessToken = createAccessToken(user);
            const refreshToken = createRefreshToken(user);
            return { 
                success: true, 
                message: 'Kirjautuminen onnistui', 
                accessToken, 
                refreshToken, 
                userid: user.userid,
                username: user.username
            };
        } catch (error) {
            console.error('Virhe kirjautumisessa:', error);
            return { success: false, message: 'Kirjautumisvirhe', error };
        }
    }
    
    static async logoutUser(userId) {
        try {
            await AuthModel.deleteRefreshToken(userId);
            return { success: true, message: 'Uloskirjautuminen onnistui' };
        } catch (error) {
            console.error('Virhe uloskirjautumisessa:', error);
            return { success: false, message: 'Uloskirjautuminen epäonnistui', error };
        }
    }

    static async deleteUser(userId) {
        try {
            await AuthModel.deleteUser(userId);
            return { success: true, message: 'Käyttäjän poisto onnistui' };
        } catch (error) {
            console.error('Virhe käyttäjän poistossa:', error);
            return { success: false, message: 'Käyttäjän poisto epäonnistui', error };
        }
    }
}

module.exports = AuthService;
