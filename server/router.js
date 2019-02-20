var express = require('express');
var router = express.Router();
const { User, PlayerSchema } = require("./models/User");
const {getQuestions, getUser} = require("./socketHandlers/controllers")
const isAuthenticated = require("./middleware/isAuthenticated");
const Player = require("./models/Player");
const Question = require("./models/Question");
const io = require("./socket")

router.get("/init", isAuthenticated, async (req, res) => {
    if (req.session && req.session.login) {
        const user = await getUser(req.session.userId);
        const questions = await getQuestions(user);
        res.send({
            code: 0,
            message: "found",
            user: { login: req.session.login },
            player: user.player,
            questions
        });
    } else {
        res.send({
            code: 1,
            message: "Unauthenticated"
        })
    }
})

router.post("/signup", (req, res) => {
    User.find({ username: req.body.login }).then(function (response) {
        if (response.length > 0) {
            res.send("User with such name already exists");
            res.end();
        } else {
            const newPlayer = new Player({});
            newPlayer.save().catch(err => console.log(err));
            const newUser = new User({ login: req.body.login, password: req.body.password, player: { currentGame: null } });
            newUser.save().then(() => {
                res.send({
                    code: 0,
                    message: "Created"
                });
                res.end();
            });
        }
    });
})

router.post("/login", (req, res) => {
    const { login, password } = req.body;
    User.find({ login, password }).then(result => {
        if (result.length > 0) {
            req.session.login = login;
            req.session.userId = result[0]._id
            res.send({
                code: 0,
                message: "found",
                user: result[0]
            });
        } else {
            res.send({
                code: 1,
                message: "Invalid username or password"
            });
        }
        res.end();
    });
})

router.get("/logout", (req, res) => {
    const sockets = io.sockets.sockets;
    for (let socketId in sockets) {
        let sock = sockets[socketId];
        if (sock.handshake.session.userId == req.session.userId) {
            sock.emit('disconnect');
        }
    }
    req.session.destroy(() => {
        res.end()
    })
})

module.exports = router;