import mongoose from 'mongoose';

// mongoose.connect('mongodb://roma:qwerty123@ds155164.mlab.com:55164/testing', { useNewUrlParser: true })
//     .catch(err => console.log("ERROR:", err));

mongoose.connect('mongodb://mongo/test', { useNewUrlParser: true })
.catch(err => console.log("ERROR:", err));