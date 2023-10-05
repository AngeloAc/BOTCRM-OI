
// create a server - bot
const app = require('../src/app'); // importando os dados do App
const express = require('express'); // importando express
const https = require('https'); // importando o http
const fs = require('fs');
require('dotenv').config(); // importando e configurando o dotenv

const options = {
  key: fs.readFileSync('/etc/apache2/certificate/apache.key'),
  cert: fs.readFileSync('/etc/apache2/certificate/apache-certificate.crt')
};


const port = normalizePort(process.env.PORT || 3030);
const server = https.createServer(options, app);

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

