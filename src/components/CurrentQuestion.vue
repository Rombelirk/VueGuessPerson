<template>
    <div v-if="game && game.currentQuestion && game.currentQuestion.text" class="current-question">
        <div class="title">Your current question</div>
        {{game.currentQuestion.text}}
        <div class="answers">
            <div
                :style="{flex: game.currentQuestion.answeredYes || 1}"
                class="answer yes"
            >Yes: {{game.currentQuestion.answeredYes}}</div>
            <div
                :style="{flex: game.currentQuestion.answeredNo || 1}"
                class="answer no"
            >No: {{game.currentQuestion.answeredNo}}</div>
        </div>
        <base-button :click="()=>closeQuestion(game._id)">Close question</base-button>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Button from "./Button";
export default {
    name: "CurrentQuestion",
    computed: {
        ...mapState({
            game: state => state.game.game
            // authenticated: state => state.main.authenticated
        })
    },
    methods: {
        ...mapActions({
            closeQuestion: "closeQuestion"
        })
    },
    components: {
        BaseButton: Button
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.current-question {
    grid-area: game;
    box-shadow: 1px 1px 6px #949494;
    background-color: #e0e0e0;
    border-radius: 5px;
    margin: 10px;
    padding: 10px;
    justify-items: center;
    width: auto;
    /* width: 100%; */
    .title {
        font-size: 1.4em;
        color: #616161;
    }
    .answers {
        display: flex;
        border-radius: 3px;
        overflow: hidden;
        width: 100%;
        margin-bottom: 10px;
        .answer {
            padding-left: 5px;
            color: white;
        }
        .yes {
            background-color: #8bc34a;
        }
        .no {
            background-color: #f44336;
        }
    }
}
</style>
