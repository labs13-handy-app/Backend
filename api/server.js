const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const server = express();

const registerRouter = require('../auth-route/register.js');
const projectRouter = require('../data-routes/projects.js');

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use(cors());

<<<<<<< HEAD
server.use('/register',registerRouter);
server.use('/projects',projectRouter);
=======
server.use('/register', registerRouter);
>>>>>>> master

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!!' });
});

module.exports = server;
