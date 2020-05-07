'use strict'

var express = require('express');
var TransactionController = require('../controllers/transaction_controller');
var api = express.Router();

api.post('/transaction',TransactionController.saveWCtransaction);
api.get('/transactions',TransactionController.getWCtransactions);

module.exports = api;