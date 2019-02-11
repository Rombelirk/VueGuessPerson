const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo/test', { useNewUrlParser: true })
    .catch(err => console.log("ERROR:", err));

    // mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true })
    // .catch(err => console.log("ERROR:", err)).then(res => console.log("ok"));

    