const express = require("express");
const router = express.Router();
const eventLog = require('../models/eventLog_model');

router.post('/', function(request, response) {
    eventLog.getEventsByAccountId(request.body.id_account,request.body.offset, function(err, data){
        if(err){
            console.log(err);
            response.status(400);
            response.json("Error in database query");
        }
        else {
            response.json(data);
        }
    });
});

module.exports=router;

