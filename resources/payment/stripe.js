const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const jwtChecks = require('../../middleware/jwtChecks.js');
const restricted = require('../../config/restricted-middleware.js');
const db = require('../../auth-route/register-model.js');

router.post('/new-customer', jwtChecks, restricted, async (req, res) => {
  try {
    const {name: email, nickname: name} = req.decodedJwt;

    // Creating a new customer
    const customer = await stripe.customers.create({
      email,
      name,
      description: `New customer account for ${email}`,
      source: req.body.token || 'tok_visa',
      balance: req.body.balance
    });

    if (customer) {
      const foundUser = await db.getUserByName(name);
      foundUser.stripe_id = customer.id;
      foundUser.balance = customer.balance;
      const editedUser = await db.updateUser(foundUser.id, foundUser);
      res.status(200).json({message: `New customer successfully created!`});
    } else {
      res.status(400).json({errorMessage: 'Please provide an email & a name!'});
    }
  } catch (e) {
    res
      .status(500)
      .json({errorMessage: `Server error couldn't create customer!`});
  }
});

router.post('/charge', jwtChecks, restricted, async (req, res) => {
  try {
    // Get the user from the auth0 decoded token.
    const foundUser = await db.getUserByName(req.decodedJwt.nickname);

    if (!foundUser) {
      // If user not found send a 404 error.
      res.status(404).json({errorMessage: `User doesn't exist!`});
    } else {
      // Charge the user if exist.

      // Get the stripeToken from the Stripe form in the front-end.
      const source = req.body.stripeToken;

      // Get the stripeEmail from the Stripe form in the front-end.
      const {stripeEmail: receipt_email} = req.body;

      // Get the user balance from the users table in the database.
      let {balance} = foundUser;

      // Change the balance to cents to work with the Stripe API.
      balance = balance * 100;

      // Create the new charge.
      const charge = await stripe.charges.create({
        amount: balance,
        description: `Charge for ${foundUser.name}`,
        currency: 'usd',
        receipt_email,
        source
      });

      // Reset the balance to 0 after charge is processed and assign it back to the user  object.
      balance = 0;
      foundUser.balance = balance;

      // Update the user balance in the database.
      const updatedUser = await db.updateUser(foundUser.id, foundUser);
      res.status(201).json({message: 'Purchase was successfull'});
    }
  } catch (e) {
    res.status(500).json({errorMessage: 'Purchase Failed'});
  }
});

router.post('/transfer', jwtChecks, restricted,  async (req, res) => {
  try {
    const foundUser = await db.getUserByName(req.decodedJwt.nickname);

    if (!foundUser) {
      res.status(404).json({errorMessage: `User doesn't exist!`});
    } else {
      const source = req.body.stripeToken;
      const {stripeEmail: receipt_email} = req.body;
      let {balance} = foundUser;
      balance = balance * 100;

      const transfer = await stripe.transfers.create({
        amount: balance,
        description: `Transfer for ${foundUser.name}`,
        currency: 'usd',
        destination:foundUser.payout_id,
        source_type:'card'
      });
      balance = 0;
      foundUser.balance = balance;

      const updatedUser = await db.updateUser(foundUser.id, foundUser);
      res.status(201).json({message: 'Transfer was successful'});
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
