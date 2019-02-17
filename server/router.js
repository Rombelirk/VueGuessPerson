var express = require('express');
var router = express.Router();
const { User, PlayerSchema } = require("./models/User");
const isAuthenticated = require("./middleware/isAuthenticated");
const Player = require("./models/Player");
const Question = require("./models/Question")

router.get("/init", isAuthenticated, async (req, res) => {
    if (req.session && req.session.login) {
        const user = await User.findById(req.session.userId);
        await User.populate(user, {
            path: "player.currentGame",
            populate: [{
                path: 'currentQuestion',
                model: 'Question',
                select: ['text', 'answeredYes', 'answeredNo']
            }]
        });
        let questions;
        if (user.player && user.player.currentGame && user.player.currentGame._id) {
            questions = await Question.find({}).where("game").ne(user.player.currentGame._id);
        } else {
            questions = await Question.find({});
        }
        await Question.populate(questions, {
            path: 'person',
            model: 'Person'
        });

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
            res.send("Пользователь с таким именем уже существует");
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
    console.log("login")
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
                message: "Неверное имя пользователя или пароль"
            });
        }
        res.end();
    });
})

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.end()
    })
})

module.exports = router;