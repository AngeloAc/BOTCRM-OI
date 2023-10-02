const mongoose = require('mongoose');
const User = require('../models/user');

// Listar todos os produtos do banco de dados.
exports.getAll = async () => {
  return await  User.find();
};

// ===> Repositorio responsavel por registar um novo user (POST) localhost:3030/api/v1/register
exports.registar = async (name, email, password) => {};

// Actualizar os dados do user no banco de dados....
exports.update = async (id, email) => {
 return await User.findOneAndUpdate({_id: id}, {$set: {email: email}});
}

// Delete a user no DB....
exports.delete = async (id) =>{
  return await User.findOneAndDelete({_id: id});
}

//Login
exports.login = async (name, password) => { 
  return await User.findOne({ name: name });
}

//
exports.getUserByName = async (name) => {
  return await User.findOne({ name: name })
}

