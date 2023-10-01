const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const chatSchema = new Schema(
    {
    membros: Array,
    },
    {
        timestamps: true,
    }
);



const ChatModel = mongoose.model('Chat', chatSchema);
module.exports = ChatModel;