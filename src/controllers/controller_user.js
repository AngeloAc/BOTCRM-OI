const repositorio = require('../repository/user_repository');
const url = "http://localhost:3000/";
const User = require('../models/user');
const jwtoken = require('jsonwebtoken');
const midleware = require('../router/auth/midleware');
const { CustomAI } = require('../../bin/CustomAI');
require('dotenv').config();
const fs = require('fs');
const { exec, spawn } = require('child_process');
const path = require('path');
const { stdout, stderr } = require('process');
const bcrypt = require('bcryptjs');
const { generateImage, variationImage } = require('../../bin/controller');


myRoot = (() => {
    const parent = path.resolve(__dirname, '..');
    const parent1 = path.resolve(parent, '..');
    const parent2 = path.resolve(parent1, '..');
    return parent2
});

function extractJavaCodeBlocks(code, inputString) {
    // const regex = /```${code}([\s\S]*?)```/g;
    const regex = new RegExp('```' + code + '([\\s\\S]*?)```', 'g');
    const matches = [];
    let match;

    while ((match = regex.exec(inputString)) !== null) {
        matches.push(match[1]);
    }

    return matches;
}
// ===> Controller responsavel por registar um novo user (POST) localhost:3030/user/api/v1/register
exports.registerNewUser = (async (req, res, next) => {

    try {
        let isUser = await User.find({ email: req.body.email });

        if (isUser.length >= 1) {
            return res.status(404).json({ message: "Sorry! this user is already registed!" });
        }

        const usedPorts = [];
        const minPorta = 3038;
        const maxPorta = 49151;

        let userPorta = await User.find();
        for (let i = 0; i < userPorta.length; i++) {
            usedPorts.push(userPorta[i].porta);
        }

        let portaAleatoria = Math.floor(Math.random() * (maxPorta - minPorta + 1)) + minPorta;

        while (usedPorts.includes(portaAleatoria)) {
            portaAleatoria = Math.floor(Math.random() * (maxPorta - minPorta + 1)) + minPorta;
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            telefone: req.body.telefone,
            porta: portaAleatoria,
            addons: [
                { app: 'whatsapp' }
            ]
        });

        const user = await newUser.save();

        // Criar nova pasta
        fs.mkdir(myRoot() + '/' + user._id.toString(), (err) => {
            if (err) {
                console.error(`Erro ao criar a pasta: ${err.message}`);
                return;
            } else {
                fs.writeFile(myRoot() + '/' + user._id.toString() + '/file.txt', 'Tu es um bot da startup startic.', 'utf8', (err) => {
                    if (err) {
                        console.error(`Erro ao escrever o arquivo: ${err.message}`);
                        return;
                    }
                });
            }
        })

        const token = await newUser.generateAuthToken();
        res.status(201).json({ message: "user created succefully!", user, token });
    }
    catch (err) {
        res.status(400).json({ err: "error ao enviar o response:  " + err })
    }
});
// ====> FIM CONTROLLER REGISTER...


// ====> Controller para Login 
exports.login = (async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).json({ message: "Erro ao realizar o login, verifique as suas credencias" });
        }
        const token = await user.generateAuthToken();
        res.status(200).json({ message: "Usuario logado com sucesso!", user, token });

    }
    catch (err) {
        res.status(400).json({ err: err });
    }
});
// ====> FIM CONTROLLER LOGIN...

