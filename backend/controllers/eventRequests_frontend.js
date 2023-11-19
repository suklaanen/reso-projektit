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
            eventLog.getEventsCountByAccountId(request.body.id_account,function(err, count){
                if(err){
                    console.log(err);
                    response.status(400);
                    response.json("Error in database query");
                }
                else { 
                    console.log(count [0].countEvents);
                    response.header("X-Transactions-Count", count [0].countEvents);
                    response.json(data);
                }
            });
        }
    });
});

module.exports=router;

