'use strict'

const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
        unique: true
    },
    cart: 
        [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            cant: { type: Number, required: true },
            subTotal: {type: Number, required: false}
        }]
});

module.exports = mongoose.model('Cart', cartSchema);