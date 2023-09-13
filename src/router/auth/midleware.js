const jwtoken = require('jsonwebtoken');
require('dotenv').config();

exports.checkToken = (req, res, next)=>{
    let token = req.headers["authorization"];
    token = token.slice(7, token.length);
    if(token){
        jwtoken.verify(token, process.env.TOKEN_KEY, (error, decoded)=>{
            
            if(error){
            return res.status(500).json({
                message: "Token Invalido."
            })
        }else{
            req.decoded = decoded;
            next();
        }
    }) 
    }
    else{
        return res.status(401).json({
            message: "Token Not Provided. Falha na authenticacao."
        })
    }
}


