'use strict'

var express = require('express');
var TransactionController = require('../controllers/transaction_controller');
var auth = require('../middlewares/auth');
var api = express.Router();

/**
 * EP /transaction sirve para registrar una transaccion desde el webhook de woocomerce,
 * más adelante se agregaran controladores para otras interfaces.
 * recibe:
 * 
    transaccion.establishment = headers['x-wc-webhook-source'];
    transaccion.date = body.date_created;
    transaccion.user_email = body.billing.email;
    transaccion.transaction = body.number;
    transaccion.total_points = body.total * 1000
 */
api.post('/transaction', TransactionController.saveWCtransaction);
/**
 * El EP /transactions sirve para jalar todas las transacciones que hay e la db
 * requiere estar autenticado, como user o admin 
 */
api.get('/transactions', auth.ensureAuth, TransactionController.getWCtransactions);
/**
 * El EP /transactions-delete/bulk permite borrar todas las transacciones de un usuario a traves de su email.
 * recibe por post el "email" del usuario. 
 * esta acción es irreversible.
 * requiere auth con token en headers.
 */
api.post('/transactions-delete/bulk', auth.ensureAuth, TransactionController.bulkDeleteTransactionsUser);
/**
 * El EP transaction/tid  sirve para eliminar una sola transaccion,
 * recibe por parametro el id de la transaccion a eliminar,
 * requiere estar auth con token en headers
 */
api.delete('/transaction/:tid', auth.ensureAuth, TransactionController.deleteUserTransaction);
/**
 * El EP /user-transactions  sirve para obtener todas las transacciones de un usuario con su email, recibe en la data (body) 
 * "email"
 */
api.get('/user-transactions', auth.ensureAuth, TransactionController.getUserTransactions);
module.exports = api;
