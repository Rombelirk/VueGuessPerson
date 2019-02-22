<template>
    <input type="text" class="text-input" :value="value" @input="onTextInput">
</template>

<script>
export default {
    name: "TextInput",
    methods: {
        onTextInput(e) {
            this.change(e.target.value, this.title)
        }
    },
    props: {
        value: {
            type: String,
            default: ""
        },
        change: {
            type: Function,
            default: f => f
        },
        title: {
            type: String,
            default: ""
        }
    }
};
</script>

<style scoped lang="scss">
.text-input {
    border: 1px solid gray;
    border-radius: 3px;
    height: 20px;
}
</style>
