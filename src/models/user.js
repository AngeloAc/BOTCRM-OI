const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const schema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    email: {
        type: String,
        // required: true,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
    },
    country:{ type: String, default: 'Angola' },
    countryCode: { type: String, default: '+244'},
    language: { type: String, default: 'Portugues' },
    telefone: { type: Number, required: true, },
    plano: { type: String, default: 'Free' },
    saldo: { type: String, default: '0' },
    expire: {type: String, default: '01 de Novembro 2023'},
    isWhatsappActive: {type: Boolean, default: true},
    porta: {
        type: String,
    },
    addons: [
        {
            app: { type: String},
            installed: { type: Boolean, default: false },
            model: { type: String, default: 'business' },
            status: { type: String, default: 'install' },
            userNumber: { type: String, default: null},
            userName: {type: String, default: null},
        }
    ],
    script:[
        {
            title: { type: String, default: null },
            text: { type: String, default: null }
        }
    ]
    ,
    conversations:[
        {
            name: { type: String, default: null },
            description: {type: String, default: null},
            messages: [{
                text: {type: String, default:null},
                isUser: { type: Boolean },
                time: { type: String },
                data: { type: String }            
            }],
            avatar: { type: String, default: 'src/assets/img/robo.jpg' },
            lastMessage:{type: String},
        }
    ]
    ,
    code:[
        {   
            name: { type: String, default: null },
            code: { type: String, default: null },
            description: {type: String, default: null},
            messages: [{
                text: {type: String, default:null},
                isUser: { type: Boolean },
                time: { type: String },
                data: { type: String }  
            }],
            lastMessage:{type: String},
        }
    ],
    codeStatus:{ type: String, default: true },
    tokens:[
        {
            token: { type: String, required: true }
        }
    ],   
},
    {
        timestamps: true,
        collection: 'users'
    }
);

// Methodo responsavel por fazer o hash da senha antes que seja savo no database.
schema.pre('save', async function(next) {
    const user = this;
    
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// vai gerar uma authenticação para o token...
schema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign(
        {
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            porta: user.porta, 
            country: user.country, 
            countryCode: user.countryCode,
            telefone: user.telefone,
            plano: user.plano,
            saldo: user.saldo,
            expire: user.expire,
            language: user.language,
            codeStatus: user.codeStatus,
            isWhatsappActive: user.isWhatsappActive,
        }, 
        process.env.TOKEN_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
    
};
// schema.statics.findByCredentials = async (email, password)=>{
//     const user = await User.findOne({ email });
//     if(!user){
//         throw new Error({error: "Login Invalido."})
        
//     }
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if(!isPasswordMatch){
//         throw new Error({ error: "Login Invalido." })
//     }
//     return user;
// }


schema.statics.findByCredentials = async (telefone, password)=>{
    const user = await User.findOne({ telefone });
    if(!user){
        throw new Error({error: "Login Invalido."})
        
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
        throw new Error({ error: "Login Invalido." })
    }
    return user;
}
const User = mongoose.model('Users', schema);
module.exports = User;