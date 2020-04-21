const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const auth = require('./routes/auth');
const users = require('./routes/users');
const home = require('./routes/home');
const quiz = require('./routes/quiz');
const connection = require('./db');

const cors = require('cors');
const config = require('config');
const express = require('express');
const app = express();

if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

connection();

app.use(express.json());
app.use(cors())
app.use('/', home);
app.use('/users', users);
app.use('/auth', auth);
app.use('/quiz', quiz);

const port = 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});