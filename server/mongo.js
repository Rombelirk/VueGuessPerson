import mongoose from 'mongoose';
import config from "../config";
mongoose.connect(config.dbUrl, { useNewUrlParser: true })
.catch(err => console.log("ERROR:", err));