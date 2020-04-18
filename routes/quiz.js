const auth = require('../middleware/auth');//authorization
const _ = require('lodash')
const express = require('express');
const router = express.Router();

const User = require('../models/user').User;
const {Result, validate} = require('../models/quiz');

router.post('/result', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');


    let result = new Result({
        userId: req.user._id,
        quizName: req.body.quizName,
        time: req.body.time,
        singleQuestionRepeat: req.body.singleQuestionRepeat,
        wrongAnswers: req.body.wrongAnswers,
        correctAnswers: req.body.correctAnswers
    });

    const {error} = validate(result)
    if(error) return res.status(400).send(error.details[0].message);

    await result.save();

    res.send(_.pick(result, ['_id']));
});

module.exports = router;