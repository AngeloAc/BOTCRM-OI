const express = require('express');
const path = require('path')
const router = express.Router();
const controller = require('../controllers/controller_user');
const midleware = require('./auth/midleware');
const multer = require('multer');

// Configuração do Multer para o upload de arquivos
const storage = multer.diskStorage({
    destination: 'uploads/', // Pasta onde os arquivos serão salvos
    limits: { fileSize: 4 * 1024 * 1024 }, // Limitar o tamanho do arquivo para 4 MB
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + extname); // Nome do arquivo será o timestamp atual + extensão
    },
});

const upload = multer({ storage });




// ===> Rota responsavel por registar um novo user (POST)
router.post('/register', controller.registerNewUser);
// ====> FIM DA ROTA...

// ===> Rota responsavel por Login um user (POST) 
router.post('/login', controller.login);
// ====> FIM DA ROTA...

// ===> Rota responsavel por deletar a conta de um user (POST) 
router.get('/delete/:id', midleware.checkToken, controller.deleteConta);
// ====> FIM DA ROTA...

// ====> Rota responsavel por actualizar os dados do usuario, como: username, senha, tel, pais, idioma... 
router.post('/actualizar/:id', midleware.checkToken, controller.actualizar_usuario);
// ====> FIM DA ROTA...  

// ====> Rota responsavel por pegar o script do client....
router.get('/script/:id', midleware.checkToken, controller.getScript);
// FIM DA ROTA....

// ====> Rota responsavel por adicionar novo script...
router.patch('/script/:id', midleware.checkToken, controller.addScript);
// ====> FIM DA ROTA...

// ====> Rota responsável pelo chat do usuario, recebendo as mensagens e respondendo as mesmas.
router.post('/chat/:id/:message_id', midleware.checkToken, controller.promptChat);
// ===> FIM DA ROTA....

// ====> Rota responsavel pelo chat do code JAVA.
router.post('/codejava/:id/:message_id', midleware.checkToken, controller.codeJava);
// ====> FIM DA ROTA....

// ====> Rota responsavel pela criacao de um novo chat....
router.post('/codejavachat/:id', midleware.checkToken, controller.codeJavaChat);
// ====>

// ====> Rota responsavel por connectar o whatsapp do user....
router.post('/app/whatsapp/web/connect', controller.whatsappWeb_connect);
// ====>

router.get('/codejavachat/history/:id', midleware.checkToken, controller.getHistoryJavaChat);

//router.get('/', controller.getAll);
router.get('/:id', controller.getUser);


// ===> Rota responsavel por pegar o perfil do user (GET) localhost:3030/api/v1/register
router.get('/userprofile', midleware.checkToken, controller.returnUserProfile);
// ===>


// router.patch('/update/:id', controller.actualizar_dados); // Actualizar os dados do user no BD...

router.post('/conversation/:id', midleware.checkToken, controller.conversations);
// ====>
router.get('/c/history/:id', midleware.checkToken, controller.getHistoryChat);

// ====> install whatsapp web js on the server....
router.post('/app/whatsapp/web/install', controller.whatsappWeb_install);

// ======>
router.post('/app/whatsapp/web/addons/:id', controller.whatsappWeb_addonsUpadate);

// ======>
router.post('/uploadvariation', upload.single('file'), controller.uploadImageVariation);

router.post('/deleteconversation/:id', controller.deleteConversation);

module.exports = router;

