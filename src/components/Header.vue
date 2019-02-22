<template>
    <div class="header">
        <div v-if="authenticated" class="players-online-block">Players online: {{playersOnline}}</div>
        <div class="start-game-block">
            <base-button :click="startGame" v-if="authenticated && game === null">Start game</base-button>
        </div>
        <div v-if="authenticated">{{login}}</div>
        <div class="auth-block">
            <base-button v-if="!authenticated" :click="onLoginClick">Login</base-button>
            <transparent-button :click="logout" v-if="authenticated" :text="'Sign Out'">
                <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
            </transparent-button>
        </div>
    </div>
</template>

<script>
import Login from "./Login.vue";
import { mapState, mapActions } from "vuex";
import Button from "./Button";
import TransparentButton from "./TransparentButton";

export default {
    name: "Header",
    computed: {
        ...mapState({
            login: state => state.main.user.login,
            authenticated: state => state.main.authenticated,
            initialDataIsFetching: state => state.main.initialDataIsFetching,
            playersOnline: state => state.main.playersOnline,
            game: state => state.game.game
        })
    },
    methods: {
        onLoginClick() {
            this.$router.push("/login");
        },
        ...mapActions({
            startGame: "startGame",
            logout: "logout"
        })
    },
    components: {
        Login,
        BaseButton: Button,
        TransparentButton
    }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/variables.scss";
.header {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr;
    width: 100%;
    height: 80px;
    background-color: $main-theme-color;
    align-items: center;

    .players-online-block {
        width: auto;
        display: flex;
        justify-content: center;
    }
    .start-game-block {
        width: 200px;
    }
    .auth-block {
        display: flex;
        margin-right: 30px;
    }
}
</style>
