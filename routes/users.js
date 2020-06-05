const auth = require('../middleware/auth');//authorization
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  /users/me:
 *      get:
 *          description: Use to decode from Authorization token, send in header users _id and username.
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                type: string
 *                required: true
 *          tags:
 *              - users
 *          responses:
 *              200:
 *                  description: Returns JSON body with user's _id and username decoded from jwt token.
 *              400:
 *                  description: Token in header was invalid.
 *              401:
 *                  description: No token was provided. 
 */
router.get('/me', auth, async (req, res) =>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


/**
 * @swagger
 *  /users/:
 *      post:
 *          description: Register a new user in database with his username and password.
 *          parameters:
 *              - in: body
 *                name: User's credentials.
 *                description: Try to register a new user with this parameters. Username is string between 5 and 50 charachters. Password is string between 5 and 255 characters.
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
 *              - users
 *          responses:
 *              200:
 *                  description: New user was successfuly registered
 *              400:
 *                  description: Problem with new user parameters. Either there was a problem in request body or user with one of these parameters already exists.
 */
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send('User with this username already exists.'); 

    user = new User(_.pick(req.body, ['username', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user, ['_id', 'username']));
});

module.exports = router;
