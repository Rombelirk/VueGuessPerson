import express from 'express';
import { User } from "./models/User";
import { getQuestions, getUser } from "./socketHandlers/controllers";
import Person from "./models/Person"
import isAuthenticated from "./middleware/isAuthenticated";
import Player from "./models/Player";
import io from "./socket";
import path from "path"

const router = express.Router();

router.get("/init", isAuthenticated, async (req, res) => {
    if (req.session && req.session.login) {

        const user = await getUser(req.session.userId);
        const questions = await getQuestions(user);

        return res.send({
            code: 0,
            message: "found",
            user: { login: req.session.login },
            player: user.player,
            questions
        });
    }

    return res.send({
        code: 1,
        message: "Unauthenticated"
    })
});


router.post("/signup", (req, res) => {
    User.find({ username: req.body.login }).then(function (response) {
        if (response.length > 0) {
            res.send("User with such name already exists");
            res.end();
        } else {
            const newPlayer = new Player({});
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
        res.end();
    })

})

router.post("/upload", async (req, res) => {
    try {
        if (!req.files)
            return res.send({ message: 'No files were uploaded.', code: 1 });
        let sampleFile = req.files.image;
        console.log(sampleFile)
        sampleFile.mv("images/" + sampleFile.name, async err => {
            if (err) {
                return res.send({ message: err.message, code: 1 });
            }

            const newPerson = new Person({
                name: req.body.name,
                wikiUrl: req.body.wikiUrl,
                image: sampleFile.name
            });

            await newPerson.save();
            return res.send({ message: "Person saved", code: 0 });
        });
    } catch (err) {
        return res.send({ message: err.message, code: 1 });
    }
})

router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
})
router.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
})
router.get("/upload", isAuthenticated, (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
})

export default router;
