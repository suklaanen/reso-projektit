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
    automat.getOneCard(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response,json(dbResult[0].type)
        }
    });
});

router.post('/', function(request, response) {
    automat.addAutomat(request.body, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.put('/:id', function(request, response) {
    automat.updateAutomat(request.params.id, request.body, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.delete('/:id', function(request, response) {
    automat.deleteAutomat(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

module.exports = router;