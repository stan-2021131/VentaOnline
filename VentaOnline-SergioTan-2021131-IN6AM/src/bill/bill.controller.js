'use strict'

const Bill = require('./bill.model');
const Cart = require('../cart/cart.model');
const User = require('../user/user.model');
const Product = require('../product/product.model');
const infoProduct = ['_id', 'name', 'description', 'price']
const infoUser = ['_id', 'name', 'surname', 'email', 'username', 'phone'];

exports.test= (req,res)=>{
    res.send({message: 'Test function to Bills is running'});
} 

exports.buy = async(req, res)=>{
    try{
        let userId = req.user.sub;
        let data = req.body;
        let findCart =await Cart.findOne({client: userId});
        let newTotal = 0;
        if(findCart.cart.length == 0)return res.status(404).send({message: 'Not have products in your cart'});
        for(let i =0; i< findCart.cart.length; i++){
            newTotal = newTotal+ parseInt(findCart.cart[i].subTotal);
        }
        let params = {
            sender: {
                nombre: "Venta Online",
                telefono: "7963015",
                direccion: 'N/A'
            },
            receiver: userId,
            address: data.address,
            products: JSON.parse(JSON.stringify(findCart.cart)),
            total: newTotal
        }
        let newBill = new Bill(params);
        await newBill.save();
        for(let i=0; i< findCart.cart.length; i++){
            let findCart1 =await Cart.findOne({client: userId});
            let productId = findCart1.cart[i].product;
            let product =await Product.findOne({_id: productId});
            let newStock = product.stock - parseInt(findCart.cart[i].cant);
            let newSold = product.sold + parseInt(findCart.cart[i].cant);
            if(newStock == 0) return res.status(404).send({message: 'The product is out of stock, remove some from the cart to continue'})
            let updatedStock = await Product.findOneAndUpdate({_id: productId}, {stock: newStock, sold: newSold}, {new: true})
            newStock = 0;
            newSold = 0;
        }
        let updatedCart = await Cart.findOneAndUpdate({client: userId}, {cart: []}, {new:true});
        let bill =await Bill.findOne({_id : newBill._id}).populate('receiver', infoUser).populate('products.product', infoProduct);
        return res.send({message: 'New Bill', bill});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating bill'});
    }
}

exports.viewBills = async(req,res)=>{
    try{
        let bills =  await Bill.find().populate('receiver', infoUser).populate('products.product', infoProduct);
        return res.send({bills})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting bills'});
    }
}

exports.getBillsByUser = async(req, res)=>{
    try{
        let data = req.body;
        let bills = await Bill.find({receiver: data.receiver}).populate('receiver', infoUser).populate('products.product', infoProduct);
        if(!bills)return res.status(404).send({message: 'This user has no bills'});
        return res.send({bills})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting bills'})
    }
}

exports.getMyBills = async(username)=>{
    try{
        let userToBills = username;
        let user =await User.findOne({username: userToBills});
        if(user.role == 'ADMIN')return console.log('Admins can´t have bills')
        let billsWithUser =await Bill.find({receiver: user._id}).populate('products.product', infoProduct);
        return billsWithUser;
    }catch(err){
        return console.error(err);
    }
}

exports.updateBill = async(req, res)=>{
    try{
        let newAddress = req.body.address;
        let billId =req.body.billId;
        let billExist = await Bill.find({_id: billId});
        if(!billExist)return res.status(404).send({message: 'Bill not found'});
        let updatedBill = await Bill.findOneAndUpdate({_id: billId}, {address: newAddress}, {new: true});
        return res.send({message: 'Updated Bill', updatedBill});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating bill'});
    }
}