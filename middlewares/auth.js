'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'Zionzoo2020#';
//funcion para validar el token que enviamos por cabecera
function ensureAuth(req, res, next) {
    //preguntamos si viene en la cabecera el token
    if (!req.headers.authorization) {
        //si no viene el token devolvemos un error en la peticion
        return res.status(403).send({ message: 'La peticion viene sin cabecera de autenticación' });

    } else {
        //si viene el token, lo guardamos en una variable y eliminamos cualquier comilla que pueda venir en el
        var token = req.headers.authorization.replace(/['"]+/g, '');
        //utilizamos try catch para ejecutar y capturar cualquier excepcion
        try {

            //decodificamos el token  en el payload, nos devolvera toda la data del usuario en un objeto json
            var payload = jwt.decode(token,secret);
            if(payload.exp <= moment().unix()){
                //si la clave no es valida por fecha, devolvemos error y el usuario tendra que reiniciar sesion

            return res.status(401).send({ message: 'El token ha expirado' });

            }

        } catch (ex) {

            //si hay algun error, lo capturamos y hacemos el log en consola 
            console.log(ex);
            return res.status(403).send({ message: 'El token nos es valido' });

        }
        //agregamos al request el usuario autentificado  y salimos del middleware

        req.user = payload;
        next();
    }

}

module.exports = {
    ensureAuth
}