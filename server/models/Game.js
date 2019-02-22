import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    currentQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }
    ]
})

const Game = mongoose.model('Game', GameSchema);

export default Game;