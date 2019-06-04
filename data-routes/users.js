const router = require('express').Router();
const db = require('../data/dbConfig.js');

router.get('/:id', (req,res)=>{
    db('users')
    .where({id:req.params.id})
    .first()
    .then(user=>{
        if(user){
        db('projects')
        .where({user_id:req.params.id})
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

module.exports=router