import http from 'http';
import mongoose from 'mongoose';
import config from "../config";
import socketIo from "socket.io";
import sharedsession from "express-socket.io-session";
import bodyParser from 'body-parser';
import expressSession from "express-session";
import express from "express"
import httpAuth from "http-auth"
import path from "path";
import base from "./middleware/baseAuth"
import router from "./router";
import handlers from "./socketHandlers";

export const session = expressSession({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

export const app = express();

app.use(express.static(path.resolve(__dirname, "../../dist")));
app.use(httpAuth.connect(base));

app.use(session);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);

const server = http.Server(app);
export const io = socketIo(server);
io.use(sharedsession(session, {
    autoSave: true
}));

handlers(io);


const PORT = 3000;

mongoose
    .connect(`mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}/${config.dbName}`, { useNewUrlParser: true })
    .then(() => {
        console.log("mongoose is up");

        server.listen(PORT, () => {
            console.log(`started on port ${PORT}`);
        });

    })
    .catch(err => console.log("ERROR:", err));
