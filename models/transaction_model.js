'use strict'
var mongoose = require('mongoose');
var Stablishment = require('./stablishment_model');

var Schema = mongoose.Schema;

var TransactionSchema = Schema({
    establishment: String,
    date: Date,
    user_email: String,
    transaction: String,
    total_points: Number
}, { toJSON: { virtuals: true } });


TransactionSchema.virtual('stablishments', {
    ref: Stablishment,
    localField: 'establishment',
    foreignField: 'url',
    justOne: true,
});

module.exports = mongoose.model('Transaction', TransactionSchema);