<template>
    <div v-if="history && history.length && history.length !== 0" class="history">
        <div :key="index" v-for="(question, index) in history" class="question">
            <div class="text">{{question.text}}</div>
            <div class="answered-yes">{{question.answeredYes}}</div>
            <div class="answered-no">{{question.answeredNo}}</div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "QuestionsHistory",
    computed: {
        ...mapState({
            history: state => state.game.game && state.game.game.history
        })
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.history {
    margin: 10px;
    grid-area: history;
    box-shadow: 1px 1px 6px #949494;
    border-radius: 5px;
    display: grid;
    /* grid-template-columns: 1fr 1fr 1fr; */
    grid-template-rows: 100px;
    .question {
        display: grid;
        grid-template-areas:
        "text text"
        "yes no";
        .text {
            grid-area: text;
        }
        .answered-yes {
            grid-area: yes;
        }
        .answered-no {
            grid-area: no;
        }
    }
}
</style>
