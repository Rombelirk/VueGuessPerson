<template>
    <div v-if="game && game.currentQuestion && game.currentQuestion.text" class="current-question">
        <div class="title">Your current question</div>
        {{game.currentQuestion.text}}
        <div class="answers">
            <div
                :style="{flex: flex.yes}"
                class="answer yes"
            >Yes: {{game.currentQuestion.answeredYes}}</div>
             <div :style="{flex: flex.dontKnow}" class="answer dontKnow">Can't say: {{game.currentQuestion.answeredDontKnow}}</div>
            <div :style="{flex: flex.no}" class="answer no">No: {{game.currentQuestion.answeredNo}}</div>
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
        }),
        flex() {
            
            if (
                this.game.currentQuestion.answeredYes + this.game.currentQuestion.answeredNo + this.game.currentQuestion.answeredDontKnow === 0
            ) {
                return {
                    yes: 1,
                    no: 1,
                    dontKnow: 1
                };
            }
            return {
                yes: this.game.currentQuestion.answeredYes,
                no: this.game.currentQuestion.answeredNo,
                dontKnow: this.game.currentQuestion.answeredDontKnow
            };
        },

        flexNo() {}
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
    box-shadow: $box-shadow;
    border-radius: 5px;
    background-color: $block-background-color;
    margin: $base-gutter;
    padding: 10px;
    justify-items: center;
    width: auto;
    /* width: 100%; */
  
    .answers {
        display: flex;
        border-radius: 3px;
        overflow: hidden;
        width: 100%;
        height: 40px;
        margin-bottom: 10px;
        .answer {
            padding-left: 5px;
            color: white;
            min-width: fit-content;
            padding: 0 5px;
            transition: all 200ms ease-out;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .yes {
            background-color: $yes-color;
        }
        .no {
            background-color: $no-color;
        }

        .dontKnow {
            background-color: gray;
        }
    }
}
</style>
