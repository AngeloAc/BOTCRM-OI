const mongoose = require('mongoose');
const User = require('../models/user');

// Listar todos os produtos do banco de dados.
exports.getAll = () => {
   return User.find();
};

// Postar um novo produto no banco de dados.
exports.postar = (name, email, password) => {

    return new User({
        name: name,
        email: email,
        password: password
    }).save();
 };