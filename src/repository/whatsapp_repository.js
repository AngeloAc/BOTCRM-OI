const mongoose = require('mongoose');
const Wuser = require('../models/whatsapp_user');

// Listar todos os produtos do banco de dados.
exports.getAll = () => {
   return Wuser.find();
};

// Postar um novo produto no banco de dados.
exports.postar = (nome, telefone) => {

    return new Wuser({
        nome: nome,
        telefone: telefone
    }).save();
 };

 exports.getUserByName = async (telefone) => {
    const myuser = await Wuser.findOne({ telefone: telefone })
    return myuser; 
  }