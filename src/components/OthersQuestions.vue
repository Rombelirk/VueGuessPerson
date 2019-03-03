<template>
    <div class="questions">
        <div class="title">Other players' questions</div>
        <div class="question" :key="index" v-for="(question, index) in questions">
            <div class="name">
                <div class="login">{{question.loginOfAsker}}</div>
                (<a target="_blank" :href="question.person.wikiUrl || ''">{{question.person.name}}</a>)
            </div>
            <div class="image">
                <img :src="`${question.person.image}`">
            </div>

            <div class="question-text">
                <span class="speech-bubble">{{question.text}}</span>
            </div>
            <div class="answer">
                <base-button :click="()=>answerQuestion({id: question._id, answer: 'yes'})">Yes</base-button>
                <base-button :click="()=>answerQuestion({id: question._id, answer: 'no'})">No</base-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import Button from "./Button";
export default {
    name: "OthersQuestions",
    computed: {
        ...mapGetters({
            questions: "slicedQuestions"
        })
    },
    methods: {
        ...mapActions({
            answerQuestion: "answerQuestion"
        })
    },
    components: {
        BaseButton: Button
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
    overflow-y: auto;
    padding: $base-gutter;
    background-color: $block-background-color;
    box-shadow: $box-shadow;
    border-radius: $border-radius;

    .question {
        display: grid;
        grid-template-columns: 160px 100px;
        grid-template-rows: 30px 140px 60px;
        grid-template-areas:
            "name name"
            "question image"
            "answers answer";
        border-radius: $border-radius;
        min-height: fit-content;

        margin: 10px 0;

        /* box-shadow: 1px 1px 6px #949494; */
        background-color: white;

        .name {
            grid-area: name;
            grid-column-end: 3;
            display: flex;
            justify-content: center;
            align-items: center;
            .login {
                margin-right: 10px;
            }
        }
        .image {
            grid-area: image;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .question-text {
            grid-area: question;
            display: flex;
            justify-content: flex-end;
            padding-right: 10px;
            align-items: center;
            font-size: 0.9em;
            word-wrap: word-break;
            padding: 10px;
            .speech-bubble {
                position: relative;
                background: $main-theme-color;
                border-radius: 0.4em;
                color: white;
                padding: 5px;
                width: fit-content;
                height: fit-content;
            }

            .speech-bubble:after {
                content: "";
                position: absolute;
                right: 0;
                top: 50%;
                width: 0;
                height: 0;
                border: 6px solid transparent;
                border-left-color: $main-theme-color;
                border-right: 0;
                border-top: 0;
                margin-top: -3px;
                margin-right: -6px;
            }
        }

        img {
            max-height: 120px;
            max-width: 100px;
            border-radius: 5px;
        }
        .answer {
            grid-area: answers;
            grid-column-end: 3;
            display: flex;
            justify-content: center;
            align-items: center;
            & > * {
                margin: 5px;
                padding: 5px 25px;
            }
        }
    }
}
</style>
