'use strict'

var express = require('express');
var UserController = require('../controllers/user_controller');
var api = express.Router();
var auth = require('../middlewares/auth');

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id',auth.ensureAuth,UserController.updateUser);

module.exports = api;