'use strict'
var express = require('express');

var app = express();

//importar rutas
var userRoutes = require('./routes/user_routes');
var transactionRoutes = require('./routes/transaction_routes');


//Aqui van las rutas de la app

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras http

//rutas base

app.use('/api', userRoutes);
app.use('/api',transactionRoutes);


module.exports = app;
