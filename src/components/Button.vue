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

<style scoped lang="scss">
.button {
    background-color: rgb(143, 167, 204);
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    display: flex;
    width: auto;
    max-width: fit-content;
    border-radius: 3px;
}
</style>
