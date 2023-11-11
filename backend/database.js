const mysql = require("mysql2");
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'atm_user',
  password: 'pankkipass',
  database: 'bank_automat'
});

module.exports = db;