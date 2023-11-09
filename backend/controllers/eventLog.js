const express = require("express");
const router = express.Router();
const eventLog = require('../models/eventLog_model');

router.get('/', function(request, response) {
    eventLog.getEventData(function(err, data){
        if(err){
            console.log(err);
            response.json("Error in database query");
        }
        else {
            response.send(data);
        }
    });
});

router.get('/:id', function(request, response) {
    eventLog.getOneEvent(request.params.id, function(err, data){
        if(err){
            console.log(err);
            response.json("Error in database query");
        }
        else {
            response.send(data);
        }
    });
});

router.post('/', function(request, response) {
    console.log(request.body);
    eventLog.addEvent(request.body, function(err, data){
        if(err){
            response.json(err);
        }
        else{
            response.send(data);
        }
    });
});

module.exports=router;

