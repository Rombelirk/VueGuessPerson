<template>
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
</template>

<script>

import { mapState, mapActions, mapMutations } from "vuex";
import Button from "./Button";
export default {
    name: "OthersQuestions",
    computed: {
        ...mapState({
            questions: state => state.game.questions
        })
    },
    methods: {
        ...mapActions({
            answerQuestion: "answerQuestion"
        })
    },
     components: {
        BaseButton: Button,
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.questions {
    grid-area: others-questions;
    margin: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .question {
        display: flex;
        flex-direction: column;
        margin: 10px 0;
        padding: 5px;
        width: 200px;
        box-shadow: 1px 1px 6px #949494;
        background-color: #e0e0e0;
        justify-content: center;
        align-items: center;
        img {
            max-height: 140px;
            border-radius: 5px;
        }
        .answer {
            display: flex;
            & > * {
                margin: 5px;
            }
        }
    }
}
</style>
