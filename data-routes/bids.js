const router = require('express').Router();
const db = require('../data/dbConfig.js');

router.post('/',(req, res) => {
    if (!req.body.project_id||!req.body.price || !req.body.time || !req.body.contractor_id || !req.body.materials_included ){

        res.status(400).json({message:'In order to add a new Bid, you must provide a Project it belongs to , your price, the amount of time it will take, and if materials are included or not. '})
    }else{

    db('bids')
    .insert(req.body,'id')
    .then(bid =>{
      res.status(200).json(bid)
    })

    .catch(err=>{
      res.status(500).json(err.message)
    })
}
  });

router.get('/', (req, res) => {

    db('bids')
    
    .then(bids => {
      res.status(200).json(bids);
      })

      .catch(err => res.send(err.message));
  });

  router.get('/:id', (req,res)=>{

    db('bids')

    .where({id:req.params.id})

    .first()

    .then(bid=>{
        if(bid){
            res.status(200).json(bid)
        }else{
          res.status(404).json({message:'The Bid with the Specified ID does not exist'})
      }
    })
    .catch(err=>{
        res.status(500).json({error:err,message:'Unable to find the Specified Bid at this time.'})
    })
})

router.put('/:id', (req, res) => {

    db('bids')

    .where({id:req.params.id})

    .update(req.body)

    .then(count=>{

      if (count>0) {
        res.status(200).json({message:`${count} Bid was updated`})
      
    }else{
        res.status(404).json({message:'the specified Bid does not exist'})
      }
    })

    .catch(err =>{
      res.status(500).json(err.message)
    })
  });

  router.delete('/:id',(req, res) => {

    db('bids')

    .where({id:req.params.id})

    .del()

    .then(count =>{

      if (count>0){
        res.status(200).json({message:`${count} Bid was deleted`})
      
    }else{
        res.status(400).json({message:'the specified Bid does not exist'})
      }
    })

    .catch(err =>{
      res.status(500).json(err.message)
    })
  });





module.exports=router