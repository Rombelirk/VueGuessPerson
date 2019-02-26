import express from 'express';
import http from 'http';

export const app = express();
export const server = http.Server(app);

const PORT = process.env.PORT || 80

server.listen(PORT, () => {
    console.log(`started on port ${PORT}`);
});


