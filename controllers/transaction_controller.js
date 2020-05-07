'use strict'
var Transaccion = require('../models/transaction_model');

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

    transaccion.save((err, transactionWCSaved) => {
        if (err) {
            throw err;
        } else {
            res.status(200).send({ transactionWCSaved });
        }
    })


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
                res.status(500).send({ message: 'No hay transacciones aun' })
            } else {
                res.status(200).send({
                    transacciones
                })
            }
        }
    })

}
module.exports = {
    saveWCtransaction,
    getWCtransactions
};