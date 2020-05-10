'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CouponSchema = Schema({
    establishment: String,
    date: Date,
    user_email: String,
    code: String,
    amount:Number,
    min_amount:Number
});

module.exports = mongoose.model('Coupon', CouponSchema);