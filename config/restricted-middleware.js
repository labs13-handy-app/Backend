const jwt = require('jsonwebtoken');

const secrets = require('./secret.js');



function restricted(req, res, next){
const token=req.headers.authorization;

 jwt.verify(token,secrets.jwtSecret,(err,decodedToken)=>{
  if(err){
    res.status(401).json({message:'You must be logged in to see that.'})
  }else{
    req.decodedJwt=decodedToken;
    next();
  }
})
};

 module.exports=restricted