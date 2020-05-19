'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Stablishment = require('./stablishment_model');

var CouponSchema = Schema({
    establishment: String,
    date: Date,
    user_email: String,
    code: String,
    amount:Number,
    min_amount:Number,
    status:Number
}, { toJSON: { virtuals: true } }); 

CouponSchema.virtual('stablishments', {
    ref: Stablishment,
    localField: 'establishment',
    foreignField: 'url',
    justOne: true,
});

module.exports = mongoose.model('Coupon', CouponSchema);