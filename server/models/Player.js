import {Schema, model} from 'mongoose';

export const PlayerSchema = new Schema({
    currentGame: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }
});

export default model('Player', PlayerSchema);
