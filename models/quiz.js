const Joi = require('joi');
const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    quizName: {
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true,
    },
    time: {
        type: Number,
        required: true
    },
    singleQuestionRepeat: {
        type: Number,
        required: true
    },
    wrongAnswers: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    } 
});

const Result = mongoose.model('Result', quizResultSchema);

function validateResult(result){
    const schema = {
        quizName: Joi.string().min(1).max(100).required(),
        time: Joi.number().required(),
        singleQuestionRepeat: Joi.number().required(),
        wrongAnswers: Joi.number().required(),
        correctAnswers: Joi.number().required()
    }

    return Joi.validate(result, schema);
}

exports.Result = Result;
exports.validate = validateResult;