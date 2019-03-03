import {Schema, model} from 'mongoose';

const QuestionSchema = new Schema({
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
    person : {
        type: Schema.Types.ObjectId,
        ref: 'Person'
    },
    closed: Boolean,
    text: String,
    answeredYes: Number,
    answeredNo: Number,
    answeredDontKnow: Number,
    answeredTotal: Number,
    whoAnswered: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    loginOfAsker: String
});

export default model('Question', QuestionSchema);
