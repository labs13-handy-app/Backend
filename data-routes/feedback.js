const router = require('express').Router();
const db = require('../data/dbConfig.js');


router.post('/',(req, res) => {
    if (!req.body.reviewer_name||!req.body.title || !req.body.description || !req.body.contractor_id ){

        res.status(400).json({message:'In order to add feedback, you must provide your name , a title, and a description. '})
    }else{

    db('feedback')
    .insert(req.body,'id')
    .then(review =>{
      res.status(200).json(review)
    })

    .catch(err=>{
      res.status(500).json(err.message)
    })
}
  });

  router.get('/', (req, res) => {

    db('feedback')
    
    .then(reviews => {
      res.status(200).json(reviews);
      })

      .catch(err => res.send(err.message));
  });

  router.get('/:id', (req,res)=>{

    db('feedback')

    .where({id:req.params.id})

    .first()

    .then(review=>{
        if(review){
            res.status(200).json(review)
        }else{
          res.status(404).json({message:'The Feedback with the Specified ID does not exist'})
      }
    })
    .catch(err=>{
      res.status(500).json(err.message)
    })
    
    // returns the contractor by id with all of their reviews inside the array
})
router.get('/contractor/:id', (req, res) => {
  db('users')
    .where({id: req.params.id})
    .first()
    .then(user => {
      if (user) {
        db('feedback')
          .where({contractor_id: req.params.id})
          .then(reviews => {
            user.reviews = reviews;
            if(reviews.length>0){
            res.status(200).json(user);
            }else {
              res.status(404).json({message:'The specifed user has no reviews'})
            }
          });
      } else {
        res
          .status(404)
          .json({message: 'The User with the Specified ID does not exist'});
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: 'Unable to find the Specified User at this time.'
      });
    });
});

router.put('/:id', (req, res) => {

    db('feedback')

    .where({id:req.params.id})

    .update(req.body)

    .then(count=>{

      if (count>0) {
        res.status(200).json({message:`${count} review was updated`})
      
    }else{
        res.status(404).json({message:'the specified Feedback does not exist'})
      }
    })

    .catch(err =>{
      res.status(500).json(err.message)
    })
  });


  router.delete('/:id',(req, res) => {

    db('feedback')

    .where({id:req.params.id})

    .del()

    .then(count =>{

      if (count>0){
        res.status(200).json({message:`${count} Review was deleted`})
      
    }else{
        res.status(400).json({message:'the specified Feedback does not exist'})
      }
    })

    .catch(err =>{
      res.status(500).json(err.message)
    })
  });

  module.exports = router