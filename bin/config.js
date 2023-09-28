// const dotenv = require('dotenv');

// dotenv.config();

// exports const config = {
//     openAI:{
//         apiToken: process.env.OPENAI_API_KEY
//     },
//     redis:{
//         host: process.env.REDIS_HOST || "localhost",
//         port: (process.env.REDIS_PORT) || 6379,
//         db: process.env.REDIS_DB || 0
//     }
// }

require('dotenv').config();
const OPENAI_API_OI="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"
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: OPENAI_API_OI,
});

const openai = new OpenAIApi(configuration);


module.exports = openai;