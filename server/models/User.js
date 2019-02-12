const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
     login: String, 
     password: String,
     player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;