'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port= process.env.port || 3977;

mongoose.connect('mongodb://localhost:27017/rewards',(err,res)=>{
    if(err){
        throw err;

    }else{
        console.log('La base de datos esta corriendo correctamente....')

        app.listen(port,function (){
            console.log("Servidor iniciado en : http://localhost:"+port);
        });
    }
})