'use strict'

require('dotenv').config();
const { defaultCategory } = require('./src/category/category.controller');
const mongoConfig = require('./configs/mongo');
const app = require('./configs/app');

mongoConfig.connect();
app.initServer();
defaultCategory();