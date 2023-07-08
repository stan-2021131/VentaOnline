'use strict'

const productController = require('./product.controller');
const express = require('express');
const api = express.Router();
const {ensureAuth, isAdmin} = require('../services/authenticated')

//Funcion de Prueba
api.get('/test', productController.test);

//Rutas de Administrador
api.post('/add', [ensureAuth, isAdmin],productController.add);
api.get('/soldOut', [ensureAuth, isAdmin], productController.getProductsSoldOut);
api.put('/update/:id', [ensureAuth, isAdmin], productController.updateProduct);
api.delete('/delete/:id',[ensureAuth,isAdmin],productController.delete);
api.put('/addStock/:id', [ensureAuth, isAdmin], productController.addStock);
api.put('/updateStock/:id', [ensureAuth, isAdmin], productController.updateStock);


//Rutas publicas
api.get('/get', productController.getProducts);
api.get('/get/:id', productController.getProduct);
api.get('/mostSelled', productController.getMostSelledProducts);
api.get('/search', productController.searchProducts);

module.exports = api;