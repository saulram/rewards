'use strict'
var express = require('express');

var app = express();

//importar rutas
var userRoutes = require('./routes/user_routes');


//Aqui van las rutas de la app

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras http

//rutas base
app.get('/pruebas', function (req, res) {
    res.status(200).send({ message: 'Bienvenido al api' });
});
app.use('/api', userRoutes);


module.exports = app;
