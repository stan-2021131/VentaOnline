'use strict'
const express = require('express')

//Logs de las solicitudes que reciba el servidor
const morgan = require('morgan');
//Seguridad basica al servidor
const helmet = require('helmet');
//Aceptacion de solicitudes desde otro origen o desde la misma maquina
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3200;
const categoryRoutes = require('../src/category/category.routes');
const userRoutes = require('../src/user/user.routes');
const productRoutes = require('../src/product/product.routes');
const cartRoutes = require('../src/cart/cart.routes');
const billRoutes = require('../src/bill/bill.routes');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
morgan('tiny');
app.use(morgan('dev')); 


app.use('/category', categoryRoutes);
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/bill', billRoutes);

exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server is running in port ${port}`);
}
