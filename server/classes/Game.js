const Question = require("./Question");
class Game {
    constructor(player, person) {
        this.player = player;
        this.person = person;
        this.history = [];
        this.currentQuestion = null;
    }

    setQuestion(question) {
        this.currentQuestion = new Question(question);
        return { question: { ...this.currentQuestion }, person: { ...this.person } };
    }
}

module.exports = Game;