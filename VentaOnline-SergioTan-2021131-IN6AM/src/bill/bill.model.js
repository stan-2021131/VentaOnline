'use strict'

const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    //nombreDeQuienEmiteLaFactura
    sender: [],
    //nombreDeQuienRecibeLaFactura
    receiver: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            cant: { type: Number, required: true },
            subTotal: {type: Number, required: false}
        }
    ],
    total:{
        type: String,
        required: false
    }
},
{
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);