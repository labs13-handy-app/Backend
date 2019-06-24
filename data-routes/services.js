const router = require('express').Router();
const db = require('../data/dbConfig.js');
const jwtChecks = require('../middleware/jwtChecks.js');
const restricted = require('../config/restricted-middleware.js');

router.get('/', jwtChecks, restricted, async (req, res) => {
  try {
    const services = await db('services').select('*');
    res.status(200).json(services);
  } catch ({message}) {
    console.log(message);
    res.status(500).json({message});
  }
});

router.get('/:id', jwtChecks, restricted, async (req, res) => {
  try {
    const service = await db('services')
      .where({id: req.params.id})
      .first();
    if (!service) {
      res.status(404).json({
        errorMessage: `Service with ID ${req.params.id} doesn't exist.`
      });
    } else {
      res.status(200).json({service});
    }
  } catch ({message}) {
    console.log(message);
    res.status(500).json({message});
  }
});

module.exports = router;
