<template>
    <div @click="click" class="button">
        <slot/>
        <div class="text">
            {{text}}
        </div>
    </div>
</template>

<script>
export default {
    name: "TransparentButton",
    props: {
        click: {
            type: Function,
            default: f => f
        },
        text: {
            type: String,
            default: ""
        }
    }
};
</script>

<style scoped lang="scss">
.button {
    display: flex;
    align-items: center;
    color: #394c4c;
    cursor: pointer;
   
    font-size: .9em;
    &:hover {
        color: #273535;
    }
    .text {
         min-width: fit-content;
        margin-left: 5px;   
    }
}
</style>
