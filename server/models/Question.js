const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({ 
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    person : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    text: String, 
    answeredYes: Number, 
    answeredNo: Number, 
    answeredDontKnow: Number,
    answeredTotal: Number,
    whoAnswered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;