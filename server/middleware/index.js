const bodyParser = require('body-parser');
const router = require("../router");
const io = require("../socket");
const {app} = require("../server");
const session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
const sharedsession = require("express-socket.io-session");

app.use(session);
io.use(sharedsession(session, {
    autoSave: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", router);