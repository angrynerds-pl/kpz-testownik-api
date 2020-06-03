const auth = require('../middleware/auth');//authorization
const _ = require('lodash')
const express = require('express');
const router = express.Router();

const User = require('../models/user').User;
const {Result, validate} = require('../models/quiz');

/**
 * @swagger
 *  /quiz/result/:
 *      post:
 *          description: Use to save user's result after complete a quiz.
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                description: User's JWT token.
 *                type: string
 *                required: true
 *              - in: body
 *                name: Quiz result.
 *                description: "Quiz result consits of 6 required parameters and optional quiz resolved date.\nQuiz name is a string between 1 and 100 characters.\nTime, singleQuestionRepeat, numberOfQuestions, wrongAnswers and correctAnswers are int.\nIf date is no provided the API uses current datetime."
 *                schema:
 *                  type: object
 *                  required:
 *                      - quizName
 *                      - time
 *                      - singleQuestionRepeat
 *                      - numberOfQuestions
 *                      - wrongAnswers
 *                      - correctAnswers
 *                  properties:
 *                      quizName:
 *                          type: string  
 *                      time:
 *                          type: number  
 *                      singleQuestionRepeat:
 *                          type: number  
 *                      numberOfQuestions:
 *                          type: number  
 *                      wrongAnswers:
 *                          type: number  
 *                      correctAnswers:
 *                          type: integer  
 *                      date:
 *                          type: string  
 *          tags:
 *              - quiz
 *          responses:
 *              200:
 *                  description: Quiz result was successfuly saved in the database.
 *              400:
 *                  description: Either token or request body was invalid. 
 */
router.post('/result', auth, async (req, res) => {

    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    let result = new Result({
        userId: req.user._id,
        quizName: req.body.quizName,
        time: req.body.time,
        singleQuestionRepeat: req.body.singleQuestionRepeat,
        numberOfQuestions: req.body.numberOfQuestions,
        wrongAnswers: req.body.wrongAnswers,
        correctAnswers: req.body.correctAnswers,
        date: req.body.date
    });

    await result.save();

    res.send(_.pick(result, ['_id']));
});

/**
 * @swagger
 *  /quiz/id/{:id}:
 *      get:
 *          description: Use to login a user
 *          tags:
 *              - quiz
 */
router.get('/id/:id', auth, async (req, res) => {//quiz name via id e.g. http://localhost:8080/quiz/id/5eb8612d63c7f658d8aa66a3
    try{
        const selectedResult = await Result.findOne({ _id: req.params.id , userId: req.user._id });
        if (!selectedResult) return res.status(404).send('Quiz with given ID was not found'); //404
        res.send(_.pick(selectedResult, ['quizName']));
    }
    catch(ex){
        res.status(500).send('Cannot get name of quiz via selected id.');//internal server error
    }
    
});

/**
 * @swagger
 *  /quiz/enrolled/:
 *      get:
 *          description: Use to login a user
 *          tags:
 *              - quiz
 */
router.get('/enrolled', auth, async (req, res) => {// Zwraca nazwy kursow ze wszystkich podejsc
    try{
        var allQuizes = await (Result.find({userId: req.user._id})); 
        if (!allQuizes) return res.status(404).send('Quiz with given ID was not found'); //404
        allQuizes= _.uniqBy(allQuizes,'quizName');//usuniecie powtorek nazwy
         //  res.send(_.toArray(allQuizes));//taka piękna linijka <3, zwraca dane ze wszystkich podejsc*
        // znalezione na stacku, szukac po dokumentacji lodash'a, zamiast quizName moze byc np '_id'
        var mapped = _.map(allQuizes, _.partialRight(_.pick, ['quizName']));
        res.send(mapped);
    }
    catch(ex){
        res.status(500).send('Cannot get names of completed quizes');//internal server error
    }

});

/**
 * @swagger
 *  /quiz/stats/{:quizName}:
 *      get:
 *          description: Use to login a user
 *          tags:
 *              - quiz
 */
router.get('/stats/:quizName', auth, async (req, res) => {//Jak zdefiniowac ten route? zwraca podejscia z kursów
    try{
        var allQuizes = await (Result.find({quizName: req.params.quizName ,userId: req.user._id})); 
        if (!allQuizes) return res.status(404).send('Quiz with given ID was not found or no tests enrolled yet');   
        res.send(_.toArray(allQuizes));//taka piękna linijka <3, zwraca dane ze wszystkich podejsc*
    }
    catch{
        res.status(500).send('Cannot get stats of selected quiz');//internal server error
    }

});


module.exports = router;