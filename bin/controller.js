const openai = require('./config');
const fs = require('fs');

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

const audioTotext = async (data) => {
    const transcript = await openai.createTranscription(
        fs.createReadStream('audio.mp3'),
        "whisper-1"
    );

    console.log(transcript.data.text);
}

module.exports = { generateMeta, generateImage, audioTotext };