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
let qrCode = "www.oinet.ao";
let percentual = '0';
let message = "Whatsapp";
let auth = false;
let auth_error = "Erro ao se autenticar.";
let clientOn = "black"

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

  client.on('loading_screen', (percent, message) => {
    console.log('Carregando... ', percent, message);
    percentual = percent;
    message = message;
});

client.on('authenticated', () => {
    console.log('Autenticado');
    auth = true;
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('Falha ao autenticar ', msg);
});

client.on('ready', () => {
    console.log('Cliente pronto');
    clientOn = "red";
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
      const qrCodeHtml = 
      `
      <head>
        <style>
        .btn {
          margin-top: 15px;
          margin-bottom: 15px;
          padding: 10px 20px;
          background-color: transparent;
          color: black;
          border: 1px solid gray;
          border-radius: 20px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
        }
        .btn:hover{
          background-color: gray;
          color: white;
          text-decoration: none;
        }
        .qrcodeImg{
          border: none; 
          border-radius: 10px; 
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
        }
        .qrcodeImg.transparente{
          opacity: 0.2;
        }
        </style>
      </head>
      <body style=" font-family: Arial, sans-serif; padding-top: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <div style="width: 400px; height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: none; border-radius: 10px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);">
      <h2>OINET CRM BOT AI</h2>
      <p id="resfreshme">Carregando ${percentual} ${message}</p>
      <img id="qrcode" src="${url}" alt="QR Code" class="qrcodeImg">
      
      <div style="width: 100px; padding-top: 20px; display: flex; align-items: center; justify-content: center;">
      
      <div style="background-color: ${clientOn}; width: 15px; height: 15px;border: 1.5px solid black; border-radius: 50%; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);"></div>
      </div>
      <a class="btn" onclick="callMe() href="">Configurar</a>
      </div>

      
      <footer>
      <div style="display: flex; align-items: center; justify-content: center;" style="height: 75px;">
          <p style="margin: 5px;">&copy; <a style="color:gray; text-decoration: none;" href="#"> OINET
                  2023 Todos os direitos reservados
          </p>
          <p style="font-size: 14px;">
              <!--/*** This template is free as long as you keep the footer author’s credit link/attribution link/backlink. If you'd like to use the template without the footer author’s credit link/attribution link/backlink, you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". Thank you for your support. ***/-->
               Designed by <a style="text-decoration: none; color: blue;"
                  href="">startic</a>
          </p>
      </div>
  </footer>


      <script>
      var intervalo = 5000;
      function atualizarPagina() {
        location.reload();
      }
      setInterval(atualizarPagina, intervalo);
        function callMe (){
          console.log("call me on console.");
        }
        const qrcode = document.getElementById('qrcode');
        if(${auth} === true){
          qrcode.classList.add('transparente');
          console.log("autenticado");
        }else{
          qrcode.classList.remove('transparente');
          console.log("none user");
        }
      </script>
        

      </body>
      `;
      res.send(qrCodeHtml);
    }
  });

});













module.exports = route;













