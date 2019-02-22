<template>
    <div class="new-question">
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
.new-question {
    margin: 10px;
}
@import "~@/assets/styles/variables.scss";
</style>
