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
    time: Number,
    singleQuestionRepeat: Number,
    wrongAnswers: Number,
    correctAnswers: Number
});

const Result = mongoose.model('Result', quizResultSchema);

function validateResult(result){
    const schema = {
        quizName: Joi.string().min(1).max(100).required(),
        time: Joi.number(),
        wrongAnswers: Joi.number(),
        correctAnswers: Joi.number(),
        userId: Joi.ObjectId()
    }

    return Joi.validate(result, schema);
}

exports.Result = Result;
exports.validate = validateResult;