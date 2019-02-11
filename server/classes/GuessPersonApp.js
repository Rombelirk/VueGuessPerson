const Game = require("./Game");

class GuessPersonApp {
    constructor() {
        if (this.instance) return this.instance;
        this._games = [];
        this._palyersOnline = [];
        this.instance = this;
    }

    get playersCount() {
        return this._palyersOnline.length;
    }

    get gamesCount() {
        return this._games.length;
    }

    newPlayerOnline(player) {
        const index = this._palyersOnline.findIndex(playerOnline => playerOnline.id === player.id);
        if (index === -1) {
            this._palyersOnline.push(player)
        }
        console.log("this._palyersOnline", this._palyersOnline)
    }

    playerGoneOffline(id) {
        const index = this._palyersOnline.findIndex(playerOnline => playerOnline.id === id);
        this._palyersOnline.splice(1, index);
    }

    startNewGame(player, person) {
        const newGame = new Game(player, person);
        this._games[player.userId] = newGame;
        return { ...newGame, person: undefined }
    }

    setQuestion(playerId, question) {
        return this._games[playerId].setQuestion(question);
    }

}

GuessPersonApp.instance = null;

module.exports = GuessPersonApp;