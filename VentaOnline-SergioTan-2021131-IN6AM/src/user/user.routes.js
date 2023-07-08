'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin} = require ('../services/authenticated');

//Función de prueba
api.get('/test', userController.test);
//Funciones publicas
api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/update/:id',ensureAuth,userController.update);
api.put('/updatePassword/:id',ensureAuth,userController.updatePassword);
api.delete('/delete/:id',ensureAuth,userController.deleteUser);
//Funciones del Administrador
api.put('/updateRole',ensureAuth,userController.updateRole);
module.exports = api;