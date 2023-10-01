const ChatModel = require('../models/chatModel');

const createChat = async (req, res, next)=>{
    const { firstId, secondId } = req.body;
    try {
        const chat = await ChatModel.findOne({
            membros: {$all: [firstId, secondId]}
        });
        if(chat) return res.status(200).json(chat);
        const newChat = new ChatModel({
            membros: [firstId, secondId]
        })
        const response = await newChat.save();

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json(error);
    }
};

const findUserChats = async (req, res, next)=>{
    const userId = req.params.userId

    try {
        const chats = await ChatModel.find({
            membros: {$in: [userId]}
        });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json(error)
    }
}

const findChat = async (req, res, next)=>{
    const { firstId, secondId } = req.params

    try {
        const chat = await ChatModel.find({
            membros: {$all: [firstId, secondId]}
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = { createChat, findUserChats, findChat};