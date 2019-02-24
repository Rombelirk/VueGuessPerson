<template>
    <div class="history">
        <div class="title">History of closed questions.</div>
        <div class="questions-container">
            <div :key="index" v-for="(question, index) in historyWithFlexValues" class="question">
                <div class="text">{{question.text}}</div>
                <div class="answers">
                    <div
                        :style="`flex: ${question.flexYes}`"
                        class="answered-yes"
                    >Yes: {{question.answeredYes}}</div>
                    <div
                        :style="`flex: ${question.flexNo}`"
                        class="answered-no"
                    >No: {{question.answeredNo}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
    name: "QuestionsHistory",
    computed: {
        ...mapState({
            history: state => state.game.game && state.game.game.history
        }),
        ...mapGetters({
            historyWithFlexValues: "historyWithFlexValues"
        })
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.history {
    padding: $base-gutter;
    margin: $base-gutter;
    grid-area: history;
    background-color: $block-background-color;
    box-shadow: $box-shadow;
    border-radius: $border-radius;
    display: flex;
    flex-direction: column;
    .title {
        font-size: 1.4em;
        color: #616161;
    }
    .questions-container {
         overflow-y: auto;
        .question {
            display: flex;
            width: auto;
            flex-direction: column;
            min-height: fit-content;
            .text {
                grid-area: text;
            }
            .answers {
                display: flex;
                width: auto;
                border-radius: $border-radius;
                overflow: hidden;

                .answered-yes {
                    padding: 0 5px;
                    min-width: fit-content;
                    background-color: $yes-color;
                    grid-area: yes;
                    color: white;
                }
                .answered-no {
                    padding: 0 5px;
                    min-width: fit-content;
                    grid-area: no;
                    background-color: $no-color;
                    color: white;
                }
            }
        }
    }
}
</style>
