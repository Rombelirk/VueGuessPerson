const mongoose = require('./mongo');
const router = require("./router");
const io = require("./socket");
const {app} = require("./server")
const {server} = require("./server");
require("./middleware");

io.on('connection', function (socket) {
    console.log("connected", socket.handshake.session);
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

app.use("/", router);

console.log("server is listening on port 3000")

server.listen(3000);



