'use strict'

const { createToken } = require('../services/jwt');
const { encrypt, validateData, checkPassword } = require('../utils/validate');
const { createCart } = require('../cart/cart.controller');
const { getMyBills } = require('../bill/bill.controller');
const User = require('./user.model');

exports.test = (req,res)=>{
    res.send({message:'Test fucntion to User is running'});
}

exports.register =async(req,res)=>{
    try{
        let data = req.body;
        data.role= 'CLIENT'
        data.password = await encrypt(data.password);
        let newUser = new User(data);
        await newUser.save();
        return res.send({message: 'New User created', newUser});
    }catch(err){
        console.error(err);
        res.status(500).send({message:'Error creating user'});
    }
}

exports.login = async(req,res)=>{
    try{
        let data = req.body;
        let credentials = {
            username : data.username,
            password: data.password
        };
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({msg});
        let user = await User.findOne({username: data.username});
        if(user && await checkPassword(data.password, user.password)){
            let token = await createToken(user);
            let a = data.username
            createCart(a);
            let bills = await getMyBills(a);
            return res.send({message:`Welcome ${user.username}`, token, bills});
        }
        return res.status(400).send({message: 'Invalid Credentials  '})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error, not logged'});
    }
}

exports.update = async(req,res)=>{
    try{
        let userId = req.params.id;
        let data = req.body;
        let userExists = await User.findOne({_id: userId});
        if(req.user.role === 'ADMIN'){
            if(userId === req.user.sub){
                if(data.password || Object.entries(data).length === 0 || data.role)return res.status(400).send({message:'The form has data that cannot be updated'})
                let userUpdated = await User.findOneAndUpdate({_id: userId}, data, {new:true});
                if(!userUpdated)return res.status(400).send({message:'User not found and not updated'});
                return res.send({message: 'User updated', userUpdated})
            }else{
                if(userExists.role === 'ADMIN')return res.status(401).send({message: 'Don´t have permission to update admins'});
                if(data.password || Object.entries(data).length === 0 || data.role)return res.status(400).send({message:'The form has data that cannot be updated'})
                let params = {
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    nit: data.nit,
                    phone: data.phone
                }
                let userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new:true});
                if(!userUpdated)return res.status(400).send({message:'User not found and not updated'});
                return res.send({message: 'User updated', userUpdated})            
            }
        }if(req.user.role === 'CLIENT'){
            if(userExists.role === 'ADMIN')return res.status(401).send({message: 'Don´t have permission to update admins'});
            if(userId === req.user.sub){
                if(data.password || Object.entries(data).length === 0 || data.role)return res.status(400).send({message:'The form has data that cannot be updated'})
                let userUpdated = await User.findOneAndUpdate({_id: userId}, data, {new:true});
                if(!userUpdated)return res.status(400).send({message:'User not found and not updated'});
                return res.send({message: 'User updated', userUpdated})
            }
        }        
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating user'});
    }
}

exports.updateRole = async(req,res)=>{
    try{
        let data = req.body;
        let userExists = await User.findOne({_id: data.id});
        if(!userExists)return res.status(500).send({message:'User not found'});
        if(userExists.role == 'ADMIN') return res.send({message: 'This user is already ADMIN'});
        let updatedRole = await User.findOneAndUpdate({_id: data.id}, {role: 'ADMIN'}, {new:true});
        return res.send({message: 'Role updated', updatedRole});
    }catch(err){
        console.error(err);
        res.status(500).send({message:'Error updating role'});        
    }
}

exports.updatePassword = async(req,res)=>{
    try{
        let userId = req.params.id;
        let data = req.body;
        let userExists = await User.findOne({_id: userId});
        let samePassword =await checkPassword(data.oldPass, userExists.password);
        if(userExists){
            if(req.user.sub != userId)return res.send({message: 'you can´t change someone else´s password'});
            if(samePassword){
                data.newPassword = await encrypt(data.newPassword);
                let updatePassword = await User.findOneAndUpdate({_id: userId},
                    {password: data.newPassword},
                    {new: true});
                    return res.send({message: 'User Updated', updatePassword});
            }
            return res.send({message:'the password is not correct'});
        }
        return res.status(404).send({message:'User not found and not update password'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message:'Error updating password'});
    }
}

exports.deleteUser = async(req,res)=>{
    try{
        let userId = req.params.id;
        let userExists = await User.findOne({_id: userId});
        if(req.user.role == 'ADMIN'){
            if(req.user.sub == userId){
                let deleteUser = await User.findOneAndDelete({_id: userId});
                if(!deleteUser)return res.status(404).send({message: 'User not found'});
                return res.send({message: 'User deleted', deleteUser});
            }else{
                if(userExists.role == 'ADMIN')return res.status(404).send({message: 'Don´t have permission to delete admins'});
                let deleteUser = await User.findOneAndDelete({_id: userId});
                if(!deleteUser)return res.status(404).send({message: 'User not found'});
                return res.send({message: 'User deleted', deleteUser});
            }
        }if(req.user.role == 'CLIENT'){
            if(userExists.role == 'ADMIN')return res.status(401).send({message: 'Don´t have permission to delete admins'});
            if(req.user.sub == userId){
                let deleteUser = await User.findOneAndDelete({_id: userId});
                if(!deleteUser)return res.status(404).send({message: 'User not found'});
                return res.send({message: 'User deleted', deleteUser});            
            }return res.status(404).send({message: 'You don´t have permission to delete other users'})
        }  
    }catch(err){
        console.error(err);
    }  
}