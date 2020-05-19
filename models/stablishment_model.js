'use strict'
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StablishmentModel = Schema({
    name: String, 
    description: String,
    categories: String,
    image:String,
    location:String,
    url:String
});

module.exports = mongoose.model('Stablishment', StablishmentModel);