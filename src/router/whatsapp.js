const express = require('express');
const router = express.Router();
//whatsapp
const fs = require('fs');
const { Client, RemoteAuth } = require('whatsapp-web.js');
// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const { Buttons, List } = require('whatsapp-web.js');

const qrcode = require('qrcode-terminal');
const QRCODE = require('qrcode')
let qrCode = "no code";

//Rivescript
const rs = require('rivescript');
var bot = new rs({ utf8: true });


// Load the session data
mongoose.connect(process.env.MONGO_CONNECT_URI).then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      clientId: 'client-one',
      backupSyncIntervalMs: 300000
    })
  });
  client.on('qr', qr => {
    //qrcode.generate(qr, {small: true});
    qrCode = qr;
    console.log("QR. CODE IS RUNNING")
  });

  client.on('authenticated', () => {
    console.log('Authenticated...')
  });


  client.on('ready', qr => {
    console.log('Client is ready')
  });

  client.on('remote_session_saved', () => {
    console.log("Remote session is saved...");
  });

  client.initialize();

  let button = new Buttons('*Como posso te ajudar?*',
    [{ body: 'Conta' },
    { body: 'Suporte técnico' },
    { body: 'Pagamento' },
    ], 'MENU', 'Joice, inteligencia artificial');


  client.on('message', async message => {


  // Verifique se a mensagem é do tipo texto e se começa com o caractere '/'
  if (message.type === 'chat' && message.body.startsWith('/')) {
    // Remova o caractere '/' e converta o texto para letras minúsculas
    const command = message.body.slice(1).toLowerCase();

    // Verifique o comando recebido
    switch (command) {
      case 'menu':
        // Simule a verificação da velocidade da conexão
        const menuResult = "Oinet Menu:\n\n" +
            "1) _MONEY_ 💵\n" +
            "2) Tarif. Voz\n" +
            "3) Tarif. Net\n" +
            "4) *Planos Internt Casa*\n" +
            "5) Pontos\n" +
            "6) Serviços\n" +
            "7) Cadastrar-se\n" +
            "8) Entretenimento\n";
        await  setTimeout(() => {
          message.reply(menuResult);
          client.on('message', msg =>{
            message.reply("Opção: " + msg.body);
          })
          return  
      }, 3000);
        break;
      case 'velocidade':
        // Simule a verificação da velocidade da conexão
        const speedTestResult = 'Velocidade da conexão: 50 Mbps';
        await message.reply(speedTestResult);
        break;
      case 'suporte':
        // Simule o encaminhamento para o suporte técnico
        const supportMessage = 'O suporte técnico entrará em contato em breve.';
        await message.reply(supportMessage);
        break;
      default:
        // Comando inválido
        const errorMessage = 'Comando inválido. Por favor, tente novamente.';
        await message.reply(errorMessage);
        break;
    }
  }

    // if (msg.body === 'Menu' || msg.body === 'menu') {
    //   client.sendMessage(msg.from, button);
    // }
    // if (msg.body === 'Suporte' || msg.body === 'suporte') {
    //   client.sendMessage(msg.from, "Vamos encaminhar o seu pedido para um humano.");
    // }
    // if (msg.body === "Menu" || msg.body === "menu") {
    //   client.sendMessage(msg.from,
    //     "OINET MENU:\n\n" +
    //     "1) Oinet Money\n" +
    //     "2) Tarif. Voz\n" +
    //     "3) Tarif. Net\n" +
    //     "4) Planos Internt Casa\n" +
    //     "5) Pontos\n" +
    //     "6) Serviços\n" +
    //     "7) Entretenimento\n"
    //   )
    // }
    else {

      bot.loadDirectory("brain").then(loading_done).catch(loading_error);
      //bot.loadFile("brain/begin.rive").then(loading_done).catch(loading_error);

      function loading_done() {
        console.log("Bot has finished loading!");
        // Now the replies must be sorted!
        bot.sortReplies();

        // And now we're free to get a reply from the brain!

        // RiveScript remembers user data by their username and can tell
        // multiple users apart.
        let username = "local-user";

        // NOTE: the API has changed in v2.0.0 and returns a Promise now.

        bot.reply(username, message.body).then(function (reply) {
          client.sendMessage(message.from, reply);
        });

      }

      // It's good to catch errors too!
      function loading_error(error, filename, lineno) {
        console.log("Error when loading files: " + error);
      }
    }
  });

});

const route = router.get('/', (req, res, next) => {

  //Gerar o conteúdo do QR Code
  const qrCodeContent = qrCode;

  // Gerar o código QR baseado no conteúdo
  QRCODE.toDataURL(qrCodeContent, (err, url) => {
    if (err) {
      console.error('Erro ao gerar o código QR:', err);
      res.status(500).send('Erro ao gerar o código QR');
    } else {
      // Exibir o código QR no navegador
      const qrCodeHtml = `<img src="${url}" alt="QR Code">`;
      res.send(qrCodeHtml);
    }
  });

});













module.exports = route;













