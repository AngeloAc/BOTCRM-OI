const express = require('express');
const mongo = require('mongoose');
const app = express();
const cors = require('cors')
const body_parser = require('body-parser');
const dotenv = require('dotenv').config();
const index = require('./router/index');
const user = require('./router/user');
//const whatsapp = require('./router/whatsapp');
//const dashboard = require('./router/dashbord');

// conexao com banco de dado...
// mongo.connect(process.env.MONGO_CONNECT_URI).
mongo.connect(process.env.MONGO_CONNECT_URI).
    then(() => console.log("> A sua frontend está agora conectado ao seu banco de dados.")).catch(error => console.log("> Ocorreu um erro ao criar o banco de dados!" + error.message));

app.use(cors({
    origin: '*',
}))
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/user', user);



module.exports = app;