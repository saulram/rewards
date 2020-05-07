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
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
    next();
    
});
//rutas base

app.use('/api', userRoutes);
app.use('/api',transactionRoutes);


module.exports = app;
