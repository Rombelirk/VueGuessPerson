const app = require('express')();
const server = require('http').Server(app);

server.listen(3000);

module.exports = { server, app };