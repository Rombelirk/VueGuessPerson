<template>
    <div class="final-answer">
        <div class="input-container">
            <div class="title">Final answer</div>
            <text-input :value="selectedPerson ? selectedPersonName() : ''" :change="inputChange"/>

            <div
                v-if="suggestions.length > 0 && showSuggestions"
                class="suggestions"
                v-click-outside="closeSuggestions"
            >
                <div
                    @click="()=>choosePerson(suggestion._id)"
                    class="suggestion"
                    :key="suggestion._id || index"
                    v-for="(suggestion, index) in suggestions"
                >{{suggestion.name}}</div>
            </div>
        </div>
        <div class="button-container">
            <base-button
                :click="()=>sendFinalAnswer(selectedPerson)"
                v-if="selectedPerson"
            >Send answer</base-button>
        </div>
    </div>
</template>

<script>
import TextInput from "./TextInput";
import { mapState, mapActions, mapMutations } from "vuex";
import Button from "./Button";
export default {
    name: "FinalAnswer",
    components: {
        TextInput,
        BaseButton: Button
    },
    data() {
        return {
            key: 0,
            selectedPerson: null,
            showSuggestions: false
        };
    },
    computed: {
        ...mapState({
            suggestions: state => state.game.suggestions
        })
    },
    methods: {
        ...mapActions(["onFinalAnswerChange", "sendFinalAnswer"]),
        inputChange(value) {
            this.showSuggestions = true;
            this.onFinalAnswerChange(value);
        },
        choosePerson(personId) {
            this.showSuggestions = false;
            this.selectedPerson = personId;
        },
        selectedPersonName() {
            if (!this.selectedPerson) return "";
            const index = this.suggestions.findIndex(
                suggestion => suggestion._id === this.selectedPerson
            );
            if (index !== -1) {
                return this.suggestions[index].name;
            }
        },
        closeSuggestions() {
            this.showSuggestions = false;
        }
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.final-answer {
    background-color: $block-background-color;
    box-shadow: $box-shadow;
    border-radius: $border-radius;
    margin: $base-gutter;
    padding: $base-gutter;
    grid-area: final-answer;
    display: flex;
    /* align-items: center; */
    .input-container {
        display: flex;
        flex-direction: column;
        justify-content: start;
        position: relative;
     
        .suggestions {
            position: absolute;
            top: 60px;
            border: $standard-border;
            .suggestion {
                cursor: pointer;
                height: 20px;
                background-color: white;
                font-size: 0.8em;
                padding: 5px;
                &:hover {
                    background-color: rgb(202, 202, 202);
                }
            }
        }
    }
    .button-container {
        margin-left: 20px;
        margin-top: 10px;
        display: flex;
    }
}
</style>
