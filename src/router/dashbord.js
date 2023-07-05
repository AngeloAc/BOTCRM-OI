const express = require('express');
const app = express();
const WebSocket = require('ws');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

// Iniciar o servidor WebSocket
const wss = new WebSocket.Server({ noServer: true });

// Array para armazenar os clientes conectados
const clients = [];

// Rota para renderizar o template do dashboard
app.get('/', (req, res) => {
  res.render('index');
});

// Rota de coleta de dados do gráfico
app.get('/data', (req, res) => {
  const data = gerarDadosDoGrafico();
  res.json(data);
});

// Rota de upgrade para o WebSocket
app.server = app.listen(3000, () => {
  console.log('Servidor iniciado em http://localhost:3000');
});

// Lidar com a conexão WebSocket
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Enviar atualizações para os clientes conectados
function enviarAtualizacao() {
  const data = gerarDadosDoGrafico();

  // Converter os dados em JSON
  const json = JSON.stringify(data);

  // Enviar os dados para todos os clientes conectados
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

// Gerar dados do gráfico
function gerarDadosDoGrafico() {
  const labels = [];
  const values = [];

  for (let i = 0; i < 10; i++) {
    const x = Math.random();
    const y = Math.random();
    labels.push(x);
    values.push(y);
  }

  return { labels, values };
}

// Intervalo para enviar atualizações periodicamente
setInterval(enviarAtualizacao, 5000); // Atualiza a cada 5 segundos

// Lidar com a conexão WebSocket
wss.on('connection', (ws) => {
  // Adicionar o cliente à lista de clientes conectados
  clients.push(ws);

  // Lidar com a mensagem recebida do cliente
  ws.on('message', (message) => {
    console.log('Mensagem recebida:', message);
  });

  // Lidar com o fechamento da conexão do cliente
  ws.on('close', () => {
    // Remover o cliente da lista de clientes conectados
    clients.splice(clients.indexOf(ws), 1);
  });
});
