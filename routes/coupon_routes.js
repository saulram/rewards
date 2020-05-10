'use strict'

var express = require('express');
var couponsController = require('../controllers/coupon_controller');
var auth = require('../middlewares/auth');
var api = express.Router();
/**
 * este endpoint recibe por post, el parametro "email" y devuelve todos los cupones dl 
 * usuario.
 */
api.post('/get-user-coupons',auth.ensureAuth, couponsController.getUserCoupons);

module.exports = api;