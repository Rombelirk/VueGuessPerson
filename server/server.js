import http from 'http';
import mongoose from 'mongoose';
import config from "../config";
import {app, session} from "./app";
import socketIo from "socket.io";
import sharedsession from "express-socket.io-session";

export const server = http.Server(app);
export const io = socketIo(server);
io.use(sharedsession(session, {
    autoSave: true
}));

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
