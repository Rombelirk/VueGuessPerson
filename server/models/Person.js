const mongoose = require('mongoose');

const Person = mongoose.model('Person', { name: String, image: String, wikiUrl: String });

module.exports = Person;