// =====> Controller para deletar a conta de um usuario. 
exports.deleteConta = (async (req, res, next) => {
    try {
        const root = myRoot();

        const user = await User.findByIdAndDelete({ _id: req.params.id })
            .then(
                () => {

                    // Verificar se a pasta já existe
                    fs.access(root + '/' + req.params.id, fs.constants.F_OK, async (err) => {
                        if (err) {
                            // A pasta com o id do usuario não existe...

                        } else {
                            /* A pasta com o id do usuario existe no directorio... 
                                .
                                .
                                .
                            */
                            // Deletar o arquivo do usuario no servidor...
                            // todo permissão.
                            // fs.unlink(root + '/' + req.params.id, (err) => {
                            //     if (err) {
                            //         console.error(`Erro ao deletar o arquivo "${req.params.id}": ${err.message}`);
                            //         return;
                            //     }
                            //     console.log(`Arquivo "${req.params.id}" deletado com sucesso!`);
                            // });

                            setTimeout(() => {
                                return res.status(200).json({
                                    message: 'Conta deletada.',
                                })
                            }, 2000);
                        }
                    })

                }
            )
            .catch(err => {
                return res.status(404).json('error ao deletar a sua conta.')
            }
            );


    } catch (error) {
        return res.status(404).json('Erro ao deletar a conta');
    }

});
// FIM CONTROLLER DELETAR CONTA ... 

// =====> Controller para actualizar dados do usuario.
exports.actualizar_usuario = (async (req, res, next) => {
    try {
        let newPassword;
        if (req.body.password) {
            newPassword = await bcrypt.hash(req.body.password, 8);
        } else {
            newPassword = req.body.password
        }
        const user = await User.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {
                name: req.body.name,
                password: newPassword,
                telefone: req.body.telefone,
                country: req.body.country,
                language: req.body.language
            }
        });
        return res.status(200).json({
            message: 'Dados do usuario foram actualizados com sucesso.'
        })
    } catch (error) {
        return res.status(404).json(error)
    }
});
// FIM CONTROLLER UPDATE...

// =====> Controller para pegar o scripts do usuario.
exports.getScript = (async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) {
            return res.status(404).json({ message: "usuario não encontrado." })
        }
        return res.status(200).json({
            message: "Usuario encontrado com sucesso.",
            user
        })

    } catch (error) {
        return res.status(400).json({
            error: error
        });
    }
});
// FIM CONTROLLER GETSCRIPT...

// =====> Controller para adicionar Scripts....
exports.addScript = (async (req, res, next) => {
    try {

        await User.findOneAndUpdate({ _id: req.params.id }, { $set: { script: req.body.script } })
            .then(user => {

                // Verificar se a pasta já existe
                fs.access(myRoot() + '/' + req.params.id, fs.constants.F_OK, async (err) => {
                    if (err) {
                        console.log('pasta nao existe')

                    } else {
                        console.log('pasta existe');

                        await fs.readFile(myRoot() + '/' + req.params.id + '/file.txt', 'utf8', (err, data) => {
                            if (err) {
                                console.error(`Erro ao ler o arquivo: ${err.message}`);
                                return;
                            }
                            fs.writeFile(myRoot() + '/' + req.params.id + '/file.txt', req.body.script.text, 'utf8', (err) => {
                                if (err) {
                                    console.error(`Erro ao escrever o arquivo: ${err.message}`);
                                    return;
                                }
                                console.log('Parágrafo adicionado com sucesso na linha específica!');
                            });
                        });
                    }

                });

                return res.status(200).json({
                    message: "Usario actualizado com sucesso!",
                    user
                })
            })

    } catch (error) {
        res.status(404).json({
            error: error
        })
    }
});
// =====> FIM CONTROLLER ADDSCRIPT...


