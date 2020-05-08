'use strict'

var express = require('express');
var UserController = require('../controllers/user_controller');
var api = express.Router();
var auth = require('../middlewares/auth');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/img/users'});

/*
El endpoint /register, sirve para crear un usuario nuevo, si queremos que tenga rol admin, debemos pasar una cabecera en la peticion llamada: isadmin con el valor true.
el endpoint register recibe en el body: "name","surname","email", "password"
*/
api.post('/register', UserController.saveUser);
/*
El EP /login sirve para iniciar sesion y devuelve un objeto con los datos de usuario y el token para las peticiones, recibe "email" y "password"
*/ 
api.post('/login', UserController.loginUser);
/**
 * El metodo /update-user recibe por parametro el id del usuario, y en el body cualquier modificacion al model del usuario, los campos disponibles son:
 * "name","surname","profile_pic","role","password","email".
 * Los campos, email y role, solo podran ser modificados mediante un token de administrador.
 */
api.put('/update-user/:id',auth.ensureAuth,UserController.updateUser);
/**
 * El metodo /delete-user  recibe por parametro el id de usuario, borrara el usuario seleccionado.
 */
api.delete('/delete-user/:id',auth.ensureAuth,UserController.deleteUser);
/**
 * El endpoint /users entrega un arreglo de objetos de tipo usuario, mostrando todos los usuarios de la db
 */
api.get('/users',auth.ensureAuth,UserController.getUsers);
/**
 * el endpoint /user  entrega un usuario especifico mediante los params de la url.
 */
api.get('/user/:id',auth.ensureAuth,UserController.getOneUser);

/**
 * El endpoint /upload-user-img/:id recibe por metodo post, en los archivos un fichero de imagen "image", en los parametros recibe un id
 * este id es el identificador del usuario en la base de datos.
 * guardará el fichero que será accesible solo a traves del API
 * Solo aceptamos extension; png,jpg,jpeg
 */

api.post('/upload-user-img/:id',[auth.ensureAuth,md_upload],UserController.uploadImage);

/**
 * El endpoint /get-user-image recibe por parametros el nombre de la imagen, y devuelve en la respuesta un fichero de tipo png,jpg o jpeg
 */
api.get('/get-user-image/:profile_pic',UserController.getUserImage);

module.exports = api;