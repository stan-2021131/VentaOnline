'use strict'

const Cart = require('./cart.model');
const User = require('../user/user.model');
const Product = require('../product/product.model');
const infoProduct = ['_id', 'name', 'description', 'price']

exports.test = (req,res)=>{
    res.send({message: 'Test function to cart is running'})
}

exports.createCart = async(username, res)=>{
    try{
        let userToCart = username;
        let user =await User.findOne({username: userToCart});
        if(user.role == 'ADMIN')return console.log('Admins can´t create a cart')
        let cartWithUser =await Cart.findOne({client: user._id});
        if(cartWithUser){
            return console.log('Cart Already Created');
        }
        let params = {
            client: user._id, 
            cart: []
        };
        let newCart = new Cart(params);
        await newCart.save();
        return console.log('Cart created');
    }catch(err){
        console.error(err);
    }
}

exports.addToCart = async(req,res)=>{
    try{
        let clientId = req.user.sub;
        let data = req.body;
        let productExist = await Product.findOne({_id: data.productId});
        if(!productExist)return res.status(404).send({message: 'Product not found'});
        let params = {
            product: data.productId,
            cant: data.cant,
            subTotal: data.cant*productExist.price 
        };        
        if(productExist.stock < data.cant)return res.send({message: 'Not enough in stock'});
        let porductInCart = await Cart.findOne({$and:[
            {
                client: clientId,
                'cart.product': data.productId
            }
        ]});
        if(porductInCart){
            let findCart = await Cart.findOne({$and:[
                {
                    client: clientId,
                    'cart.product': data.productId
                }
            ]});            
            for(let i=0; i<findCart.cart.length; i++){
                let newCant = parseInt(data.cant) + findCart.cart[i].cant;
                let newSub = newCant * productExist.price;
                if(newCant > productExist.stock)return res.send({message: 'Not enough in stock'});
                if(findCart.cart[i].product == data.productId){
                    let updatedCart = await Cart.findOneAndUpdate({'cart.product': data.productId}, {$set: {'cart.$.cant': parseInt(newCant), 'cart.$.subTotal': newSub}}, {new:true});
                    return res.send({message: updatedCart});
                }
            }
        }
        let updatedCart = await Cart.findOneAndUpdate({client: clientId}, {$push:{'cart': params}}, {new:true});
        return res.send({message: 'Updated cart',  updatedCart }); 
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error adding to cart'});
    }
} 

exports.getCart = async(req,res)=>{
    try{
        let carts = await Cart.find({client: req.user.sub}).populate('cart.product', infoProduct);
        return res.send({carts});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting carts'});
    }
}

exports.substractCart = async(req,res)=>{
    try{
        let clientId = req.user.sub;
        let data = req.body;
        let productExist = await Product.findOne({_id: data.productId});
        if(!productExist)return res.status(404).send({message: 'Product not found'});       
        let porductInCart = await Cart.findOne({$and:[
            {
                client: clientId,
                'cart.product': data.productId
            }
        ]});
        if(porductInCart){
            let findCart = await Cart.findOne({$and:[
                {
                    client: clientId,
                    'cart.product': data.productId
                }
            ]});            
            for(let i=0; i<findCart.cart.length; i++){
                let newCant =  findCart.cart[i].cant - parseInt(data.cant) ;
                let newSub = newCant * productExist.price;
                if(newCant <= 0){
                    console.log('hola')
                    if(findCart.cart[i].product == data.productId){
                        let updatedCart = await Cart.findOneAndUpdate({client: clientId}, {$pull:{'cart': {'product': data.productId}}}, {new:true});
                        return res.send({message: updatedCart});
                    }                    
                    return res.send({message: 'Product not found'});
                }
                if(findCart.cart[i].product == data.productId){
                    let updatedCart = await Cart.findOneAndUpdate({'cart.product': data.productId}, {$set: {'cart.$.cant': parseInt(newCant), 'cart.$.subTotal': newSub}}, {new:true});
                    return res.send({message: updatedCart});
                }
            }            
        }
        return res.status(404).send({message: 'This product is not in your cart'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting products from cart'})
    }
}