// =====> Controller para receber as mensagens do clientes e envia para a classe com a integração da openAI e retorna a resposta ao cliente.
exports.promptChat = (async (req, res, next) => {
    try {
        // Todo id 

        const chat = new CustomAI();
        req.body.pop();
        req.body.splice(0, req.body.length - 1);
        const user = await User.findById({ _id: req.params.id });
        for (let index = 0; index < user.conversations.length; index++) {
            const element = user.conversations[index]._id.toString();
            
            if (element === req.params.message_id) {
                user.conversations[index].messages = user.conversations[index].messages.concat(req.body);
                const question = req.body[0].text;
                // Verifica se a pergunta começa com "Image" ou "image"
                if (question.toLowerCase().startsWith('/gera')) {
                    // Execute a função generateImage
                    const r = await generateImage(question)
                    // console.log(r)
                    
                    const dataAtual = new Date();

                    // Obtém os componentes da data
                    const dia = dataAtual.getDate();
                    const mes = dataAtual.getMonth() + 1; // Os meses começam em 0
                    const ano = dataAtual.getFullYear();
                    
                    // Obtém os componentes da hora
                    const horas = dataAtual.getHours();
                    const minutos = dataAtual.getMinutes();
                    // const segundos = dataAtual.getSeconds();
                    
                    // Formata a data e hora
                    const dataFormatada = `${dia}/${mes}/${ano}`;
                    const horaFormatada = `${horas}:${minutos}`;
                    
                    // Imprime na console
                     user.conversations[index].messages = user.conversations[index].messages.concat({ text: r, isUser: false, time: horaFormatada, data: dataFormatada });

                    await user.save();
                    return res.status(200).json({
                        resposta: r
                    });
                } else {
                    // Execute chat.generateData
                    const result = await chat.generateData(question);
                    const dataAtual = new Date();

                    // Obtém os componentes da data
                    const dia = dataAtual.getDate();
                    const mes = dataAtual.getMonth() + 1; // Os meses começam em 0
                    const ano = dataAtual.getFullYear();
                    
                    // Obtém os componentes da hora
                    const horas = dataAtual.getHours();
                    const minutos = dataAtual.getMinutes();
                    // const segundos = dataAtual.getSeconds();
                    
                    // Formata a data e hora
                    const dataFormatada = `${dia}/${mes}/${ano}`;
                    const horaFormatada = `${horas}:${minutos}`;
                    
                    // Imprime na console
                    user.conversations[index].messages = user.conversations[index].messages.concat({ text: result, isUser: false, time: horaFormatada, data: dataFormatada });

                    await user.save();
                    return res.status(200).json({
                        resposta: result
                    });
                }

            }
        }

    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
});
// =====> FIM DO CONTROLLER PROMPTCHAT.....

// ====> Controller para receber as messagens do code java...
exports.codeJava = (async (req, res, next) => {
    try {


        const chat = new CustomAI();
        req.body.pop();
        req.body.splice(0, req.body.length - 1);
        const user = await User.findById({ _id: req.params.id });
        const question = req.body[0].text;
        
        for (let index = 0; index < user.code.length; index++) {
            const element = user.code[index]._id.toString();

            if (element === req.params.message_id) {
                user.code[index].messages = user.code[index].messages.concat(req.body);
                const question = req.body[0].text;
                let promptInit = `Faça o código em ${user.code[index].code}, unicamente em ${user.code[index].code}. Por favor, inclua comentários e comece sempre o código com \`\`\`${user.code[index].code}. Obedeça aos seguintes detalhes: `;
                if (user.code[index].code === 'javascript') {
                    promptInit = `Faça o código em javascript para P5.js, unicamente em javascript para P5.js. Por favor, inclua comentários e comece sempre o código com \`\`\`javascript. Obedeça aos seguintes detalhes: `;
                    
                }
                else if (user.code[index].code === 'c') {
                    promptInit = `Faça o código em usando a linguagem C para o microcontolador arduino, unicamente em usando a linguaguem C para arduino. Por favor, inclua comentários e comece sempre o código com \`\`\`c. Obedeça aos seguintes detalhes: `;
                    
                }
                else {
                    promptInit = `Faça o código em ${user.code[index].code}, unicamente em ${user.code[index].code}. Por favor, inclua comentários e comece sempre o código com \`\`\`${user.code[index].code}. Obedeça aos seguintes detalhes: `;
                }
              
                await chat.generateData(promptInit + question)
                    .then(async result => {
                        
                        const javaCodeBlocks = extractJavaCodeBlocks(user.code[index].code, result);
                        if (javaCodeBlocks.length === 0) {
                            console.log('array vazio');
                        } else {
                            const dataAtual = new Date();

                            // Obtém os componentes da data
                            const dia = dataAtual.getDate();
                            const mes = dataAtual.getMonth() + 1; // Os meses começam em 0
                            const ano = dataAtual.getFullYear();
                            
                            // Obtém os componentes da hora
                            const horas = dataAtual.getHours();
                            const minutos = dataAtual.getMinutes();
                            // const segundos = dataAtual.getSeconds();
                            
                            // Formata a data e hora
                            const dataFormatada = `${dia}/${mes}/${ano}`;
                            const horaFormatada = `${horas}:${minutos}`;
                            
                            // Imprime na console
        
                            user.code[index].messages = user.code[index].messages.concat({ text: javaCodeBlocks[0], isUser: false, time: horaFormatada, data: dataFormatada  });                    // await user.save();
                            await user.save();
                        }
                        

                        return res.status(200).json({
                            resposta: result
                        })
                    })
            }
        }
    } catch (error) {
        return res.status(404).json(error);
    }
});
// ====> FIM DO CONTROLLER....

exports.codeJavaChat = (async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        user.code = user.code.concat(req.body);
        await user.save();
        const chat = user.code;
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(404).json({
            error: error
        })
    }
});

