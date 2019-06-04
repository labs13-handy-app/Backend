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
      source: req.body.token || 'tok_amex'
    });

    if (customer) {
      const foundUser = await db.getUserByName(name);
      foundUser.stripe_id = customer.id;
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

// router.post('/', async (req, res) => {
//   try {
//     // Creating a charge method that returns a stripe charges object.
//     const charge = async (token = source, amount, description, customer) => {
//       return await stripe.charges.create({
//         source,
//         amount: amount * 100,
//         description,
//         customer,
//         currency: 'usd'
//       });
//     };

//     // Processing the payment from the request body.
//     const payment = await charge(
//       req.body.token.id,
//       req.body.amount,
//       req.body.description,
//       customer.id
//     );

//     if (!payment) {
//       // Error if payment is null
//       res
//         .status(400)
//         .json({errorMessage: `Couldn't process payment, missing information!`});
//     } else {
//       // Success
//       res.status(200).json({message: 'Payment successful.', payment});
//     }
//   } catch (e) {
//     console.log(e.message);

//     res.status(500).json({
//       errorMessage: 'Purchase Failed'
//     });
//   }
// });

module.exports = router;
