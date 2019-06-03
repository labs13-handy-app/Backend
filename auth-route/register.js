const router = require('express').Router();
const jwtDecode=require('jwt-decode')
const db = require('./register-model.js');

router.post('/', async (req, res) => {
  try{

  const token=req.headers.authorization

  if(req.headers && req.headers.authorization && token) {

  const userToken = token.replace(/Bearer /g, '');

  const decode=jwtDecode(userToken)

  const user={
    email:decode.email,
    name:decode.name
  }

  const foundUser = await db.getUserByName(name);
  if (!foundUser) {
    // if the user doesn't exist create a user object that reflect the database schema.
    const newUser = {
      name: name,
      nickname,
      email: email,
    };
  
    const data = await db.addUser(newUser);
        res.status(201).json(data);
      } else {
       
        res.status(200).json(foundUser);
      }
    } else {
  
      res.status(400).json({errorMessage: 'Invalid Credentials!'});
    }
    
    }catch(err){
      res.send(err.message).json({message:'unable to sign up'})
      
    }
    });



module.exports=router