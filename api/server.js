const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const server = express();

const registerRouter = require('../auth-route/register.js');
const projectRouter = require('../data-routes/projects.js');
const stripeRouter = require('../resources/payment/stripe.js');
const userRouter = require('../data-routes/users.js');
const bidsRouter = require('../data-routes/bids.js');

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use(cors());

server.use('/register', registerRouter);
server.use('/projects', projectRouter);
server.use('/api/checkout', stripeRouter);
server.use('/users', userRouter);
server.use('/bids', bidsRouter);

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!!' });
});

module.exports = server;
