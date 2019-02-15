const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    currentGame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }
})

const UserSchema = new Schema({
    login: String,
    password: String,
    player: PlayerSchema
})

const User = mongoose.model('User', UserSchema);

module.exports = {User, PlayerSchema};