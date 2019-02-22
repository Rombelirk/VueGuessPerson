import io from "../socket";
import Game from "../models/Game";
import Person from "../models/Person";
import Question from "../models/Question";
import { User } from "../models/User";
import { getUser, getQuestions } from "./controllers";

io.on('connection', socket => {

    socket.on("disconnect", () => {
        socket.disconnect();
        io.emit('playersCountChanged', {
            playersCount: io.engine.clientsCount,
        });
    })

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

            const user = await User.findById(socket.handshake.session.userId)
            const savedGame = await newGame.save();
            user.player.currentGame = savedGame._id;
            const savedUser = await user.save();
            await Game.populate(savedGame, [{ path: "person" }, { path: "user", select: '_id' }]);
            socket.emit('gameStarted', {
                game: savedGame
            });
        } catch (error) {
            socket.emit("errorOccurred", error.message)
        }
    });

    socket.on("newQuestion", async data => {
        const game = await Game.findOne({ user: socket.handshake.session.userId });
        if (!game) {
            return socket.emit("errorOccurred", "The User hasn't start a game yet.");
        }

        if (game.currentQuestion) {
            return socket.emit("errorOccurred", "The User already has an open question.");
        }

        try {
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

            // simultaneously
            await Promise.all([
                question.save(),
                game.save()
            ]);

            socket.emit("questionAccepted", {
                text: question.text,
                answeredYes: question.answeredYes,
                answeredNo: question.answeredNo
            });

            await Question.populate(question, { path: "person" });

            socket.broadcast.emit('newQuestionAsked', {
                _id: question._id,
                text: question.text,
                person: question.person
            });

        } catch (error) {
            socket.emit("errorOccurred", error.message)
        }
    });

    socket.on("answerQuestion", async answer => {
        const question = await Question.findById(answer.id);
        if (!question) {
            return socket.emit("errorOccurred", "No question found.");
        }
        const hasUserAlreadyAnsweredThisQuestion = await question.whoAnswered
            .some(user => user.equals(socket.handshake.session.userId));

        if (hasUserAlreadyAnsweredThisQuestion) {
            return socket.emit("errorOccurred", "The player has already answered this question.");
        }
        ++question.answeredTotal;
        try {
            question.whoAnswered.push(socket.handshake.session.userId);
            if (answer.answer === "yes") {
                ++question.answeredYes
            } else if (answer.answer === "no") {
                ++question.answeredNo
            }

            await question.save();

            const populatedQuestion = await Question.populate(question, { path: "game", select: "user" })
            const askerId = populatedQuestion.game.user;
            const sockets = io.sockets.sockets;

            Object.keys(sockets).forEach(socketId => {
                let sock = sockets[socketId];
                if (askerId.equals(sock.handshake.session.userId)) {
                    io.to(`${socketId}`).emit('updateAnswers', question);
                }
            })

            const user = await getUser(socket.handshake.session.userId);
            const questions = await getQuestions(user);

            socket.emit("newQuestions", questions);
        } catch (error) {
            socket.emit("errorOccurred", error.message)
        }
    });

    socket.on("closeQuestion", async gameId => {
        //todo: Rewrite this!!!
        try {
            const game = await Game.findById(gameId);
            console.log(game.currentQuestion)
            if (game.currentQuestion) {
                game.history.push(game.currentQuestion);
                game.currentQuestion = null;
            }
            await game.save();
            const populatedGame = await Game.findById(gameId).populate('history')
            socket.emit("updateGame", populatedGame);
        } catch (error) {
            socket.emit("errorOccurred", error.message)
        }

    })

    socket.on("error", error => {
        console.log("error handling");
        socket.emit("errorOccurred", error.message);
    });
});
