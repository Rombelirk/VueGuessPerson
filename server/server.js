import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import config from "../config";

export const app = express();
export const server = http.Server(app);

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
