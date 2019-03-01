<template>
    <div class="header-container">
        <div class="header">
            <div v-if="authenticated" class="players-online-block">Players online: {{playersOnline}}</div>
            <div class="start-game-block">
                <base-button :click="onStartGame" v-if="authenticated && game === null">Start game</base-button>
            </div>

            <div class="auth-block">
                <base-button v-if="!authenticated" :click="onLoginClick">Login</base-button>
                <div class="login-container" v-if="authenticated">Username: {{login}}</div>
                <transparent-button :click="logout" v-if="authenticated" :text="'Sign Out'">
                    <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
                </transparent-button>
            </div>
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
        }),
        onStartGame() {
            this.$router.push("/");
            this.startGame();
        }
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
.header-container {
    background-color: $main-theme-color;
    width: 100%;
    .header {
        color: white;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        max-width: 1200px;
        height: 80px;
        margin: auto;
        align-items: center;
        @media (max-width: 600px) {
            font-size: .9em;
        }
        .players-online-block {
            grid-column-start: 1;
            width: auto;
            display: flex;
            justify-content: center;
        }
        .start-game-block {
            grid-column-start: 2;
            width: 200px;
        }
        .auth-block {
            flex-direction: column;
            grid-column-start: 3;
            display: flex;
            /* margin-right: 30px; */
            justify-self: flex-end;
        }
    }
}
</style>
