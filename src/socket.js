import io from "socket.io-client";

class Socket{
    constructor() {
        if (this.instance) return this.instance;
        this.io = null;
        this.instance = this;
    }
    connect() {
        this.io = io('http://localhost:3000');
    }
}

Socket.instance = null;

export default new Socket();