import {Schema, model} from 'mongoose';

const PersonSchema = new Schema({
    name: String,
    image: String,
    wikiUrl: String
});

PersonSchema.statics.random = async function () {
    const count = await this.countDocuments();
    const rand = Math.floor(Math.random() * count);
    return this.findOne().skip(rand);
};

export default model('Person', PersonSchema);
