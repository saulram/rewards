'use strict'

var express = require('express');
var StablishmentController = require('../controllers/stablishment_controller');
var api = express.Router();
var auth = require('../middlewares/auth');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/stablishments' });

/*
El endpoint /register, sirve para crear un usuario nuevo, si queremos que tenga rol admin, debemos pasar una cabecera en la peticion llamada: isadmin con el valor true.
el endpoint register recibe en el body: "name","surname","email", "password"
*/
api.post('/save-establishment', [auth.ensureAuth, md_upload], StablishmentController.saveStablishment);
/**
 * El endpoint /upload-user-img/:id recibe por metodo post, en los archivos un fichero de imagen "image", en los parametros recibe un id
 * este id es el identificador del usuario en la base de datos.
 * guardará el fichero que será accesible solo a traves del API
 * Solo aceptamos extension; png,jpg,jpeg
 */

api.post('/upload-place-img/:id', [auth.ensureAuth, md_upload], StablishmentController.uploadEstablishmentImage);

/**
 * El endpoint /get-user-image recibe por parametros el nombre de la imagen, y devuelve en la respuesta un fichero de tipo png,jpg o jpeg
 */
api.get('/get-place-image/:image', StablishmentController.getEstablishmentImage);

api.get('/get-establishments', auth.ensureAuth, StablishmentController.getEstablishments);

api.post('/get-establishment', auth.ensureAuth, StablishmentController.getEstablishment);

api.delete('/delete-establishment', auth.ensureAuth, StablishmentController.deleteStablishment);

module.exports = api;