const router = require('express').Router();
const jwtDecode = require('jwt-decode');
const db = require('./register-model.js');
const jwChecks = require('../middleware/jwtChecks.js');
const restricted = require('../config/restricted-middleware.js');
// const secrets = require('../config/secret.js');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (req.headers && req.headers.authorization && token) {
      const userToken = token.replace(/Bearer /g, '');

      const decode = jwtDecode(userToken);

      const user = {
        email: decode.name,
        nickname: decode.nickname
      };

      const foundUser = await db.getUserByName(user.nickname);

      if (foundUser) {
        res.status(200).json({foundUser});
      } else {
        // if the user doesn't exist create a user object that reflect the database schema.
        // const newUser = {
        //   nickname: user.nickname,
        //   email: user.email
        // };

        const data = await db.addUser(user);
        // res.status(201).json(user);
        const foundUser = await db.getUserById(data.id);
        res.status(200).json(foundUser);
      }
    } else {
      res.status(400).json({errorMessage: 'Invalid Credentials!'});
    }
  } catch (err) {
    console.log(err.message);
    res.send(err.message).json({message: 'Unable to sign up'});
  }
});

module.exports = router;
