import mongoose from 'mongoose';
import config from "../config";

const dbAuth = process.env.NODE_ENV === "production" ? `${config.dbUser}:${config.dbPassword}@` : "";

mongoose.connect(`mongodb://${dbAuth}${config.dbHost}/${config.dbName}`, { useNewUrlParser: true })
.catch(err => console.log("ERROR:", err));

// 'mongodb://mongo/test'