const mysql = require("mysql2");
const connection = mysql.createPool( {
    host: '172.18.0.1',
    user: 'atm_user',
    password: 'pankkipass',
    database: 'bank_automat'
});
module.exports = connection;