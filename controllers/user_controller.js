'use strict'
var User = require('../models/user_model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../middlewares/jwt');

function saveUser(req, res) {
    var isadmin = req.headers.isadmin;

    var user = new User();
    var params = req.body;
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    if (isadmin == 'true') {
        user.role = 'ADMIN';
    } else {
        console.log(isadmin);
        user.role = 'USER';
    }
    user.profile_pic = 'null';
    if (params.password) {
        //Ciframos el password y los guardamos
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                //si vienen los datos completos, guardamos el usuario
                User.findOne({ email: user.email }, (err, usuario) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al conectarse al servidor de inicio de sesión' });
                    } else {
                        if (!usuario) {
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
                            res.status(200).send({ message: 'Ya existe un usuario con el email : ' + user.email });
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

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    //utilizamos este metodo para buscar en la data un usuario con ese email
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error al conectarse al servidor de usuarios' });
        } else {
            if (!user) {
                res.status(404).send({ message: 'Este usuario no existe en la base de datos, verifica el correo electronico y vuelve a intentar.' });
            } else {
                //si existe el usuario, comparamos en base de datos el password cifrado, cifrando el dato que nos llega por params y comparando

                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        //si el hash es igual al password, devolvemos el login y  token 

                        res.status(200).send({ user: user, token: jwt.createToken(user), });

                    } else {
                        //si el password no hace match, devolvemos error al iniciar sesion
                        res.status(200).send({ message: 'Error al iniciar sesion, verifica tu contraseña' });
                    }

                });
            }
        }
    });

}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    var usuarioActual = req.user;
    var email_exist = false;

    if (update.email) {
        email_exist = true;
        User.findOne({ email: update.email }, (err, user) => {
            if (err) {
                res.status(500).send({ message: 'Error al buscar email en base de datos.' });
            } else {
                if (!user) {
                    //Preguntamos si alguna modificacion requiere permisos administrativos.

                    if (update.role || update.email) {


                        if (usuarioActual.role != 'ADMIN') {
                            res.status(500).send({ message: 'Esta acción solo puede ser realizada por un Administrador' });
                        } else {
                            //si viene password, hay que  hacer el hash
                            if (update.password != '') {
                                bcrypt.hash(update.password, null, null, function (err, hash) {
                                    if (err) {
                                        res.status(500).send({ message: 'Error al crear el hash de password ' });

                                    } else {

                                        update.password = hash;

                                        //metodos para actualizar usuario.
                                        User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                                            if (err) {

                                                res.status(500).send({ message: 'Error al actualizar Usuario', user: usuarioActual });
                                            } else {
                                                if (!userUpdated) {

                                                    res.status(404).send({ message: 'No se encontró usuario para actualizar', user: usuarioActual, userId: userId });
                                                } else {

                                                    res.status(200).send({ message: 'Usuario Actualizado correctamente.', user: usuarioActual, update: userUpdated });
                                                }
                                            }

                                        });

                                    }

                                });

                            } else {
                                //metodos para actualizar usuario.

                                User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                                    if (err) {

                                        res.status(500).send({ message: 'Error al actualizar Usuario', user: usuarioActual });
                                    } else {
                                        if (!userUpdated) {

                                            res.status(404).send({ message: 'No se encontró usuario para actualizar', user: usuarioActual, userId: userId });
                                        } else {

                                            res.status(200).send({ message: 'Usuario Actualizado correctamente.', user: usuarioActual, update: userUpdated });
                                        }
                                    }

                                });


                            }

                        }
                    } else {
                        //metodos para actualizar usuario.
                        //si viene password, hay que  hacer el hash

                        if (update.password) {
                            bcrypt.hash(update.password, null, null, function (err, hash) {
                                if (err) {
                                    res.status(500).send({ message: 'Error al crear el hash de password ' });

                                } else {
                                    update.password = hash;
                                    console.log(update.password);
                                    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                                        if (err) {

                                            res.status(500).send({ message: 'Error al actualizar Usuario', user: usuarioActual });
                                        } else {
                                            if (!userUpdated) {

                                                res.status(404).send({ message: 'No se encontró usuario para actualizar', user: usuarioActual, userId: userId });
                                            } else {

                                                res.status(200).send({ message: 'Usuario Actualizado correctamente.', update: userUpdated });
                                            }
                                        }

                                    });
                                }

                            });


                        } else {
                            User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                                if (err) {

                                    res.status(500).send({ message: 'Error al actualizar Usuario', user: usuarioActual });
                                } else {
                                    if (!userUpdated) {

                                        res.status(404).send({ message: 'No se encontró usuario para actualizar', userId: userId });
                                    } else {

                                        res.status(200).send({ message: 'Usuario Actualizado correctamente.', update: userUpdated });
                                    }
                                }

                            });
                        }




                    }
                } else {
                    email_exist = true;
                    res.status(500).send({ message: 'Ya existe un usuario registrado con ese correo.' });
                }
            }
        });

    } else {
        //Preguntamos si alguna modificacion requiere permisos administrativos.

        if (update.role || update.email) {


            if (usuarioActual.role != 'ADMIN') {
                res.status(500).send({ message: 'Esta acción solo puede ser realizada por un Administrador' });
            } else {
                //si viene password, hay que  hacer el hash
                if (update.password != '') {
                    bcrypt.hash(update.password, null, null, function (err, hash) {
                        if (err) {
                            res.status(500).send({ message: 'Error al crear el hash de password ' });

                        } else {

                            update.password = hash;

                            //metodos para actualizar usuario.
                            User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                                if (err) {

                                    res.status(500).send({ message: 'Error al actualizar Usuario', user: usuarioActual });
                                } else {
                                    if (!userUpdated) {

                                        res.status(404).send({ message: 'No se encontró usuario para actualizar', user: usuarioActual, userId: userId });
                                    } else {

                                        res.status(200).send({ message: 'Usuario Actualizado correctamente.', user: usuarioActual, update: userUpdated });
                                    }
                                }

                            });

                        }

                    });

                } else {
                    //metodos para actualizar usuario.

                    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                        if (err) {

                            res.status(500).send({ message: 'Error al actualizar Usuario', user: usuarioActual });
                        } else {
                            if (!userUpdated) {

                                res.status(404).send({ message: 'No se encontró usuario para actualizar', user: usuarioActual, userId: userId });
                            } else {

                                res.status(200).send({ message: 'Usuario Actualizado correctamente.', user: usuarioActual, update: userUpdated });
                            }
                        }

                    });


                }

            }
        } else {
            //metodos para actualizar usuario.
            //si viene password, hay que  hacer el hash

            if (update.password) {
                bcrypt.hash(update.password, null, null, function (err, hash) {
                    if (err) {
                        res.status(500).send({ message: 'Error al crear el hash de password ' });

                    } else {
                        update.password = hash;
                        console.log(update.password);
                        User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                            if (err) {

                                res.status(500).send({ message: 'Error al actualizar Usuario', user: usuarioActual });
                            } else {
                                if (!userUpdated) {

                                    res.status(404).send({ message: 'No se encontró usuario para actualizar', user: usuarioActual, userId: userId });
                                } else {

                                    res.status(200).send({ message: 'Usuario Actualizado correctamente.', update: userUpdated });
                                }
                            }

                        });
                    }

                });


            } else {
                User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
                    if (err) {

                        res.status(500).send({ message: 'Error al actualizar Usuario', user: usuarioActual });
                    } else {
                        if (!userUpdated) {

                            res.status(404).send({ message: 'No se encontró usuario para actualizar', userId: userId });
                        } else {

                            res.status(200).send({ message: 'Usuario Actualizado correctamente.', update: userUpdated });
                        }
                    }

                });
            }




        }

    }

}

module.exports = {
    saveUser, loginUser, updateUser
}