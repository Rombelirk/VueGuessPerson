import io from "socket.io-client";

class Socket {

    constructor() {
        this.io = null;
    }

    connect() {
        if (this.io === null) {
            this.io = io()
        }
    }

    disconnect() {
        if (this.io) {
            this.io.emit("disconnect");
            this.io = null;
        }
    }
}

export default new Socket();
