const pool = require('../database/db_connection');
require('dotenv').config();
const nodemailer = require('nodemailer');

const AuthModel = {
    
    async getUserById(userId) {
        const query = `
            SELECT * FROM users
            WHERE userid = $1;
        `;
        try {
            const { rows } = await pool.query(query, [userId]);
            return rows[0];
        } catch (error) {
            console.error('Virhe haettaessa käyttäjää ID:n perusteella:', error);
            throw error; 
        }
    },

    async getUserByUsername(username) {
        const query = `
            SELECT * FROM users
            WHERE username = $1;
        `;
        try {
            const { rows } = await pool.query(query, [username]);
            return rows[0];
        } catch (error) {
            console.error('Virhe haettaessa käyttäjää usernamen perusteella:', error);
            throw error; 
        }
    },

    async getUserByEmail(email) {
        const query = `
            SELECT * FROM users
            WHERE usermail = $1;
        `;
        try {
            const { rows } = await pool.query(query, [email]);
            return rows[0];
        } catch (error) {
            console.error('Virhe haettaessa käyttäjää sähköpostin perusteella:', error);
            throw error; 
        }
    },

    async createUser(username, email, password) {
        const query = `
            INSERT INTO users (username, usermail, hashedpassword) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        try {
            const { rows } = await pool.query(query, [username, email, password]);
            return rows[0];
        } catch (error) {
            console.error('Virhe käyttäjää luotaessa:', error);
            throw error; 
        }
    },

    async updatePassword(userid, newPassword) {
        const query = `
            UPDATE users
            SET hashedpassword = $1
            WHERE userid = $2
            RETURNING *;
        `;
        try {
            const { rows } = await pool.query(query, [newPassword, userid]);
            return rows[0];
        } catch (error) {
            console.error('Virhe käyttäjän salasanaa päivittäessä:', error);
            throw error; 
        }
    },

    async sendEmail(email, newPassword) {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Uusi salasana',
            text: `Uusi salasanasi on: ${newPassword}`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Sähköposti lähetetty: ' + info.response);
        } catch (error) {
            console.error('Virhe sähköpostin lähetyksessä:', error);
        }
    },

    async deleteUser(userId) {
        const query = `
            DELETE FROM users
            WHERE userid = $1
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