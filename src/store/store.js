
import Vuex from "vuex"
import Vue from 'vue'
import axios from "axios";
import router from "../router"
import socket from "../socket"
Vue.use(Vuex)

const game = {
    state: {
        game: null
    },
    actions: {
        startGame({ commit }) {
            socket.io.emit("startNewGame")
        },
        sendQuestion({ commit }, question) {
            socket.io.emit("newQuestion", { question })
        }
    },
    mutations: {
        gameStarted(state, game) {
            state.game = game
        }
    },
    getters: {

    }
}

const main = {
    state: {
        authenticated: false,
        initialDataIsFetching: false,
        playersOnline: 0,
        user: {
            login: ""
        }
    },
    actions: {
        submitLogin({ commit, dispatch }, { login, password }) {
            axios.post("/login", { login, password }).then(res => {
                if (res.data.user) {
                    commit("setUserInfo", res.data.user);
                    commit("setAuthenticated");
                    dispatch("setSocketHandlers");
                    router.push("/")
                }
            })
        },
        setSocketHandlers({ commit }) {

            socket.io.on("playersCountChanged", data => {
                console.log(data.io)
                commit("changePlayersCount", data.playersCount);
            });

            socket.io.on("gameStarted", data => {
                commit("gameStarted", data.game);
            });

            socket.io.on("newQuestion", question => {
                console.log("newQUestio", question)
            })
        },
        ////sd fsdfdf dfgdfg 
        submitSignup({ commit }, { login, password }) {
            axios.post("/signup", { login, password }).then(res => {
                console.log(res);
            })
        },
        fetchInitialInfo({ commit, dispatch }) {
            axios.get("/init").then(res => {
                if (res.data.user) {
                    commit("setUserInfo", res.data.user);
                    commit("setAuthenticated");
                    dispatch("setSocketHandlers");
                }
            })
        },

    },
    mutations: {
        setUserInfo(state, user) {
            state.user = user;
        },
        setAuthenticated(state) {
            socket.connect()

            state.authenticated = true;
        },

        changePlayersCount(state, count) {

            state.playersOnline = count;
        }
    },
    getters: {

    }
}

const store = new Vuex.Store({
    modules: {
        main, game
    }
})

export default store;



