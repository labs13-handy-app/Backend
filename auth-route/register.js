const router = require('express').Router();
const db =require('../data/dbConfig.js')
const jwtDecode=require('jwt-decode')

router.post('/', (req, res) => {

  const token=req.headers.authorization

  const decode=jwtDecode(token)

  const user={
    email:decode.email,
    name:decode.name
  }

  db('users')
  .where(user.email)
  .then(res =>{
    if(user.email){
      res.status(200).json('You have logged in')
    }else{
      db('users')
      .insert(user)
    }
  })
  .catch(err=>{
      res.send(err.message).json({message:'unable to sign up'})
  })
})


module.exports=router