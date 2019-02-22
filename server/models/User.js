import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const PlayerSchema = new Schema({
    currentGame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }
})

export const UserSchema = new Schema({
    login: String,
    password: String,
    player: PlayerSchema
})

export const User = mongoose.model('User', UserSchema);