exports.getHistoryJavaChat = (async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        return res.status(200).json(
            user.code
        )
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
});

// Listar todos os produtos do banco de dados.
exports.getAll = (async (req, res, next) => {
    let arrayUser = [];
    const user = await  User.find()
        .then(data => { 
            for (let index = 0; index < data.length; index++) {
                arrayUser.push(data[index].name)
                
            }
            res.status(200).send({
                data: arrayUser,
                request: {
                    tipo: "GET",
                    descricao: "",
                    url: url
                }
            })
        }
        )
        .catch(error =>
            res.status(200).send({
                message: "Ocorreu um erro ao listar os produtos.",
                versao: "0.0.01",
                request: {
                    tipo: "GET",
                    descricao: "",
                    url: url
                }
            })
        );

  

});



// Listar a user do banco de dados.
exports.getUser = (async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.params.id });

        return res.status(200).json(user);
    } catch (error) {
        return res.status(200).json({ error })

    }

});

// ===> user beaer token
exports.returnUserProfile = async (req, res, next) => {
    await res.json(req.decoded);
}



exports.conversations = (async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        user.conversations = user.conversations.concat(req.body);
        await user.save();
        const chat = user.conversations;
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(400).json({ error: error })
    }
});

exports.getHistoryChat = (async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        return res.status(200).json(
            user.conversations
        )
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
});

exports.whatsappWeb_connect = (async (req, res, next) => {

    const user = await User.findByIdAndUpdate({ _id: req.body._id });

    const addons = {
        app: 'whatsapp',
        installed: true,
        model: 'cv',
        status: "edit",
    };
    user.addons = addons;
    user.save();
    console.log('saved to edit...')
    return res.status(200).json(user.addons)

});

