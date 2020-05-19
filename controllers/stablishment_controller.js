'use strict'
var Stablishment = require('../models/stablishment_model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../middlewares/jwt');
var fs = require('fs');
var path = require('path');

function saveStablishment(req, res) {


    var stablishment = new Stablishment();
    var params = req.body;
    stablishment.name = params.name;
    stablishment.description = params.description;
    stablishment.categories = params.categories;

    stablishment.location = params.location;
    stablishment.url = params.url;

    var file_name = 'No Subido...';
    if (req.files) {

        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        console.log(ext_split);
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
            stablishment.image = file_name;

            stablishment.save((err, stablishment) => {
                if (err) {
                    res.status(500).send({ message: 'No se pudo conectar al servidor de establecimientos' });
                } else {
                    if (!stablishment) {

                        res.status(404).send({ message: 'No se pudo agregar establecimiento' });

                    } else {
                        res.status(200).send({ stablishment });

                    }
                }
            });


        } else {
            res.status(500).send({ message: 'No puedes subir ficheros que no sean png / jpg / jpeg' })
        }

    } else {
        res.status(200).send({ message: 'No subiste imagen' });
    }



}

function getEstablishments(req, res) {

    Stablishment.find((err, stablishments) => {
        if (err) {
            res.status(500).send({ message: 'Error al conectar a la base de datos' });

        } else {
            if (!stablishments) {
                res.status(404).send({ message: 'Aún no hay establecimientos' });

            } else {
                res.status(200).send(stablishments);
            }
        }
    })

}
function getEstablishment(req, res) {
    var _url = req.body.url;
    console.log(_url);

    Stablishment.findOne({ url: _url }, (err, establishment) => {
        if (err) {
            res.status(500).send({ message: 'Error al conectar a la base de datos' });

        } else {
            if (!establishment) {
                res.status(404).send({ message: 'Aún no hay establecimientos' });

            } else {
                res.status(200).send(establishment);
            }
        }
    })

}

function uploadEstablishmentImage(req, res) {
    var stablishmentId = req.params.id;
    var file_name = 'No Subido...';
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {
            Stablishment.findByIdAndUpdate(stablishmentId, { image: file_name }, (err, establishmentUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'No se pudo conectar al servidor de archivos' });
                } else {
                    if (!establishmentUpdated) {

                        res.status(404).send({ message: 'No se encontro el establecimiento en la base de datos' });

                    } else {
                        res.status(200).send({ message: 'Imagen actualizada', establishmentUpdated });

                    }
                }
            });


        } else {
            res.status(500).send({ message: 'No puedes subir ficheros que no sean png / jpg / jpeg' })
        }

    } else {
        res.status(200).send({ message: 'No subiste imagen' });
    }
}

function getEstablishmentImage(req, res) {
    var imageFile = './uploads/stablishments/' + req.params.image;
    fs.exists(imageFile, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(imageFile));
        } else {
            res.status(404).send({ message: 'No existe la imagen' });
        }

    });


}

function deleteStablishment ( req,res){
    var establishmentId = req.params.id;

    Stablishment.findByIdAndDelete(establishmentId, (err, establishmentDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error al conectar al servidor web para borrar usuario' });

        } else {
            if (!establishmentDeleted) {
                res.status(404).send({ message: 'No se encontro usuario a borrar, verificar id' });
            } else {
                res.status(200).send({ message: 'Usuario borrado con exito', establishment: establishmentDeleted });
            }
        }
    });
}


module.exports = {
    saveStablishment,
    uploadEstablishmentImage,
    getEstablishmentImage,
    getEstablishments,
    getEstablishment,
    deleteStablishment
}