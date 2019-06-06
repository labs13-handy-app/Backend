const router = require('express').Router();
const db = require('../data/dbConfig.js');
const userDb = require('../auth-route/register-model.js');
const jwChecks = require('../middleware/jwtChecks.js');
const restricted = require('../config/restricted-middleware.js');

router.get('/', jwChecks, restricted, async (req, res) => {
  try {
    const users = await userDb.getUser();
    res.status(200).json(users);
  } catch (e) {
    res
      .status(500)
      .json({errorMessage: `Server error couldn't retrieve users!`});
  }
});

router.get('/:id', jwChecks, restricted, async (req, res) => {
  db('users')
    .where({id: req.user.id})
    .first()
    .then(user => {
      if (user) {
        db('projects')
          .where({homeowner_id: req.params.id})
          .then(projects => {
            user.projects = projects;
            res.status(200).json(user);
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
  db('users')
    .where({id: req.params.id})
    .update(req.body)

    .then(count => {
      if (count > 0) {
        res.status(200).json({message: `${count} Project was updated`});
      } else {
        res.status(404).json({message: 'the specified Proect does not exist'});
      }
    })

    .catch(err => {
      res.status(500).json(err.message);
    });
});

module.exports = router;
