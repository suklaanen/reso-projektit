const express = require("express");
const router = express.Router();
const account = require('../models/account_model');

router.get('/', function(request, response) {
    account.getAllAccounts(function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});
router.post('/getID', function(request, response) {
    account.getAccountID(request.body.id_card, request.body.account_type, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            if(data.length > 0) {
                response.json(data[0].id_account);
            }
            else {
                response.json(false);
            }    
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
    account.getAccountInfoByCardID(request.body, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data[0]);
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