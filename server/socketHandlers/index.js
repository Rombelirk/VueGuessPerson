const io = require("../socket");
const guessPerson = require("../index");
const Game = require("../models/Game");
const Person = require("../models/Person");
const Question = require("../models/Question");
const { User } = require("../models/User");

io.on('connection', socket => {


    io.emit('playersCountChanged', {
        playersCount: io.engine.clientsCount,
    });

    socket.on("startNewGame", async () => {
        try {
            const game = await Game.findOne({ user: socket.handshake.session.userId });
            if (game) {
                throw new Error("This User already have an open game!")
            }

            const person = await Person.random()
            const newGame = new Game({
                person: person._id || null,
                user: socket.handshake.session.userId,
                currentQuestion: null
            });
            //
            const user = await User.findById(socket.handshake.session.userId)
            const savedGame = await newGame.save();
            user.player.currentGame = savedGame._id;
            const savedUser = await user.save();
            await Game.populate(savedGame, [{ path: "person" }, { path: "user", select: '_id' }]);
            socket.emit('gameStarted', {
                game: savedGame
            });
        } catch (err) {
            socket.emit('gameStarted', {
                game: err.message
            });
        }
    });


    socket.on("newQuestion", async data => {
        const game = await Game.findOne({ user: socket.handshake.session.userId });
        if (!game) {
            throw new Error("The User hasn't start a game yet.");
        };
        if (game.currentQuestion) {
            throw new Error("The User already has an open question.");
        }
        const question = new Question({
            game: game._id,
            text: data.question,
            person: game.person,
            answeredYes: 0,
            answeredNo: 0,
            answeredTotal: 0,
            answeredDontKnow: 0,
            whoAnswered: []
        });
        game.currentQuestion = question._id;
        await question.save();
        await game.save();
        socket.emit("questionAccepted", {
            text: question.text,
            answeredYes: question.answeredYes,
            answeredNo: question.answeredNo
        });
        await Question.populate(question, {path: "person"})
        socket.broadcast.emit('newQuestionAsked', {
            _id: question._id,
            text: question.text,
            person: question.person
        });
        
    });

    socket.on("answerQuestion", async answer => {
        console.log(answer)
        const question = await Question.findById(answer.id);
        if (answer.answer === "yes") {
            ++question.answeredYes
            ++question.answeredTotal
        } else if (answer.answer === "no") {
            ++question.answeredNo
            ++question.answeredTotal
        }
        await question.save();

        const populatedQuestion = await Question.populate(question, { path: "game", select: "user" })
        const askerId = populatedQuestion.game.user;
        const sockets = io.sockets.sockets;
        for (var socketId in sockets) {
            var sock = sockets[socketId];
            console.log("found", sock.handshake.session.userId, askerId, sock.handshake.session.userId == askerId)
            if (sock.handshake.session.userId == askerId) {
                io.to(`${socketId}`).emit('updateAnswers', question);
            }
        }
    })


});