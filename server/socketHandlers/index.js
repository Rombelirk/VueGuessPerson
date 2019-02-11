const io = require("../socket");
const guessPerson = require("../index");

io.on('connection', socket => {
    guessPerson.newPlayerOnline({ id: socket.handshake.session.userId })
    io.emit('playersCountChanged', {
        playersCount: guessPerson.playersCount,
    });

    socket.on("startNewGame", () => {
        const game = guessPerson.startNewGame(socket.handshake.session, {
            name: "Cristiano Ronaldo", 
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/220px-Cristiano_Ronaldo_2018.jpg", 
            wikiUrl: "https://en.wikipedia.org/wiki/Cristiano_Ronaldo"
        });
        socket.emit('gameStarted', {
            game
        });
    });

    socket.on("newQuestion", data => {
        const question = guessPerson.setQuestion(socket.handshake.session.userId, data.question);
        socket.broadcast.emit('newQuestion', question );
    });

    socket.on("disconnect", () => {
        guessPerson.playerGoneOffline(socket.handshake.session.userId)
        io.emit('playersCountChanged', {
            playersCount: guessPerson.playersCount,
        });
    });
});