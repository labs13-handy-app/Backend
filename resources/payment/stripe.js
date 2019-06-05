const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const jwtChecks = require('../../middleware/jwtChecks.js');
const restricted = require('../../config/restricted-middleware.js');
const db = require('../../auth-route/register-model.js');

router.post('/new-customer', jwtChecks, restricted, async (req, res) => {
  try {
    const user = req.decodedJwt;
    const {name: email, nickname: name} = user;

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
    const user = req.decodedJwt;
    const {name: email, nickname: name} = user;
    const foundUser = await db.getUserByName(name);

    if (!foundUser) {
      res.status(404).json({errorMessage: `User doesn't exist!`});
    } else {
      let {stripe_id: customer, balance} = foundUser;
      balance = Math.floor(balance * 100);
      const charge = await stripe.charges.create({
        amount: balance,
        description: `Charge for ${foundUser.name}`,
        customer,
        currency: 'usd'
      });

      balance = 0;
      foundUser.balance = balance;
      const updatedUser = await db.updateUser(foundUser.id, foundUser);
      res.status(201).json({message: 'Purchase was successfull'});
    }
  } catch (e) {
    res.status(500).json({
      errorMessage: 'Purchase Failed'
    });
  }
});

module.exports = router;
