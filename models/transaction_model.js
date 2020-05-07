'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TransactionSchema = Schema({
    establishment: String,
    date: Date,
    user_email: String,
    transaction: String,
    total_points:Number
});

module.exports = mongoose.model('Transaction', TransactionSchema);