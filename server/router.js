var express = require('express');
var router = express.Router();
const User = require("./models/User");
const isAuthenticated = require("./middleware/isAuthenticated")

router.get("/init", isAuthenticated, (req, res) => {
    if (req.session && req.session.login) {
        res.send({
            code: 0,
            message: "found",
            user: {login: req.session.login}
        });
    } else {
        res.send({
            code: 1,
            message: "Unauthenticated"
        })
    }
})

router.post("/signup", isAuthenticated, (req, res) => {
    User.find({ username: req.body.login }).then(function (response) {
        if (response.length > 0) {
            res.send("Пользователь с таким именем уже существует");
            res.end();
        } else {
            const newUser = new User({ login: req.body.login, password: req.body.password });
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
    User.find({ login, password }).then(function (response) {

        if (response.length > 0) {
            req.session.login = login;
            res.send({
                code: 0,
                message: "found",
                user: response[0]
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

module.exports = router;