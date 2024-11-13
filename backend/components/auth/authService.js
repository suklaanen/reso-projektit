const AuthModel = require('./authModel');

class AuthService {

    static async getUserById(userbyid) {

        try {
            return await AuthModel.getUserById(userbyid);
        }
        catch (error) {
            console.error('Virhe käyttäjää etsittäessä:', error);
            throw error;
        }
    }
    

    static async setUsername(userid, username) { 
        try {
            await AuthModel.setUsername(userid, username);
            return { success: true, message: 'Nimimerkki asetettu' };
        } catch (error) {
            console.error('Virhe luodessa nimimerkkiä:', error);
            return { success: false, message: 'Käyttäjän nimimerkin asetus epäonnistui', error };
        }
    }

    static async registerUser(userid, email) {
        try {
            const existingUser = await AuthModel.getUserByEmail(email);
            if (existingUser) {
                return { success: false, message: 'Sähköpostiosoite varattu' };
            }
            await AuthModel.createUser(userid, email);

            return { success: true, message: 'Rekisteröinti onnistui' };
        } catch (error) {
            console.error('Virhe rekisteröinnissä:', error);
            return { success: false, message: 'Rekisteröinti epäonnistui', error };
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