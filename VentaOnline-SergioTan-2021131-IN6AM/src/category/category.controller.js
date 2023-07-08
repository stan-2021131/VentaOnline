'use strict'
const Category = require('./category.model');
const Product = require('../product/product.model');

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
}

exports.defaultCategory = async()=>{
    try{
        let defaultCategory={
            name: 'Default',
            description: 'This is the default category'
        }
        let existDefaultCategory =await Category.findOne({name: 'Default'});
        if(existDefaultCategory) return console.log('Default category already created');
        let categoryDefault = new Category(defaultCategory);
        await categoryDefault.save();
        return console.log('Default category created');
    }catch(err){
        console.error(err);
    }
}

exports.add = async(req,res)=>{
    try{
        let data = req.body;
        let existsCategory = await Category.findOne({name: data.name});
        if(existsCategory) return res.send({message: 'Category Already Created'});
        let newCategory = new Category(data);
        await newCategory.save();
        return res.status(201).send({message: 'New Category Created', newCategory});
    }catch(err){
        console.error(err);
        res.status(500).send({message: 'Error creating category'});
    }
}

exports.get = async(req, res)=>{
    try{
        let categories = await Category.find();
        return res.send({categories});
    }catch(err){
        console.error(err);
        res.status(500).send({message: 'Error getting categories'});        
    }
}

exports.update = async(req,res)=>{
    try{
        let categoryId = req.params.id;
        let data = req.body;
        let existsCategory = await Category.findOne({name: data.name});
        if(existsCategory){
            if(existsCategory._id != categoryId)return res.send({message: 'This category already exists'});
            let updateCategory = await Category.findOneAndUpdate({_id: categoryId}, data, {new: true});
            if(!updateCategory)return res.status(400).send({message: 'Category not found'});
            return res.send({message: 'Category updated', updateCategory});
        }
        let updateCategory = await Category.findOneAndUpdate({_id: categoryId}, data, {new: true});
        if(!updateCategory)return res.status(400).send({message: 'Category not found'});
        return res.send({message: 'Category updated', updateCategory});
    }catch(err){
        console.error(err);
        res.status(500).send({message: 'Error updating category'});        
    }
}

exports.deleteCategory = async(req,res)=>{
    try{
        let categoryId = req.params.id;
        let defaultCategory = await Category.findOne({name: 'Default'});
        if(defaultCategory.id == categoryId) return res.send({message: 'Can´t delete default category'});
        //Aun no ha creada el modelo productos
        await Product.updateMany({category: categoryId}, {category:defaultCategory.id})
        let deletedCategory = await Category.findOneAndDelete({_id: categoryId});
        if(!deletedCategory)return res.status(400).send({message:'Category not deleted'});
        return res.send({message:'Category Deleted', deletedCategory});
    }catch(err){
        console.error(err);
        res.status(500).send({message: 'Error updating category'});        
    }
}