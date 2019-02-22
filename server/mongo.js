import mongoose from 'mongoose';

mongoose.connect('mongodb://mongo/test', { useNewUrlParser: true })
    .catch(err => console.log("ERROR:", err));

    