
import Vuex from "vuex"
import Vue from 'vue'
import axios from "axios";
import router from "../router"
import io from "socket.io-client"
Vue.use(Vuex)

const game = {
    state: {

    },
    actions: {
        startGame({ commit }) {
            
        }
    },
    mutations: {

    },
    getters: {

    }
}

const main = {
    state: {
        authenticated: false,
        initialDataIsFetching: false,
        user: {
            login: ""
        }
    },
    actions: {
        submitLogin({ commit }, { login, password }) {
            axios.post("/login", { login, password }).then(res => {
                if (res.data.user) {
                    commit("setUserInfo", res.data.user);
                    commit("setAuthenticated");
                    commit("initSocketConnection");
                    router.push("/")
                }
            })
        },
        submitSignup({ commit }, { login, password }) {
            axios.post("/signup", { login, password }).then(res => {
                console.log(res);
            })
        },
        fetchInitialInfo({ commit }) {
            axios.get("/init").then(res => {
                if (res.data.user) {
                    commit("setUserInfo", res.data.user);
                    commit("setAuthenticated");
                }
            })
        }
    },
    mutations: {
        setUserInfo(state, user) {
            state.user = user;
        },
        setAuthenticated(state) {
            state.authenticated = true;
        },
        initSocketConnection(state) {
            state.socket = io('http://localhost:3000');
        }
    },
    getters: {

    }
}

const store = new Vuex.Store({
    modules: {
        main
    }
})

export default store;



