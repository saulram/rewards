'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'Zionzoo2020#';

//Crear metodo para generar un token jwt


function createToken (user){
var payload = {
    sub:user._id,
    name:user.name,
    surname:user.surname,
    email:user.email,
    role:user.role,
    profile_pic:user.image,
    iat:moment().unix(),
    exp:moment().add(30,'days').unix,
}
//Generamos el token JWT , CIFRAMOS EL PAYLOAD Y SELECCIONAMOS LA CLAVE
return jwt.encode(payload,secret);
}

module.exports = {
    createToken
}