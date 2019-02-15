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
        <div v-if="game && game.currentQuestion && game.currentQuestion.text" class="current-question">
            {{game.currentQuestion.text}}
        </div>
        <div f-if="questions.length > 0" class="questions">
            <div :key="index" v-for="(question, index) in questions">
                <div class="question-text">
                    {{question.text}}
                </div>
                <div v-if="question.person" class="asker">
                    <div>{{question.person.name}}</div>
                    <img class="image" :src="question.person.image"/>
                    
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
            sendQuestion: "sendQuestion"
        })
    },
    components: {
        TextInput,
        BaseButton: Button
    }
};
</script>

<style>
.game {
    height: 100%;
    width: 100%;
}
</style>
