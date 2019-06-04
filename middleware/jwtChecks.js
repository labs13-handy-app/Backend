const expressjwt = require('express-jwt');
const jwks = require('jwks-rsa');

// Middleware that checks if there is an auth0 token type bearer in the req.headers.authorization issues by the appropriate auth0 account.
var jwtCheck = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-t67d1inm.auth0.com/.well-known/jwks.json'
  }),
  audience: 'C2qEif6X9XtPtOJEgwUbPLG3E3Tmgaro',
  issuer: 'https://dev-t67d1inm.auth0.com/',
  algorithms: ['RS256']
});

module.exports = jwtCheck;
