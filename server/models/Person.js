const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PersonSchema = new Schema({
    name: String,
    image: String,
    wikiUrl: String
})

PersonSchema.statics.random = async function () {
    const count = await this.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const randomDoc = await this.findOne().skip(rand);
    return randomDoc;
};


const Person = mongoose.model('Person', PersonSchema);
module.exports = Person;