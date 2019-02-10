<template>
    <div class="header">
        <div class="start-game-block">
            <base-button :click="startGame" v-if="authenticated">Start game</base-button>
        </div>
        <div class="auth-block">
            <div v-if="authenticated">{{login}}</div>
            <base-button v-else :click="onLoginClick">Login</base-button>
        </div>
    </div>
</template>

<script>
import Login from "./Login.vue";
import { mapState, mapActions } from "vuex";
import Button from "./Button";

export default {
    name: "Header",
    computed: {
        ...mapState({
            login: state => state.main.user.login,
            authenticated: state => state.main.authenticated,
            initialDataIsFetching: state => state.main.initialDataIsFetching
        })
    },
    methods: {
        onLoginClick() {
            this.$router.push("/login");
        },
        ...mapActions({
            startGame: 'startGame'
        })
    },
    components: {
        Login,
        BaseButton: Button
    }
};
</script>

<style scoped lang="scss">
.header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 80px;
    background-color: rgb(214, 214, 214);
    justify-content: flex-end;
    .start-game-block {
        
    }
    .auth-block {
        display: flex;
    }
}
</style>
