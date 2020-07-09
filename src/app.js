require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');
const addresses = require('./addresses');

const app = express();

const morgOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morgOption));
app.use(cors());
app.use(helmet());

app.get('/', (req,res) => {
  res.status(200).send('Hello Boilerplate');
});

app.get('/address', (req,res) => {
  res.json(addresses);
});

app.post('/address', express.json(), (req,res) => {
  const {
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip} = req.body;

  let response={
    id:100,
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

  res.status(201).send(response);
});

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