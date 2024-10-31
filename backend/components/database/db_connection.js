require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
console.log('Yhteysmerkkijono:', connectionString);

const pool = new Pool({connectionString});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Virhe tietokantayhteydessä', err);
    } else {
        console.log('Tietokantayhteys onnistui:', res.rows[0]);
    }
});

module.exports = pool;