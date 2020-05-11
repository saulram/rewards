'use strict'
var Transaccion = require('../models/transaction_model');
var Coupon = require('../models/coupon_model');

//controlador woocomcerce
function saveWCtransaction(req, res) {


    var transaccion = new Transaccion();
    var params = req.body;
    var headers = req.headers;

    transaccion.establishment = headers['x-wc-webhook-source'];
    transaccion.date = params.date_created;
    transaccion.user_email = params.billing.email;
    transaccion.transaction = params.number;
    transaccion.total_points = params.total * 1000
    if(params.coupon_lines[0] != null){
        var coupon_code =  params.coupon_lines[0].code;
    }
     

    if (params.status == 'completed') {


       if(coupon_code != null ){
        Coupon.findOneAndUpdate({ code: coupon_code }, { status: 1 }, (err, couponUpdated) => {
            console.log('entramos');
            if (err) {
               console.log(err);
            } else {
                
            }
        });
       }
        Transaccion.findOne({ transaction: transaccion.transaction, establishment: transaccion.establishment }, (err, recompensa) => {
            if (err) {
                res.status(500).send({ message: 'Error al verificar transacciones' });

            } else {
                if (recompensa) {

                    res.status(500).send({ message: 'Ya se ha registrado la transaccion', recompensa })

                } else {
                    transaccion.save((err, transactionWCSaved) => {
                        if (err) {
                            throw err;
                        } else {
                            res.status(200).send({ transactionWCSaved });
                        }
                    });
                }
            }
        });


    } else {
        res.status(200).send({ message: 'Esta orden no esta completa' });
    }


}
function getWCtransactions(req, res) {
    var find = Transaccion.find({}).sort('date');
    find.exec((err, transacciones) => {
        if (err) {
            res.status(500).send({
                message: 'error al obtener las transacciones'
            });
        } else {
            if (!transacciones) {
                res.status(500).send({ message: 'No hay transacciones aun' });
            } else {
                res.status(200).send({
                    transacciones
                });
            }
        }
    })

}

function deleteUserTransaction(req, res) {
    var utransactionId = req.params.tid;
    Transaccion.findByIdAndDelete(utransactionId, (err, tdeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error al borrar la transaccion' });
        } else {
            if (!tdeleted) {
                res.status(404).send({ message: 'Error al borrar la transaccione, no existe.' });

            } else {
                res.status(200).send({ message: 'Transaccion Borrada con éxito' });

            }
        }
    })
}

function bulkDeleteTransactionsUser(req, res) {
    var params = req.body;
    var email = params.email;

    Transaccion.deleteMany({ user_email: email }, (err, transaccionesBorradas) => {
        if (err) {
            res.status(500).send({ message: 'Error al borrar las transacciones' });

        } else {
            if (transaccionesBorradas) {
                res.status(200).send({ message: 'Borrado con exito', transaccionesBorradas });
            } else {
                res.status(404).send({ message: 'No hay registros con ese email' });
            }

        }
    });
}
function getUserTransactions(req, res) {
    var email = req.headers.email;
    Transaccion.find({ user_email: email }, (err, listaDeTransacciones) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener transacciones de usuario' });
        } else {
            if (!listaDeTransacciones) {
                res.status(404).send({ message: 'Este usuario, no tiene transacciones aún' });

            } else {
                res.status(200).send({
                    message: 'Se obtuvieron los siguientes resultados',
                    listaDeTransacciones
                })

            }
        }
    })
}
module.exports = {
    saveWCtransaction,
    getWCtransactions,
    bulkDeleteTransactionsUser,
    deleteUserTransaction,
    getUserTransactions
};