<template>
    <div v-if="authenticated" class="game">
        <new-question-form v-if="game !== null && game.currentQuestion === null"/>
        <current-question/>
        <others-questions/>
        <questions-history v-if="game !== null"/>
        <final-answer v-if="game !== null"/>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Button from "./Button";
import OthersQuestions from "./OthersQuestions";
import CurrentQuestion from "./CurrentQuestion";
import NewQuestionForm from "./NewQuestionForm";
import QuestionsHistory from "./QuestionsHistory";
import FinalAnswer from "./FinalAnswer";

export default {
    name: "Game",
    computed: {
        ...mapState({
            game: state => state.game.game,
            authenticated: state => state.main.authenticated
        })
    },
    methods: {
        ...mapActions({
            sendQuestion: "sendQuestion"
        })
    },
    components: {
        BaseButton: Button,
        OthersQuestions,
        CurrentQuestion,
        NewQuestionForm,
        QuestionsHistory,
        FinalAnswer
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.game {

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 200px 500px 200px;
    grid-template-areas:
        "game game others-questions"
        "history history others-questions"
        "final-answer final-answer others-questions";
}
</style>
