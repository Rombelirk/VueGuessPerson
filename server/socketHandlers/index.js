const io = require("../socket");
const guessPerson = require("../index");
const Game = require("../models/Game");
const Person = require("../models/Person");
const Question = require("../models/Question");

io.on('connection', socket => {
    // guessPerson.newPlayerOnline({ id: socket.handshake.session.userId })
    


    io.emit('playersCountChanged', {
        playersCount: io.engine.clientsCount,
    });

    socket.on("startNewGame", () => {
        Game.findOne({ user: socket.handshake.session.userId })
            .then(result => {
                if (!result) {
                    return result;
                }
                throw new Error("This User already have an open game!")
            })
            .then(() => {
                return Person.findOne({})
            })
            .then(result => {
                const newGame = new Game({
                    person: result._id,
                    user: socket.handshake.session.userId,
                    currentQuestion: null
                });
                return newGame.save()

            })
            .then((game) => {
                return Game.populate(game, [{ path: "person" }, { path: "user", select: '_id' }])
            })
            .then(result => {
                console.log(result)
                socket.emit('gameStarted', {
                    game: result
                });
            })
            .catch(err => {
                console.log(err.message)
                return socket.emit('gameStarted', {
                    game: err.message
                });
            })









    });

    socket.on("newQuestion", data => {
        const question = new Question({asker: socket.handshake.session.userId, text: data.question});
        question.save();
    });

    // socket.on("disconnect", () => {
    //     guessPerson.playerGoneOffline(socket.handshake.session.userId)
    //     io.emit('playersCountChanged', {
    //         playersCount: guessPerson.playersCount,
    //     });
    // });
});