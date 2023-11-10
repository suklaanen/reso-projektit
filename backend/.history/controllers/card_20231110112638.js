const express = require("express");
const router = express.Router();
const card = require('../models/card_model');

router.get('/', function(request, response) {
    card.getAllCards(function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.get('/:id', function(request, response) {
    card.getOneCard(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response,json(dbResult[0].type)
        }
    });
});

router.post('/', function(request, response) {
    account.addAccount(request.body, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.put('/:id', function(request, response) {
    account.updateAccount(request.params.id, request.body, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.delete('/:id', function(request, response) {
    account.deleteAccount(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

module.exports = router;