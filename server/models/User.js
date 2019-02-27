import {Schema, model} from 'mongoose';
import {PlayerSchema} from "./Player";

export const UserSchema = new Schema({
    login: String,
    password: String,
    player: PlayerSchema
});

export const User = model('User', UserSchema);

