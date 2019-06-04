const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

router.post('/', async (req, res) => {
  try {
    // Creating a new customer
    const customer = await stripe.customers.create({
      email: req.body.email,
      card: req.body.card
    });

    // Creating a charge method that returns a stripe charges object.
    const charge = async (token = source, amount, description, customer) => {
      return await stripe.charges.create({
        source,
        amount: amount * 100,
        description,
        customer,
        currency: 'usd'
      });
    };

    // Processing the payment from the request body.
    const payment = await charge(
      req.body.token.id,
      req.body.amount,
      req.body.description,
      customer.id
    );

    if (!payment) {
      // Error if payment is null
      res
        .status(400)
        .json({errorMessage: `Couldn't process payment, missing information!`});
    } else {
      // Success
      res.status(200).json({message: 'Payment successful.', payment});
    }
  } catch (e) {
    console.log(e.message);

    res.status(500).json({
      errorMessage: 'Purchase Failed'
    });
  }
});

module.exports = router;
