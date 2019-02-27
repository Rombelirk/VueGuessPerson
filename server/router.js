import express from 'express';
import { User } from "./models/User";
import { getQuestions, getUser } from "./socketHandlers/controllers";
import isAuthenticated from "./middleware/isAuthenticated";
import {io} from "./server";

const router = express.Router();

router.get("/init", isAuthenticated, async (req, res) => {
    const { session: { userId, login }} = req;

    // TODO if user not found?
    // TODO cast to number?
    const user = await getUser(userId);
    const questions = await getQuestions(user);

    return res.send({
        code: 0,
        message: "found",
        user: {
            login,
        },
        player: user.player,
        questions
    });
});

router.post("/signup", async(req, res) => {
    const { body: { login, password }} = req;
    const response = await User.find({ username: login });
    if (response.length > 0) {
        return res.send("User with such name already exists")
    }

    // todo secure passwords
    const newUser = new User({
        login: login,
        password: password,
        player: {
            currentGame: null
        }
    });

    await newUser.save();
    return res.send({
        code: 0,
        message: "Created"
    });
});

router.post("/login", async(req, res) => {
    const { login, password } = req.body;

    const response = await User.find({ login, password });
    if (response.length === 0) {
        return res.send({
            code: 1,
            message: "Invalid username or password"
        });
    }

    const user = response.shift();
    req.session.login = login;

    // todo _id always exists?
    req.session.userId = user ? user._id : 0;

    return res.send({
        code: 0,
        message: "found",
        user,
    });
});

router.get("/logout", async(req, res) => {
    const sockets = io.sockets.sockets;
    Object.keys(sockets).forEach(key => {
        const socket = sockets[key];
        // todo strict equal?
        if (socket.handshake.session.userId == req.session.userId) {
            socket.emit("disconnect");
        }
    });

    req.session.destroy();
    return res.end();
});

router.get("/", (req, res) => {
    return res.sendFile(__dirname + '/../dist/index.html');
});

export default router;
