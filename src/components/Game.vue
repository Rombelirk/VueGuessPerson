<template>
    <div v-if="authenticated" class="game">
        <div v-if="game !== null && game.currentQuestion === null">
            <text-input
                :value="question"
                :title="'Enter your question:'"
                :change="value => question = value"
            />
            <base-button :click="() => sendQuestion(question)">Send question</base-button>
        </div>
        <div
            v-if="game && game.currentQuestion && game.currentQuestion.text"
            class="current-question"
        >
            {{game.currentQuestion.text}}
            <div class="question-answers">
                <div>Yes: {{game.currentQuestion.answeredYes}}</div>
                <div>No: {{game.currentQuestion.answeredNo}}</div>
            </div>
        </div>
        <div f-if="questions.length > 0" class="questions">
            <div class="question" :key="index" v-for="(question, index) in questions">
                <div class="question-text">{{question.text}}</div>

                <div v-if="question.person" class="asker">
                    <div>{{question.person.name}}</div>
                    <img class="image" :src="question.person.image">
                </div>
                <div class="answer">
                    <base-button :click="()=>answerQuestion({id: question._id, answer: 'yes'})">Yes</base-button>
                    <base-button :click="()=>answerQuestion({id: question._id, answer: 'no'})">No</base-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import TextInput from "./TextInput";
import Button from "./Button";
export default {
    name: "Game",
    data() {
        return {
            question: ""
        };
    },
    computed: {
        ...mapState({
            game: state => state.game.game,
            authenticated: state => state.main.authenticated,
            questions: state => state.game.questions
        })
    },
    methods: {
        ...mapActions({
            sendQuestion: "sendQuestion",
            answerQuestion: "answerQuestion"
        })
    },
    components: {
        TextInput,
        BaseButton: Button
    }
};
</script>

<style lang="scss">
.game {
    height: 100%;
    width: 100%;

    .current-question {
        background-color: gray;
        margin: 10px;
        padding: 10px;
    }

    .questions {
        .question {
            margin: 5px;
            padding: 5px;
            border: 1px solid gray;
            img {
                max-height: 140px;
            }
            .answer {
                display: flex;
                & > * {
                    margin: 5px;
                    width: 80px;
                }
            }
        }
    }
}
</style>
