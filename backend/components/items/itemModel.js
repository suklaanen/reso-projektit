const pool = require('../database/db_connection');
require('dotenv').config();

const ItemsModel = {

    async getItems() {
        const query = `SELECT * FROM items;`;
        try {
            const { rows } = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Virhe tuotteita etsittäessä:', error);
            throw error; 
        }
    },

    async getItemById(itemId) {
        const query = `SELECT * FROM items WHERE id = $1;`;
        try {
            const { rows } = await pool.query(query, [itemId]);
            return rows[0];
        } catch (error) {
            console.error('Virhe tuotetta etsittäessä:', error);
            throw error; 
        }
    },

    async addItem (itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse) {
        const query = `
            INSERT INTO items (itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *;
        `;
        try {
            const { rows } = await pool.query(query, [itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse]);
            return rows[0];  
        } catch (error) {
            console.error('Virhe tuotetta lisättäessä:', error);
            throw error;  
        }
    },
    
    async deleteItem(itemId) {
        const query = `
            DELETE FROM items
            WHERE id = $1
            RETURNING *;
        `;
        try {
            const { rows } = await pool.query(query, [itemId]);
            return rows[0];
        } catch (error) {
            console.error('Virhe tuotetta poistaessa:', error);
            throw error; 
        }
    },

    async updateItem(itemId, itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse) {
        const query = `
            UPDATE items 
            SET itemname = $2, itemdescription = $3, itempicture = $4, postalcode = $5, city = $6, queuetruepickfalse = $7
            WHERE id = $1
            RETURNING *;
        `;
        try {
            const { rows } = await pool.query(query, [itemId, itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse]);
            return rows[0];
        } catch (error) {
            console.error('Virhe tuotetta päivitettäessä:', error);
            throw error; 
        }
    },
    
};

module.exports = ItemsModel;