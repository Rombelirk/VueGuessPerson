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
    /* width: 100%; */

    .current-question {
        box-shadow: 1px 1px 6px #949494;
        background-color: #e0e0e0;
        border-radius: 5px;
        margin: 10px;
        padding: 10px;
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

    .questions {
         margin: 10px;
         display: flex;
         align-items: flex-end;
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
}
</style>
