//authentication
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /auth/:
 *      post:
 *          description: Use to login a user. Request body has to contain neccessery parameters.
 *          parameters:
 *              - in: body
 *                name: User's credentials.
 *                description: Username is string between 5 and 50 charachters. Password is string between 5 and 255 characters
 *                schema:
 *                  type: object
 *                  required:
 *                      - username
 *                      - password
 *                  properties:
 *                      username:
 *                          type: string
 *                      password:
 *                          type: string      
 *          tags:
 *              - auth
 *          responses:
 *              200:
 *                  description: Returns JWT token with _id and username
 *              400:
 *                  description: It's returned in two cases. There was a validation error with request body or user pass invalid username or password
 */
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Invalid username or password.'); 

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid username or password.'); 

    const token = user.generateAuthToken();

    //res.send(token);
    res.send({token: token});
});

function validate(req){
    const schema = {
        username: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}


module.exports = router;