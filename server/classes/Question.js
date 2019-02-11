class Question {
    constructor(questionText) {
        this.questionText = questionText;
        this.answers = {
            yes: 0,
            no: 0,
            dontKnow: 0
        }
        
    }

    getTotalAnswers() {
        return this.answers.yes + this.answers.no + this.answers.dontKnow
    }
}

module.exports = Question;