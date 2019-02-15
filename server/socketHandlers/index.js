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
        const question = new Question({ game: game._id, text: data.question, person: game.person });
        game.currentQuestion = question._id;
        await question.save();
        await game.save();
    });


});