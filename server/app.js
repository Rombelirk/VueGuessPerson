import bodyParser from 'body-parser';
import router from "./router";
import expressSession from "express-session";
import express from "express"
import httpAuth from "http-auth"
import base from "./middleware/baseAuth"

export const session = expressSession({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});

export const app = express();

// todo path.resolve
app.use(express.static(__dirname + "/../../dist"));
app.use(httpAuth.connect(base));

app.use(session);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", router);
