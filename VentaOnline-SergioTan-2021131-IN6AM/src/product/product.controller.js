'use strict'

const Product = require('./product.model');
const {validateData} = require('../utils/validate')

exports.test = (req,res)=>{
    res.send({message: 'Test Function for Product is running'});
}

exports.add = async(req,res)=>{
    try{
        let data = req.body;
        let params = {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category: data.category
        }
        let msg = validateData(params);
        if(msg) return res.status(400).send({msg});
        let newProduct = new Product(params);
        await newProduct.save()
        return res.send({message: `New product created`, newProduct});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating product'});
    }
}

exports.getProducts = async(req,res)=>{
    try{
        let products = await Product.find().populate('category');
        return res.send({products});
    }catch(err){
        console.error;
        return res.status(500).send({message: 'Error getting product'});
    }
}

exports.getProduct = async(req,res)=>{
    try{
        let productId = req.params.id;
        let product = await Product.findOne({_id: productId}).populate('category');
        if(!product)return res.status(404).send({message: 'Product not found'});
        return res.send({product});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting product'});
    }
}

exports.getProductsSoldOut = async(req, res)=>{
    try{
        let soldOutProducts = await Product.find({stock: '0'});
        return res.send({soldOutProducts});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting products'});
    }
}

exports.getMostSelledProducts = async(req,res)=>{
    try{
        let mostSelled = await Product.find().sort({sold: -1}).limit(4);
        return res.send({mostSelled});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting products'});
    }
}

exports.searchProducts = async(req,res)=>{
    try{
        let name = req.body.name;
        let products = await Product.find({name: {$regex: name, $options: 'i'}}).populate('category');
        return res.send({products})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching products'});
    }
}

exports.updateProduct = async(req,res)=>{
    try{
        let productId = req.params.id;
        let data = req.body;
        let params = {
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category
        }
        let existProduct = await Product.findOne({_id: productId});
        if(!existProduct) return res.status(404).send({message: 'Product not found'});
        let updatedProduct = await Product.findOneAndUpdate({_id: productId}, params, {new: true});
        if(!updatedProduct)return res.status(404).send({message: 'Product not found and not updated'});
        return res.send({message: 'Product updated:', updatedProduct})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating product'});
    }
}

exports.delete = async(req,res)=>{
    try{
        let productId = req.params.id;
        let existProduct = await Product.findOne({_id: productId});
        if(!existProduct)return res.status(404).send({message: 'Product not found'});
        let deletedProduct = await Product.findOneAndDelete({_id: productId});
        if(!deletedProduct)return res.status(404).send({message: 'Product not found and not deleted'});
        return res.send({message: 'Product deleted', deletedProduct});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting product'});
    }
}

exports.addStock= async(req,res)=>{
    try{
        let productId = req.params.id;
        let stock = req.body.stock;
        let existProduct = await Product.findOne({_id: productId});
        if(!existProduct)return res.status(404).send({message: 'Product not found'});
        let updatedStock = await Product.findOneAndUpdate({_id: productId}, {$inc: {stock: stock}}, {new:true});
        if(!updatedStock)return res.status(404).send({message: 'Product not found and not changing stock'});
        return res.send({message: 'Updated stock from:', updatedStock});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error changing the stock'});
    }
}

exports.updateStock = async(req,res)=>{
    try{
        let productId = req.params.id;
        let stock = req.body.stock;
        let existProduct = await Product.findOne({_id: productId});
        if(!existProduct)return res.status(404).send({message: 'Product not found'});
        let updatedStock = await Product.findOneAndUpdate({_id: productId}, {stock: stock}, {new:true});
        if(!updatedStock)return res.status(404).send({message: 'Product not found and not changing stock'});
        return res.send({message: 'Updated stock from:', updatedStock});       
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error changing the stock'});
    }
}