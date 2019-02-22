<template>
    <div v-if="authenticated" class="game">
        <new-question-form v-if="game !== null && game.currentQuestion === null"/>
        <current-question/>
        <others-questions/>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Button from "./Button";
import OthersQuestions from "./OthersQuestions";
import CurrentQuestion from "./CurrentQuestion";
import NewQuestionForm from "./NewQuestionForm";
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
        NewQuestionForm
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.game {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
        "game game others-questions"
        ". . others-questions"
        ". . others-questions";
}
</style>
