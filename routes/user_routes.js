'use strict'

var express = require('express');
var UserController = require('../controllers/user_controller');
var api = express.Router();

api.post('/register',UserController.saveUser);

module.exports = api;