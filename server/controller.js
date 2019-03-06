import {getQuestions, getUser} from "./socketHandlers/controllers";
import {User} from "./models/User";
import {io} from "./server";
import Person from "./models/Person";

export const init = async (req, res) => {
    const { session: { userId, login }} = req;

    // TODO if user not found?
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
};

export const signUp = async(req, res) => {
    const { body: { login, password }} = req;
    const response = await User.find({ login: login });
    if (response.length > 0) {
        return res.send({
            code: 1,
            message: "User with such name already exists"
        });
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
};

export const signIn = async(req, res) => {
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
};

export const logout = async(req, res) => {
    const sockets = io.sockets.sockets;

    // todo rewrite without loop
    Object.keys(sockets).forEach(key => {
        const socket = sockets[key];
        if (socket.handshake.session.userId === req.session.userId) {
            socket.emit("disconnect");
        }
    });

    req.session.destroy();
    return res.end();
};

export const upload = async(req, res) => {
    try {
        if (!req.files) {
            return res.send({message: 'No files were uploaded.', code: 1});
        }

        let sampleFile = req.files.image;
        // TODO promisify
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

    }
    catch (err) {
        return res.send({ message: err.message, code: 1 });
    }
};
