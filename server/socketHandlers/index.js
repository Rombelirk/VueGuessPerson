import Game from "../models/Game";
import Person from "../models/Person";
import Question from "../models/Question";
import {User} from "../models/User";
import {getUser, getQuestions} from "./controllers";
import mongoose from "mongoose";

export default (io) => {
    io.on('connection', socket => {

        socket.on("disconnect", () => {
            socket.disconnect();

            io.emit('playersCountChanged', {
                playersCount: io.engine.clientsCount,
            });
        });

        io.emit('playersCountChanged', {
            playersCount: io.engine.clientsCount,
        });

        socket.on("startNewGame", async () => {
            const game = await Game.findOne({ user: socket.handshake.session.userId });
            if (game) {
                return socket.emit("errorOccurred", "This user already has an open game!");
            }

            try {
                const person = await Person.random();
                const newGame = new Game({
                    person: person._id || null,
                    user: socket.handshake.session.userId,
                    currentQuestion: null
                });

                const user = await User.findById(socket.handshake.session.userId);
                const savedGame = await newGame.save();
                user.player.currentGame = savedGame._id;

                await user.save();
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
                    closed: false,
                    answeredYes: 0,
                    answeredNo: 0,
                    answeredTotal: 0,
                    answeredDontKnow: 0,
                    whoAnswered: []
                });

                game.currentQuestion = question._id;

                const session = await mongoose.startSession();
                await session.startTransaction();
                await question.save();
                await game.save();
                await session.commitTransaction();

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
                });

                const user = await getUser(socket.handshake.session.userId);
                const questions = await getQuestions(user);

                socket.emit("newQuestions", questions);
            } catch (error) {
                socket.emit("errorOccurred", error.message)
            }
        });

        socket.on("closeQuestion", async gameId => {
            //todo: Rewrite this, duplicated game query
            try {
                const game = await Game.findById(gameId);

                if (game.currentQuestion) {
                    const question = await Question.findById(game.currentQuestion);
                    question.closed = true;
                    await question.save();
                    game.history.push(game.currentQuestion);
                    game.currentQuestion = null;
                }
                await game.save();
                const populatedGame = await Game.findById(gameId).populate('history')
                socket.emit("updateGame", populatedGame);
            } catch (error) {
                socket.emit("errorOccurred", error.message)
            }

        });

        socket.on("changeFinalAnswer", async value => {
            try {
                const suggestedPersons = await Person.find({
                    "name": {
                        "$regex": value,
                        '$options': 'i'
                    }
                });
                socket.emit("suggestedPersons", suggestedPersons)
            } catch (error) {
                socket.emit("errorOccurred", error.message)
            }
        });

        socket.on("sendFinalAnswer", async personId => {
            try {
                const user = await getUser(socket.handshake.session.userId);
                if (!(user && user.player && user.player.currentGame)) {
                    return socket.emit("errorOccurred", "User not found or doesn't have current game")
                }

                if (!user.player.currentGame.person.equals(personId)) {
                    return socket.emit("finalAnswerIncorrect");
                }
                // todo: find out how to rebuild db structure to avoid this multiple nulling
                const game = await Game.findOne({ user: socket.handshake.session.userId });
                game.user = null;
                game.save();
                user.player.currentGame = null;
                await user.save();

                socket.emit("finalAnswerCorrect");

            } catch (error) {
                socket.emit("errorOccurred", error.message)
            }
        });
    });

}

