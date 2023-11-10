const express = require("express");
const router = express.Router();
const account = require('../models/automat_model');

router.get('/', function(request, response) {
    automat.getAllAutomats(function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.get('/:id', function(request, response) {
    account.getOneAccount(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
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