import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    currentGame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }
})

const Player = mongoose.model('Player', PlayerSchema);
export default Player;