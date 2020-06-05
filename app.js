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

//swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Angry Nerds Testownik API',
            description: 'API dla testownika działającego na plikach JSON',
            version: '1.0',
            // contact: {
            //     "name": "Filip Gajewski, współtwórca API",
            //     "email": "filipgajewski4@gmail.com"
            // },
            servers: ["http://localhost:8080"]
        }
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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