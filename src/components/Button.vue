<template>
    <div @click="click" class="button">
        <slot/>
    </div>
</template>

<script>
export default {
    name: "Button",
    props: {
        click: {
            type: Function,
            default: f => f
        }
    }
};
</script>

<style>
.button {
    background-color: green;
    color: white;
    padding: 10px;
    cursor: pointer;
    display: flex;
    width: auto;
    max-width: fit-content;
    border-radius: 3px;
}
</style>
