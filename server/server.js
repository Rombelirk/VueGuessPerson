const app = require('express')();
const server = require('http').Server(app);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`started on port ${PORT}`);
});

module.exports = { server, app };
