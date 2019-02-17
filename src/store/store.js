
import Vuex from "vuex"
import Vue from 'vue'
import axios from "axios";
import router from "../router"
import socket from "../socket"
Vue.use(Vuex)

const game = {
    state: {
        game: null,
        questions: []
    },
    actions: {
        answerQuestion({commit}, payload) {
            socket.io.emit("answerQuestion", payload)
        },
        startGame({ commit }) {
            socket.io.emit("startNewGame")
        },
        sendQuestion({ commit }, question) {
            socket.io.emit("newQuestion", { question })
        }
    },
    mutations: {
        setGame(state, game) {
            state.game = game
        },
        setQuestions(state, questions) {
            state.questions = questions;
        },
        setCurrentQuestion(state, question) {
            if (state.game ) {
                state.game.currentQuestion = question;
            }
        },
        addNewQuestion(state, question) {
            state.questions.push(question)
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
                    router.push("/"); 
                    dispatch("fetchInitialInfo");
                }
            })
        },
        setSocketHandlers({ commit }) {

            socket.io.on("playersCountChanged", data => {
                console.log(data.io)
                commit("changePlayersCount", data.playersCount);
            });

            socket.io.on("gameStarted", data => {
                commit("setGame", data.game);
            });

            socket.io.on("newQuestion", question => {
                console.log("newQUestio", question)
            });

            socket.io.on("questionAccepted", question => {
                commit("setCurrentQuestion", question)
            });

            socket.io.on("updateAnswers", question => {
                commit("setCurrentQuestion", question)
            });
            socket.io.on("newQuestionAsked", question => {
                commit("addNewQuestion", question)
            });
          
            
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
                    commit("setGame", res.data.player.currentGame);
                    commit("setQuestions", res.data.questions);
                } else if (res.data.message === "Not authenticated") {
                    commit("setAuthenticated", false);
                }
            })
        },
        logout({ dispatch }) {
            axios.get("/logout").then(() => dispatch("fetchInitialInfo"))
        }

    },
    mutations: {
        setUserInfo(state, user) {
            state.user = user;

        },
        setAuthenticated(state, value) {
            if (value === false) {
                return state.authenticated = false;
            }
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



