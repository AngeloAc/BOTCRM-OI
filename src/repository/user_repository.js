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

 exports.getUserByName = (name) => {
    return User.find({ name: name })
      .then(users => {
        if (users.length === 0) {
          console.log('Nenhum usuário encontrado com o nome', name);
          return null;
        }
        
        const user = users[0];
        console.log('Usuário encontrado:');
        console.log('- Nome:', user.name);
        console.log('  Idade:', user.age);
        console.log('  Email:', user.email);
  
        return user.name; // Retorna o nome do usuário
      })
      .catch(err => {
        console.error('Erro ao consultar usuários:', err);
        return null;
      });
  }
  
