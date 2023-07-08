'use strict'

const cartController = require('./cart.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isClient} = require ('../services/authenticated');
//Funcion de Prueba
api.get('/test', cartController.test);

//Rutas de clientes
api.put('/addToCart',[ensureAuth, isClient],cartController.addToCart);
api.put('/substractProduct', [ensureAuth, isClient], cartController.substractCart)
api.get('/get', [ensureAuth, isClient],cartController.getCart);
module.exports = api;