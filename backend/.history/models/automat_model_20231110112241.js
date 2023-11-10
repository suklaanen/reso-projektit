const db = require("../database");

const automat = {
    getAllAutomats: function(callback) {
        return db.query("SELECT * FROM automat",callback);
    },
    getOneAutomat: function(id, callback) {
        return db.query("SELECT * FROM automat WHERE id_automat=?",[id],callback);
    },
    addAutomat: function(newData, callback) {
        return db.query("INSERT INTO automat(balance_10,balance_20,balance_50,balance_100,max_withdrawal) VALUES(?,?,?,?,?)",
        [newData.balance_10,newData.balance_20,newData.balance_50,newData.balance_100,newData.max_withdrawal],
        callback);
    },
    updateAutomat: function(id, newData, callback) {
        return db.query("UPDATE automat SET balance_10=?,balance_20=?,balance_50=?,balance_100=?,max_withdrawal=? WHERE id_automat=?",
        [newData.balance_10,newData.balance_20,newData.balance_50,newData.balance_100,newData.max_withdrawal],
        callback);
    },
    deleteAutomat: function(id, callback) {
        return db.query("DELETE FROM automat WHERE id_automat=?",[id],callback);
    }


};

module.exports = automat;