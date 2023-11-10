const db = require("../database");

const automat = {
    getAllAccounts: function(callback) {
        return db.query("SELECT * FROM account",callback);
    },
    getOneAccount: function(id, callback) {
        return db.query("SELECT * FROM account WHERE id_account=?",[id],callback);
    },
    addAccount: function(newData, callback) {
        return db.query("INSERT INTO account(account_nmbr,bank_name,account_type,balance,max_withdrawal_per_day,credit_limit) VALUES(?,?,?,?,?,?)",
        [newData.account_nmbr,newData.bank_name,newData.account_type,newData.balance,newData.max_withdrawal_per_day,newData.credit_limit],
        callback);
    },
    updateAccount: function(id, newData, callback) {
        return db.query("UPDATE account SET account_nmbr=?,bank_name=?,account_type=?,balance=?,max_withdrawal_per_day=?,credit_limit=? WHERE id_account=?",
        [newData.account_nmbr,newData.bank_name,newData.account_type,newData.balance,newData.max_withdrawal_per_day,newData.credit_limit,id],
        callback);
    },
    deleteAccount: function(id, callback) {
        return db.query("DELETE FROM account WHERE id_account=?",[id],callback);
    }


};

module.exports = account;