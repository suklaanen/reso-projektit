const db = require('../database');

const eventLog={
    getEventData: function(callback){
        return db.query("SELECT * FROM eventlog", callback);
    },
    getOneEvent: function(id, callback){
        return db.query("SELECT * FROM eventlog where id_event=?", [id], callback);
    },
    addEvent: function(newEvent, callback){
        return db.query("INSERT INTO eventlog values(?,?,?,?,?,?,?)", 
        [newEvent.id_event, newEvent.id_automat, newEvent.id_account, newEvent.id_card, 
            newEvent.event_type, newEvent.amount, newEvent.time], callback);
    }
};

module.exports=eventLog;