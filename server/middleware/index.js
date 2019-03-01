import bodyParser from 'body-parser';
import router from "../router";
import io from "../socket";
import { app } from "../server";
import sharedsession from "express-socket.io-session";
import expressSession from "express-session";
import express from "express"
import fileUpload from 'express-fileupload';
import path from "path"
import httpAuth from "http-auth" 
import base from "./baseAuth"

const session = expressSession({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

app.use(fileUpload());

app.use(express.static(__dirname+"/../../dist"));
app.use(express.static(__dirname+"/../../images"));

app.use(httpAuth.connect(base));

app.use(session);
io.use(sharedsession(session, {
    autoSave: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);
