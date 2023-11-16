const express = require("express");
const router = express.Router();
const card = require('../models/card_model');

router.get('/:id', function(request, response) {
    card.checkAttempts(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data[0].attempts);
        }
    });
});

router.put('/:id', function(request, response) {
    card.addAttempt(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(true);
        }
    });
});

module.exports = router;