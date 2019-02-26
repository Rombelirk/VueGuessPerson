import express from 'express';
import http from 'http';

export const app = express();
export const server = http.Server(app);

const PORT = 3000

server.listen(PORT, () => {
    console.log(`started on port ${PORT}`);
});


