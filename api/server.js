const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const server=express()

server.use(express.json());
server.use(helmet());
server.use(morgan());
server.use(cors());

server.get('/',(req,res) =>{
    res.status(200).json({message:'Hello World!'})
    .catch(err=>{
        res.send(err.message).json({message:'Unable to get API at this time'})
    
    })
})

module.exports = server;