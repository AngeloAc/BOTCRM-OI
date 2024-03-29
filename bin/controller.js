const openai = require('./config');
const fs = require('fs');
const { OpenAI } = require('langchain/llms/openai');






const model = new OpenAI({
    modelName: 'gpt-3.5-turbo', // Defaults to "text-davinci-003" if no model provided.
    temperature: 0.9,
    openAIApiKey: process.env.OPENAI_API_OI, // In Node.js, defaults to process.env.OPENAI_API_KEY
});


function normalizeDocuments(docs) {
    return docs.map((doc) => {
        if (typeof doc.pageContent === "string") {
            return doc.pageContent;
        }
        else if (Array.isArray(doc.pageContent)) {
            return doc.pageContent.join("\n");
        }
    })
}

// async function main() {
//     console.log('Loading docs...');
//     //Carrega o arquivo TXT
//     const fileLoader = new TextLoader('bin/files/file.txt');
//     const fileContents = await fileLoader.load();
//     console.log("Docs loaded...")
//     console.log(fileContents)
//     const VECTOR_STORE_PATH = "bin/files/";
//     const question = "tell me about these documents."

//     let vectorStore;

//     console.log("Checking for existing path");
//     // if(fs.existsSync(VECTOR_STORE_PATH)){
//     //     console.log("Loading existing vector path...");
//     //     vectorStore = await HNSWLib.load(
//     //         VECTOR_STORE_PATH,
//     //        await new OpenAIEmbeddings(
//     //             {timeout: 1000,
//     //                 openAIApiKey: process.env.OPENAI_API_OI, // In Node.js, defaults to process.env.OPENAI_API_KEY
//     //             }
//     //         )
//     //     );
//     //     console.log("VECTOR STORE LOADING....");
//     // }

// }

// main().catch((error) => {
//     console.error(error);
// });



const generateMeta = async (title) => {

    try {

        const description = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: "user",
                    content: `${title}`
                },
            ],
            max_tokens: 500
        });
        return description.data.choices[0].message.content;

    } catch {
        return null;
    }


}


const generateImage = async (desc) => {
    const image = await openai.createImage({
        prompt: desc,
        n: 1,
        size: '512x512'
    });

    return image.data.data[0].url;
}


const variationImage = async (imagePath) => {
    const image = await openai.createImageVariation(
        fs.createReadStream(imagePath),
        1,
        
    );

    return image.data.data[0].url;
}

const editImage = async () => {
    
}


const audioTotext = async (data) => {
    const transcript = await openai.createTranscription(
        fs.createReadStream('audio.mp3'),
        "whisper-1"
    );

    console.log(transcript.data.text);
}

module.exports = { generateMeta, generateImage, audioTotext, variationImage, editImage };