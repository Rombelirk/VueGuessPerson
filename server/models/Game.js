import {Schema, model} from 'mongoose';

const GameSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'Person'
    },
    currentQuestion: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    history: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
});

export default model('Game', GameSchema);
