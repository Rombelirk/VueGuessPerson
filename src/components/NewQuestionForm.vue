<template>
    <div class="new-question">
        <div class="title">
            Ask a general (yes/no) question about you. Other players will answer it.
        </div>
        <text-input
            :value="question"
            :title="'Enter your question:'"
            :change="value => question = value"
        />
        <base-button :click="() => sendQuestion(question)">Send question</base-button>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Button from "./Button";
import TextInput from "./TextInput";
export default {
    name: "NewQuestionForm",
      data() {
        return {
            question: ""
        };
    },
    methods: {
        ...mapActions({
            sendQuestion: "sendQuestion"
        })
    },
    components: {
        TextInput,
        BaseButton: Button,
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.new-question {
    background-color: $block-background-color;
    box-shadow: $box-shadow;
    border-radius: $border-radius;
    grid-area: game;
    margin: $base-gutter;
    padding: $base-gutter;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .title {
        font-size: 1.4em;
        color: #616161;
    }
}
@import "~@/assets/styles/variables.scss";
</style>
