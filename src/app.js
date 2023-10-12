const express = require('express');
const mongo = require('mongoose');
const app = express();
const cors = require('cors')
const body_parser = require('body-parser');
const dotenv = require('dotenv').config();
const index = require('./router/index');
const user = require('./router/user');
// const chatRoute = require('./router/chatRoute');
//const whatsapp = require('./router/whatsapp');
//const dashboard = require('./router/dashbord'); comment

// conexao com banco de dado...
// mongo.connect(process.env.MONGO_CONNECT_URI).
mongo.connect(process.env.MONGO_CONNECT_URI).
    then(() => console.log("> A sua frontend está agora conectado ao seu banco de dados.")).catch(error => console.log("> Ocorreu um erro ao criar o banco de dados!" + error.message));

    // Configurar Content Security Policy
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://chat.startic.ao"); // Substitua com seu domínio
    // res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// app.use(cors())
    return next();
});
// app.use(cors({
//     origin: '*',
// }))

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/user', user);

// app.use('/api/chats', chatRoute);



module.exports = app;