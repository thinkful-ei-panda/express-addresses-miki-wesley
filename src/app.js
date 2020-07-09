require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');
const addresses = require('./addresses');
const { v4: uuid } = require('uuid');

const app = express();

const morgOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morgOption));
app.use(cors());
app.use(helmet());

const validateBearerToken = (req, res, next) => {
  const bearerToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  if(!bearerToken) {
    return res.status(401).send('Missing bearer token')
  };

  if(bearerToken.split(' ')[1] === apiToken) {
      next()
  } else {
      return res.status(401).send('Unauthorized user')
  };
};

app.get('/', (req,res) => {
  res.status(200).send('Hello Boilerplate');
});

app.get('/address', (req,res) => {
  res.json(addresses);
});

app.post('/address', validateBearerToken, express.json(), (req,res) => {
  const {
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip } = req.body;

  let response={
    id: uuid(),
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip
  };

  if(!firstName){
    return res.status(400).send('Address must include firstName');
  }

  if(!lastName){
    return res.status(400).send('Address must include lastName');
  }

  if(!address1){
    return res.status(400).send('Address must include address1');
  }

  if(!city){
    return res.status(400).send('Address must include city');
  }

  if(!state){
    return res.status(400).send('Address must include state');
  }

  if(!zip){
    return res.status(400).send('Address must include zip');
  }

  if(state.length!==2){
    return res.status(400).send('Please enter a valid 2 letter state code');
  }

  if(zip.length!==5 || Number(zip)<10000 || Number(zip)>99999){
    return res.status(400).send('Please enter a valid 5 digit zip code');
  }

  addresses.push(response);

  res.status(201).send(response);
});

app.delete('/address/:id', validateBearerToken, (req, res) => {
  const { id } = req.params;
  const index = addresses.findIndex(address => address.id === id);

  if(index === -1) {
    return res.status(400).send('ID not found')
  }

  addresses.splice(index, 1);

  res.status(204).end();
})

app.use(function errorHandler(error,req,res,next){ //eslint-disable-line
  let response;
  if(NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  }else{
    console.log(error);
    response = {message: error.message, error};
  }
  res.status(400).json(response);
});

module.exports = app;