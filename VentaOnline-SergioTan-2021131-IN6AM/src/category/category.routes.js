'use strict'

const express = require('express');
const api = express.Router();
const categoryController = require('./category.controller');
const {ensureAuth, isAdmin } = require('../services/authenticated')

//Rutas de prueba
api.get('/test', categoryController.test);

//Rutas de Administrador
api.post('/add', [ensureAuth, isAdmin],categoryController.add);
api.put('/update/:id',[ensureAuth, isAdmin], categoryController.update);
api.delete('/delete/:id', [ensureAuth, isAdmin],categoryController.deleteCategory);

//Rutas publicas
api.get('/get', ensureAuth ,categoryController.get);
module.exports = api;