const jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');

const secrets = require('./secret.js');

function restricted(req, res, next) {
  const auth = req.headers.authorization;
  const userToken = auth.replace(/Bearer /g, '');

  if (!userToken) {
    res.status(401).json({message: 'You must be logged in to see that.'});
  } else {
    const token = jwtDecode(userToken);
    req.decodedJwt = token;
    next();
  }
}

module.exports = restricted;
