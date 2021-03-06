const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const Coupon = require('../models/coupon_model');
// 
// 


function createCoupon(req, res) {

    var api;
    var coupon = Coupon();

    coupon.establishment = req.body.url

    var type = req.body.type;
    var cp_name = req.body.name;
    var email_restrictions = req.body.email;
    var amount = req.body.amount;
    /**
     * tipos de descuento:
     * fixed_cart,fixed_product,percent
     */


    switch (coupon.establishment) {
        /**
         * Configuracion para Woocommerce Aprendly
         */
        case 'https://aprendly.com': {
            api = new WooCommerceRestApi({
                url: coupon.establishment,
                consumerKey: "ck_90fa160e6a3d8dc31d3d1a1727491c868d0fc6a2",
                consumerSecret: "cs_70831f5c5a175337be67ae51661319eb94a926d6",
                version: "wc/v3"
            });
            api.post("coupons", {
                code: cp_name,
                discount_type: type,
                amount: amount,
                usage_limit: 1,
                individual_use: true,
                exclude_sale_items: true,
                minimum_amount: "100.00",
                "email_restrictions": [
                    email_restrictions
                ]
            })
                .then((response) => {
                    // Successful request
                    // console.log("Response Status:", response.status);
                    // console.log("Response Headers:", response.headers);
                    // console.log("Response Data:", response.data);


                    if (response.status == 201) {
                        coupon.date = response.data.date_created;
                        coupon.user_email = req.body.email;
                        coupon.code = response.data.code;
                        coupon.amount = response.data.amount;
                        coupon.min_amount = response.minimum_amount;
                        coupon.status = 0;
                        coupon.save((err, coupon) => {
                            if (err) {
                                res.status(500).send({ message: 'error al guardar cupon' });
                            } else {
                                if (coupon) {
                                    res.status(200).send(coupon);
                                } else {
                                    res.status(404).send({ message: 'No se creo el cupon' });
                                }
                            }
                        });


                    }
                })
                .catch((error) => {
                    // Invalid request, for 4xx and 5xx statuses
                    res.status(500).send({ message: 'Error al intentar crear el cupon' });
                })


        }
        case 'https://puntodeventa.disolutionsmx.com': {
            api = new WooCommerceRestApi({
                url: coupon.establishment,
                consumerKey: "ck_b6b96d7e16a2634a3bc3048df9e9d336090a3a11",
                consumerSecret: "cs_9aca64ed2b7a88f079bc19a736594a80b6e4f6e6",
                version: "wc/v3"
            });
            api.post("coupons", {
                code: cp_name,
                discount_type: type,
                amount: amount,
                usage_limit: 1,
                individual_use: true,
                exclude_sale_items: true,
                minimum_amount: "100.00",
                "email_restrictions": [
                    email_restrictions
                ]
            })
                .then((response) => {
                    // Successful request
                    // console.log("Response Status:", response.status);
                    // console.log("Response Headers:", response.headers);
                    // console.log("Response Data:", response.data);


                    if (response.status == 201) {
                        coupon.date = response.data.date_created;
                        coupon.user_email = req.body.email;
                        coupon.code = response.data.code;
                        coupon.amount = response.data.amount;
                        coupon.min_amount = response.minimum_amount;
                        coupon.status = 0;
                        coupon.save((err, coupon) => {
                            if (err) {
                                res.status(500).send({ message: 'error al guardar cupon' });
                            } else {
                                if (coupon) {
                                    res.status(200).send(coupon);
                                } else {
                                    res.status(404).send({ message: 'No se creo el cupon' });
                                }
                            }
                        });


                    }
                })
                .catch((error) => {
                    // Invalid request, for 4xx and 5xx statuses
                    res.status(500).send({ message: 'Error al intentar crear el cupon', error });
                })

        }

    }




}
module.exports = {
    createCoupon
}