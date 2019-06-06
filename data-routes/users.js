const router = require('express').Router();
const db = require('../data/dbConfig.js');
const secrets=require('../config/secret.js')
const jwt =require('jsonwebtoken')

router.get('/:id', (req,res)=>{
    db('users')
    .where({id:req.params.id})
    .first()
    .then(user=>{
        if(user){
        db('projects')
        .where({homeowner_id:req.params.id})
        .then(projects=>{
          user.projects=projects;
          res.status(200).json(user)
        })
      }else{
          res.status(404).json({message:'The User with the Specified ID does not exist'})
      }
    })
    .catch(err=>{
        res.status(500).json({error:err,message:'Unable to find the Specified User at this time.'})
    })
})

router.put('/:id', (req, res) => {

    db('users')

    .where({id:req.params.id})

    .update(req.body)

    .then(user=>{
      const token=generateToken(user)
      if (user) {
        res.status(200).json({token})
      
    }else{
        res.status(404).json({message:'the specified User does not exist'})
      }
    })

    .catch(err =>{
      res.status(500).json(err.message)
    })
  });

  function generateToken(user){
    const payload={
        subject: user.id,
        name:user.nickname,
        account_type:user.account_type,
        stripe_id:user.strpe_id,
        payout_id:user.payout_id,
        email:user.email
    };
    const options={
        expiresIn:'1h'
    };
        return jwt.sign(payload, secrets.jwtSecret, options)
    }

module.exports=router