exports.whatsappWeb_install = (async (req, res, next) => {
    try {
        const parent2 = myRoot();

        const nomeNovaPasta = req.body._id;
        const urlRepositorio = 'https://github.com/AngeloAc/WWBEBJS.git';
        const openApi_token = process.env.OPENAI_API_OI;
        const mongo_api_token = process.env.MONGO_CONNECT_URI;

        //-----
        const nomeArquivo = 'index.js';
        const linhaEspecifica = 18; // Número da linha onde você deseja adicionar o parágrafo
        const novoParagrafo = `const porta = normalizePort(process.env.PORT || ${req.body.porta});\nconst id= '${req.body._id}';`;
        //-----

        console.log(nomeNovaPasta);
        console.log(novoParagrafo);
        console.log(parent2);
        // Verificar se a pasta já existe
        fs.access(parent2 + '/' + req.body._id, fs.constants.F_OK, async (err) => {
            if (err) {
                console.log('pasta nao existe...')

            } else {
                console.log("Pasta ja existe...");

                // Acessar a pasta criada
                process.chdir(parent2 + '/' + nomeNovaPasta);

                console.log(`Acessou a pasta "${nomeNovaPasta}"`);

                // Clonar o código do repositório
                exec(`git clone ${urlRepositorio}`, async (err, stdout, stderr) => {
                    if (err) {
                        console.error(`Erro ao clonar o repositório: ${err.message}`);
                        return;
                    }
                    console.log('Repositório clonado com sucesso!');

                    // Acessar a pasta do repositório clonado
                    const nomePastaRepositorio = urlRepositorio.split('/').pop().replace('.git', '');
                    process.chdir(nomePastaRepositorio);
                    console.log(`Acessou a pasta "${nomePastaRepositorio}"`);
                    console.log(process.cwd());


                    // Executar "npm install"
                    // exec('npm install', async (err, stdout, stderr) => {
                    // console.log('Installing npm')
                    // if (err) {
                    //     console.error(`Erro ao executar "npm install": ${err.message}`);
                    //     return;
                    // }
                    // console.log('Comando "npm install" executado com sucesso!');

                    //     //--------
                    await fs.readFile(nomeArquivo, 'utf8', (err, data) => {
                        if (err) {
                            console.error(`Erro ao ler o arquivo "${nomeArquivo}": ${err.message}`);
                            return;
                        }

                        const linhas = data.split('\n');
                        if (linhaEspecifica > linhas.length) {
                            console.error(`A linha específica não existe no arquivo "${nomeArquivo}".`);
                            return;
                        }

                        linhas.splice(linhaEspecifica - 1, 0, novoParagrafo);
                        const novoConteudo = linhas.join('\n');

                        fs.writeFile(nomeArquivo, novoConteudo, 'utf8', (err) => {
                            if (err) {
                                console.error(`Erro ao escrever o arquivo "${nomeArquivo}": ${err.message}`);
                                return;
                            }
                            console.log('Parágrafo adicionado com sucesso na linha específica!');
                        });
                    });
                    // -----------
                    // fs.writeFile('.env',
                    //     `MONGO_CONNECT_URI=${{mongo_api_token}},
                    //     OPENAI_API_OI=${{openApi_token}},`,
                    //     'utf8', (err) => {
                    //         if (err) {
                    //             console.error(`Erro ao escrever o arquivo "${nomeArquivo}": ${err.message}`);
                    //             return;
                    //         }
                    //         console.log('.env adicionado com sucesso!');
                    //     });
                    // //--------
                    // FILE TESTE TO DO WHATSAPP ....

                    // Caminho do arquivo
                    // const filePath = 'node_modules/whatsapp-web.js/src/Client.js';

                    // Conteúdo a ser adicionado
                    // const novoConteudo = `const INTRO_IMG_SELECTOR = 'div[role=\'textbox\']';`;
                    // const novoConteudo = 'const INTRO_IMG_SELECTOR = \'div[role=\\\'textbox\\\']\';';

                    // Lê o arquivo
                    // fs.readFile(filePath, 'utf8', (err, data) => {
                    //     if (err) {
                    //         console.error(`Erro ao ler o arquivo: ${err.message}`);
                    //         return;
                    //     }

                    //     // Divide o conteúdo em linhas
                    //     const linhas = data.split('\n');

                    //     // Verifica se a linha 175 existe
                    //     if (linhas.length < 175) {
                    //         console.error(`A linha 175 não existe no arquivo.`);
                    //         return;
                    //     }

                    //     // Remove o conteúdo da linha 175
                    //     linhas.splice(174, 1);

                    //     // Adiciona o novo conteúdo na linha 175
                    //     linhas.splice(174, 0, novoConteudo);

                    //     // Junta as linhas de volta em um único texto
                    //     const novoConteudoCompleto = linhas.join('\n');

                    //     // Escreve o novo conteúdo de volta no arquivo
                    //     fs.writeFile(filePath, novoConteudoCompleto, 'utf8', (err) => {
                    //         if (err) {
                    //             console.error(`Erro ao escrever o arquivo: ${err.message}`);
                    //             return;
                    //         }
                    //         console.log('Conteúdo removido e novo conteúdo adicionado com sucesso na linha 175.');
                    //     });
                    // });


                    // END FILE TESTE TO DO WHATSAPP....
                    // Executar o código clonado

                    // exec('node index', (err, stdout, stderr) => {
                    //     console.log('node exec');
                    //     if (err) {
                    //         console.error(`Erro ao executar o código: ${err.message}`);
                    //         return;
                    //     }
                    //     console.log('Código executado com sucesso!');
                    //     console.log('Saída do código:');

                    // });

                    const user = await User.findByIdAndUpdate({ _id: req.body._id });

                    const addons = {
                        app: 'whatsapp',
                        installed: true,
                        model: 'business',
                        status: "connect",
                    };
                    user.addons = addons;
                    user.save();
                    return res.status(200).json(addons)
                    // });
                });
            }
        })


    } catch (error) {
        res.status(404).json({
            error: error
        })
    }
});



