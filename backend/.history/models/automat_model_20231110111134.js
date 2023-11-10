const db = require("../database");

const automat = {
    getAllAutomats: function(callback) {
        return db.query("SELECT * FROM automat",callback);
    },
    getOneAutomat: function(id, callback) {
        return db.query("SELECT * FROM automat WHERE id_automat=?",[id],callback);
    },
    addAutomat: function(newData, callback) {
        return db.query("INSERT INTO automat(balance_10,balance_20,balance_50,balance_100,ma) VALUES(?,?,?,?,?,?)",
        [newData.account_nmbr,newData.bank_name,newData.account_type,newData.balance,newData.max_withdrawal_per_day,newData.credit_limit],
        callback);
    },
    updateAutomat: function(id, newData, callback) {
        return db.query("UPDATE account SET account_nmbr=?,bank_name=?,account_type=?,balance=?,max_withdrawal_per_day=?,credit_limit=? WHERE id_account=?",
        [newData.account_nmbr,newData.bank_name,newData.account_type,newData.balance,newData.max_withdrawal_per_day,newData.credit_limit,id],
        callback);
    },
    deleteAutomat: function(id, callback) {
        return db.query("DELETE FROM account WHERE id_account=?",[id],callback);
    }


};

module.exports = account;