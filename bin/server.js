
// create a server - bot
const app = require('../src/app'); // importando os dados do App
const express = require('express'); // importando express
const http = require('http'); // importando o http
require('dotenv').config(); // importando e configurando o dotenv

const port = normalizePort(process.env.PORT || 3030);
const server = http.createServer(app);

server.listen(port);
console.log("> Servidor rodando na porta: " + port);


function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
      return val;
  }
  if (port >= 0) {
      return val;
  }
  return false;
}

function error() {

}

