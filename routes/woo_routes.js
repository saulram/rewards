'use strict'

var express = require('express');
var wooController = require('../controllers/woo_controller');
var auth = require('../middlewares/auth');
var api = express.Router();

/**
 * Este endpoint permite crear un cupon para el usuario.
 * recibe por post los datos: url , type , name , email , amount
 * al finalizar crearemos un registro del cupon en nuestra base de datos.
 */
api.post('/create-coupon',auth.ensureAuth, wooController.createCoupon);

module.exports = api;