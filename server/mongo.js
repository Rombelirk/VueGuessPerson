import mongoose from 'mongoose';
import config from "../config";
mongoose.connect(`mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}/${config.dbName}`, { useNewUrlParser: true })
.catch(err => console.log("ERROR:", err));

// 'mongodb://mongo/test'