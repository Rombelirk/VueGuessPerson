<template>
    <div v-if="authenticated" class="game">
        <div v-if="game !== null">Game started</div>
        <div v-if="game !== null && game.currentQuestion === null">
            <text-input
                :value="question"
                :title="'Enter your question:'"
                :change="value => question = value"
            />
            <base-button :click="() => sendQuestion(question)">Send question</base-button>
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
            authenticated: state => state.main.authenticated
        })
    },
    methods: {
        ...mapActions({
            sendQuestion: "sendQuestion"
        })
    },
    components: {
        TextInput,
        BaseButton: Button
    }
};
</script>

<style>
.game {
    height: 100%;
    width: 100%;
}
</style>
