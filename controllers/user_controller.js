'use strict'
var User = require('../models/user_model');
var bcrypt = require('bcrypt-nodejs');

function saveUser(req, res) {
    var user = new User();
    var params = req.body;
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'USER';
    user.profile_pic = 'null';
    if (params.password) {
        //Ciframos el password y los guardamos
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                //si vienen los datos completos, guardamos el usuario
                user.save((err, userStored) => {
                    if (err) {

                        res.status(200).send({ message: 'Error al crear registro' });
                    } else {
                        if (!userStored) {

                            res.status(200).send({ message: 'No se creo el registro' });
                        } else {
                            res.status(200).send({ user: userStored });
                        }

                    }
                });
            } else {
                //si vienen incompletos damos un error 200 y el mensaje de error
                res.status(200).send({ message: 'Faltan datos por completar' });

            }
        });

    } else {
        //si no viene el password requerimos el password
        res.status(200).send({ message: 'Introduce la contraseña' });
    }

}

module.exports = {
    saveUser
}