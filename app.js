const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const users = require('./routes/users');
const home = require('./routes/home');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/testownik')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/', home);
app.use('/users', users);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});