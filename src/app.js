const express = require('express');
const mongo = require('mongoose');
const app = express();
const body_parser = require('body-parser');
const dotenv = require('dotenv').config();
const index = require('./router/index');
const user = require('./router/user');
const whatsapp = require('./router/whatsapp');

// conexao com banco de dado...
// mongo.connect(process.env.MONGO_CONNECT_URI).
mongo.connect(process.env.MONGO_CONNECT_URI).
    then(() => console.log("Connected to db")).catch(error => console.log("Ocorreu um erro ao criar o banco de dados!" + error.message));

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }))

app.use('/', index);
app.use('/user', user);
app.use('/whatsapp', whatsapp);


module.exports = app;