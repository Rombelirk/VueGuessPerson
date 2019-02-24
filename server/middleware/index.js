import bodyParser from 'body-parser';
import router from "../router";
import io from "../socket";
import { app } from "../server";
import sharedsession from "express-socket.io-session";
import expressSession from "express-session";
import express from "express"
import path from "path"
import cookieSession from "cookie-session"

app.set('trust proxy', 1) // trust first proxy

const session = cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  });

app.use(express.static(__dirname+"/../../dist"));

app.use(session);
io.use(sharedsession(session, {
    autoSave: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);
