<template>
    <div class="header">
        <div class="players-online-block">
            Players online: {{playersOnline}}
        </div>
        <div class="start-game-block">
            <base-button :click="startGame" v-if="authenticated && game === null">Start game</base-button>
        </div>
        <div class="auth-block">
            <div v-if="authenticated">{{login}}</div>
            <base-button v-else :click="onLoginClick">Login</base-button>
        </div>
        <base-button :click="logout" v-if="authenticated">Logout</base-button>
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
            startGame: 'startGame',
            logout: 'logout'
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
    .players-online-block {
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .start-game-block {
        width: 200px;
    }
    .auth-block {
        display: flex;
    }
}
</style>
