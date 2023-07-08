'use strict'

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        required: false,
        default: '0'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Categorie',
        required: true
    }

});

module.exports = mongoose.model('Product', productSchema);