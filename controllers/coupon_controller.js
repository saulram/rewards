'use strict'
var Coupon = require('../models/coupon_model');

function getUserCoupons(req, res) {
    var user_email = req.body.email;

    Coupon.find({ user_email: user_email }, (err, coupons) => {
        if (err) {
            res.status(500).send({ message: 'Hubo un error al crear los cupones' });
        } else {
            if (!coupons) {

                res.status(404).send({ message: 'No hay cupones para este usuario' });
            } else {

                res.status(200).send(coupons);
            }
        }
    });
}

module.exports = {
    getUserCoupons,
}