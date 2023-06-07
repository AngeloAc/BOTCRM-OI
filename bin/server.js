// create a server
const app = require('../src/app'); // importando os dados do App
const express = require('express'); // importando express
const http = require('http'); // importando o http
require('dotenv').config(); // importando e configurando o dotenv


const port = normalizePort(process.env.PORT || 3000);
const server = http.createServer(app);

server.listen(port);
console.log("Server is running on port 3000")


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









