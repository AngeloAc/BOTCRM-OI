const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { Chroma } = require("langchain/vectorstores/chroma");
const { OpenAI } = require("langchain/llms/openai");
const { ConversationalRetrievalQAChain } = require("langchain/chains");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { TextLoader } = require("langchain/document_loaders/fs/text");
require('dotenv').config();


class CustomAI {
    constructor() {
        this.openAIApiKey = process.env.OPENAI_API_OI;
        // this.CHUNK_SIZE = CHUNK_SIZE;
        // this.DOC = DOC;
        this.modelName = "gpt-3.5-turbo";
        this.language = "pt";
        this.temperature = 1;
        this.fileContents = 
        this.fileLoader = new TextLoader('bin/file.txt');



        this.model = new OpenAI({
            modelName: this.modelName,
            openAIApiKey: this.openAIApiKey,
            temperature: this.temperature,
            language: this.language // Defina o idioma para português
        });

    }

    async generateData(prompt) {
            
            // Carrega o arquivo PDF
            //const pdfLoader = new PDFLoader("factura.pdf");
            //const pdfContent = await pdfLoader.load();

            // Carrega o arquivo TXT
            
            // const fileContents = await this.fileLoader.load();

            // const embeddings = new OpenAIEmbeddings({ openAIApiKey: this.openAIApiKey, language: "pt" });
            // const vectorDB = await Chroma.fromDocuments(fileContents, embeddings, {});
            // const qa = ConversationalRetrievalQAChain.fromLLM(this.model, vectorDB.asRetriever(), {
            //     language: "pt"
            // });
 
            // const question = prompt;
            // const result = await qa.call({ question, chat_history: "" });

            // if (result.text === "I don't know." || result.text === "Eu não sei.") {
                // Se a pergunta não estiver no PDF, usa o modelo OpenAI diretamente para responder
                const openAIResult = await this.model.call(prompt);
                return openAIResult;
           
            // } else {
            //     console.log(result.text);
            //     return result.text;
               
            // }
    }
}


module.exports = { CustomAI }



