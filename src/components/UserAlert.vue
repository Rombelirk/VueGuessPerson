<template>
    <div class="user-alert-container">
        <transition-group name="alerts" tag="div">
            <div :key="alert.id" v-for="alert in alerts" :class="`user-alert ${alert.type}`">
                <div @click="()=>removeUserAlert(alert.id)" class="close">+</div>
                <div class="text-container">{{alert.text}}</div>
            </div>
        </transition-group>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
    name: "UserAlert",
    computed: {
        ...mapState({ alerts: state => state.main.alerts })
    },
    methods: {
        ...mapMutations({
            removeUserAlert: "removeUserAlert"
        })
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";

.alerts-enter-active,
.alerts-leave-active {
    opacity: .9;
     transition: opacity 200ms;
}
.alerts-enter,
.alerts-leave-to {
    opacity: 0;
}

.user-alert-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1;
    .user-alert {
        width: 200px;
        height: fit-content;
        border-radius: $border-radius;
        color: white;
        padding: 20px;
        margin-bottom: 10px;
        position: relative;
        .close {
            position: absolute;
            top: 6px;
            right: 6px;
            cursor: pointer;
            color: gray;
            background-color: white;
            border-radius: 50%;
            width: 14px;
            height: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: rotate(45deg);
            font-weight: bold;
        }
    }

    .success {
        background-color: $yes-color;
    }

    .error {
        background-color: $no-color;
    }
}
</style>