exports.whatsappWeb_addonsUpadate = (async (req, res, next) => {

    try {
        const parent2 = myRoot();
        const nomeNovaPasta = req.params.id;
        // Acessar a pasta criada
        process.chdir(parent2 + '/' + nomeNovaPasta);


        process.chdir('WWBEBJS');
        console.log(`Acessou a pasta`);
        console.log(process.cwd());

        const user = await User.findByIdAndUpdate({ _id: req.params.id });

        const addons = {
            status: req.body.status,
        };
        user.addons = addons;
        user.save();
        console.log('Estado: ' + user.addons);




        // Executar o código clonado


        exec('node index', (err, stdout, stderr) => {
            console.log('node exec');
            if (err) {
                console.error(`Erro ao executar o código: ${err.message}`);
                return;
            }
            console.log('Código executado com sucesso!');
            console.log('Saída do código:');

        });

        return res.status(200).json(addons)

    } catch (error) {
        res.status(404).json({
            error: error
        })
    }
});


exports.uploadImageVariation = (async (req, res, next) => {

    try {
        if (!req.file) {
            return res.status(400).send('Nenhum arquivo foi enviado.');
          }
     
         const i = await variationImage(req.file.path);
       
        return res.status(200).json({
            image: i
        })
    } catch (error) {
        
        return res.status(400).json(error);
    }
   
});


exports.deleteConversation = (async (req, res, next) => {
    try {
        
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId });
        const conversationID = req.body.conversationID
        // Encontrar o índice da conversa que você deseja deletar
        const conversationIndex = user.conversations.findIndex((conversation) => {
            return conversation._id.toString() === conversationID; // Supondo que você tenha o ID da conversa que deseja deletar no corpo da requisição
        });
    
        // Verificar se a conversa foi encontrada
        if (conversationIndex !== -1) {
            // Remover a conversa do array
            user.conversations.splice(conversationIndex, 1);
    
            // Salvar as alterações no banco de dados
            await user.save();
    
            // console.log(`Conversa com ID foi deletada com sucesso.`);
            return res.status(200).json({ message: "Conversa deletada com sucesso." });
        } else {
            // console.log(`Conversa com ID não encontrada.`);
            return res.status(404).json({ message: "Conversa não encontrada." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar a conversa." });
    }
    
});

exports.deleteCode = (async (req, res, next) => {
    
    try {
        
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId });
        const conversationID = req.body.conversationID
        
        // Encontrar o índice da conversa que você deseja deletar
        const conversationIndex = user.code.findIndex((conversation) => {
            
            return conversation._id.toString() === conversationID; // Supondo que você tenha o ID da conversa que deseja deletar no corpo da requisição
        });
    
        // Verificar se a conversa foi encontrada
        if (conversationIndex !== -1) {
            // Remover a conversa do array
            user.code.splice(conversationIndex, 1);
    
            // Salvar as alterações no banco de dados
            await user.save();
    
            // console.log(`Conversa com ID foi deletada com sucesso.`);
            return res.status(200).json({ message: "Conversa deletada com sucesso." });
        } else {
            // console.log(`Conversa com ID não encontrada.`);
            return res.status(404).json({ message: "Conversa não encontrada." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao deletar a conversa." });
    }
    
});

