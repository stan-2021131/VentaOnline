'use strict'

const billController = require('./bill.controller');
const express = require('express');
const api = express.Router();
const {ensureAuth, isAdmin, isClient} = require('../services/authenticated');
//Ruta de Prueba
api.get('/test', billController.test);

//Rutas de CLientes
api.post('/buy', [ensureAuth, isClient],billController.buy);

//Rutas de Administrador
api.get('/getBills', [ensureAuth, isAdmin], billController.viewBills);
api.get('/getBillsByUser', [ensureAuth, isAdmin], billController.getBillsByUser);
api.put('/updateBill', [ensureAuth, isAdmin], billController.updateBill)

module.exports = api;