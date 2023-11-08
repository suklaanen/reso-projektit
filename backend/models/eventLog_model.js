const db = require('../database');

const eventLog={
    getEventData: function(callback){
        return db.query("SELECT * FROM eventlog", callback);
    },
    getOneEvent: function(id, callback){
        return db.query("SELECT * FROM eventlog where id_event=?", [id], callback);
    },
    addEvent: function(newEvent){
        return db.query("INSERT INTO eventlog values(?,?,?,?,?,?)", 
        [newEvent.id_automat, newEvent.id_account, newEvent.id_card, 
            newEvent.event_type, newEvent.amount, newEvent.time], callback);
    },
    updateEvent: function(id, updateEvent, callback){
        return db.query("UPDATE eventlog set id_automat=?, id_account=?, id_card=?, event_type=?, amount=?, time=? WHERE id_event=?", 
        [updateEvent.id_automat, updateEvent.id_account, updateEvent.id_card,
            updateEvent.event_type, updateEvent.amount. updateEvent.time, id], callback);
    },
    deleteEvent: function(id, callback){
        return db.query("DELETE FROM eventlog WHERE id_event=?", [id], callback);
    }
};

module.exports=eventLog;