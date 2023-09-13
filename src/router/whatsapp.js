const express = require('express');
const router = express.Router();
//whatsapp
const fs = require('fs');
const { Client, RemoteAuth } = require('whatsapp-web.js');
// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const { Buttons, List, MessageMedia } = require('whatsapp-web.js');
const { generateMeta, generateImage, audioTotext } = require('../../bin/controller');
const whatsapp_repository = require('../repository/whatsapp_repository');
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



    // client.on('message', async message => {


    //     whatsapp_repository.getUserByName(message.from)
    //         .then(async result => {
    //             if (result === null) {
    //                 whatsapp_repository.postar("", message.from);
    //                 bot.loadDirectory("brain").then(loading_done).catch(loading_error);
    //                 //bot.loadFile("brain/begin.rive").then(loading_done).catch(loading_error);

    //                 function loading_done() {
    //                     console.log("Bot has finished loading!");
    //                     // Now the replies must be sorted!
    //                     bot.sortReplies();

    //                     // And now we're free to get a reply from the brain!

    //                     // RiveScript remembers user data by their username and can tell
    //                     // multiple users apart.
    //                     let username = "local-user";

    //                     // NOTE: the API has changed in v2.0.0 and returns a Promise now.

    //                     bot.reply(username, "saudação").then(function (reply) {
    //                         client.sendMessage(message.from, reply);

    //                     });
    //                 }

    //                 // It's good to catch errors too!
    //                 function loading_error(error, filename, lineno) {
    //                     console.log("Error when loading files: " + error);
    //                 }
    //             }

    //             else {
    //                 // Verifique se a mensagem é do tipo texto e se começa com o caractere '/'
    //                 if (message.type === 'chat' && message.body.startsWith('/')) {
    //                     // Remova o caractere '/' e converta o texto para letras minúsculas
    //                     const command = message.body.slice(1).toLowerCase();


    //                     // Verifique o comando recebido
    //                     switch (command) {
    //                         case '':


    //                             break;
    //                         case 'menu':
    //                             client.sendMessage(message.from,
    //                                 '===== MENU =======\n' +

    //                                 '1. token\n' +
    //                                 '2. ajuda\n' +
    //                                 '3. actualizar conta\n' +
    //                                 '4. sobre\n\n' +
    //                                 '5. apagar conta.\n\n' +
    //                                 '==================' +
    //                                 '\n* os comandos devem preceder de "/" para' +
    //                                 ' serem validos.'
    //                             );
    //                             break;
    //                         case 'token':

    //                             break;
    //                         case 'ajuda':

    //                             break;
    //                         case 'sobre':

    //                             break;
    //                         case 'actualizar conta':

    //                             break;
    //                         case 'apagar conta':

    //                             break;
    //                         case 'image':
    //                             const media = await MessageMedia.fromUrl('https://oaidalleapiprodscus.blob.core.windows.net/private/org-LAdJKVQRHP0E3Lo17Wm3TvxM/user-XNTTGVM3HH77IOlYMlCMgddj/img-Ss9k3B0BfgqVqj5fpkKWcGWA.png?st=2023-07-02T16%3A03%3A34Z&se=2023-07-02T18%3A03%3A34Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-01T20%3A28%3A55Z&ske=2023-07-02T20%3A28%3A55Z&sks=b&skv=2021-08-06&sig=J4UcK8N%2BemGXcbI2KQnAWZis%2BgkPdrWstnkjQDcZepc%3D');
    //                             client.sendMessage(message.from, media);
    //                             break;
    //                         case 'user':

    //                             break;
    //                         case 'button':
    //                             let button1 = new Buttons('Button body', [{ body: 'Aceptar' }, { body: 'rechazar' }], 'title', 'footer');
    //                             client.sendMessage(message.from, button1)
    //                                 .then(result => console.log("sucess with btn"))
    //                                 .catch(error => console.log(error));
    //                             break;
    //                         default:
    //                             bot.loadDirectory("brain").then(loading_done).catch(loading_error);
    //                             //bot.loadFile("brain/begin.rive").then(loading_done).catch(loading_error);

    //                             function loading_done() {
    //                                 console.log("Bot has finished loading!");
    //                                 // Now the replies must be sorted!
    //                                 bot.sortReplies();

    //                                 // And now we're free to get a reply from the brain!

    //                                 // RiveScript remembers user data by their username and can tell
    //                                 // multiple users apart.
    //                                 let username = "local-user";

    //                                 // NOTE: the API has changed in v2.0.0 and returns a Promise now.

    //                                 bot.reply(username, command).then(function (reply) {
    //                                     client.sendMessage(message.from, reply);

    //                                 });
    //                             }

    //                             // It's good to catch errors too!
    //                             function loading_error(error, filename, lineno) {
    //                                 console.log("Error when loading files: " + error);
    //                             }
    //                             break;
    //                     }
    //                 }

    //                 else if (message.type === 'chat' && message.body.startsWith("*")) {
    //                     // Remova o caractere '/' e converta o texto para letras minúsculas
    //                     const command = message.body.slice(6).toLowerCase();

    //                     generateImage(command).
    //                         then(async result => {
    //                             const media = await MessageMedia.fromUrl(result);
    //                             client.sendMessage(message.from, media);
    //                             //console.log(result);
    //                         }).
    //                         catch(error => console.log(error));
    //                     // Verifique o comando recebido

    //                 }
    //               /*  else {

    //                     if (message.hasMedia) {
    //                         const time = new Date(message.timestamp * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[1].replaceAll(':', '-')
    //                         const date = new Date(message.timestamp * 1000).toISOString().substring(0, 10);
    //                         const person = message['_data']['notifyName'];
    //                         const phoneNumber = message.from.replaceAll('@c.us', '');
    //                         const media = await message.downloadMedia();
    //                         // do something with the media data here
    //                         const folder = process.cwd() + '/img/' + phoneNumber + '_' + person + '/' + date + '/';
    //                         const filename = folder + time + '_' + message.id.id + '.' + media.mimetype.split('/')[1];
    //                         fs.mkdirSync(folder, { recursive: true });
    //                         fs.writeFileSync(filename, Buffer.from(media.data, 'base64').toString('binary'), 'binary');
    //                         if (media.mimetype === 'audio/ogg; codecs=opus') {
    //                             console.log('AUDIO SENT: ');

    //                         } else if (media.mimetype === 'image/jpeg') {
    //                             console.log("IMAGE SENT: ");
    //                         }
    //                     }
    //                     else {
    //                         generateMeta(message.body).
    //                             then(result => {
    //                                 if (result === null) {
    //                                     client.sendMessage(message.from, "O seu token expirou, tente mais tarde.");
    //                                     console.log('resposta nula ' + result);
    //                                     return;
    //                                 }
    //                                 client.sendMessage(message.from, result);
    //                             }).
    //                             catch(error => console.log(error));
    //                     }


    //                 }*/
    //             }
    //         })
    //         .catch(error => console.log(error))
    // });

});

router.get('/', (req, res, next) => {

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

      <!-- p5 -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/addons/p5.sound.min.js"></script>
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
      </div >
      <a class="btn" onclick="abrirNovaPagina()" href="" >Configurar</a>
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

        function abrirNovaPagina() {
          window.open(' ', '_blank');
        }
      </script>
        
    

      </body>
      `;
            res.send(qrCodeHtml);
        }
    });

});



module.exports = router;













