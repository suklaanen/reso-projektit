const pool = require('../database/db_connection');
const { get } = require('./authRoutes');
require('dotenv').config();

const AuthModel = {

    async getUserById(userbyid) {
        const query = `SELECT * FROM users WHERE userid = $1;`;
        try {
            const { rows } = await pool.query(query, [userbyid]);
            return rows[0];
        } catch (error) {
            console.error('Virhe käyttäjää etsittäessä:', error);
            throw error; 
        }
    },

    async setUsername(userid, username) {
        const query = `UPDATE users SET username = $2 WHERE firebaseuserid = $1;`;
        try {
            await pool.query(query, [userid, username]);
        }
        catch (error) {
            console.error('Virhe nimimerkin asettamisessa:', error);
            throw error; 
        }
    },

    async getUserByEmail(email) {
        const query = `SELECT * FROM users WHERE usermail = $1;`;
        try {
            const { rows } = await pool.query(query, [email]);
            return rows[0];
        } catch (error) {
            console.error('Virhe käyttäjää etsittäessä:', error);
            throw error; 
        }
    },

    async createUser(uid, email) {
        const query = `
            INSERT INTO users (firebaseuserid, usermail) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        try {
            const { rows } = await pool.query(query, [uid, email]);
            return rows[0]; 
        } catch (error) {
            console.error('Virhe käyttäjää luotaessa:', error);
            throw error; 
        }
    },

    async deleteUser(userId) {
        const query = `
            DELETE FROM users
            WHERE firebaseuserid = $1
            RETURNING *;
        `;
        try {
            const { rows } = await pool.query(query, [userId]);
            return rows[0];
        } catch (error) {
            console.error('Virhe käyttäjää poistaessa:', error);
            throw error; 
        }
    }
};

module.exports = AuthModel;