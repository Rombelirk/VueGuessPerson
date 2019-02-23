import Vuex from "vuex"
import Vue from 'vue'
import axios from "axios";
import router from "../router"
import socket from "../socket"
Vue.use(Vuex)

window.socket = socket

const game = {
    state: {
        game: null,
        questions: [],
        suggestions: []
    },
    actions: {
        answerQuestion({ commit }, payload) {
            socket.io.emit("answerQuestion", payload)
        },
        startGame({ commit }) {
            socket.io.emit("startNewGame")
        },
        sendQuestion({ commit }, question) {
            socket.io.emit("newQuestion", { question })
        },
        closeQuestion({ commit }, gameId) {
            socket.io.emit("closeQuestion", gameId)
        },
        onFinalAnswerChange({ commit }, value) {
            socket.io.emit("changeFinalAnswer", value)
        },
        sendFinalAnswer({ commit }, personId) {
            socket.io.emit("sendFinalAnswer", personId)
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
            if (state.game) {
                state.game.currentQuestion = question;
            }
        },
        addNewQuestion(state, question) {
            state.questions.push(question)
        },
        setSuggestions(state, suggestions) {
            console.log(suggestions)
            if (suggestions) state.suggestions = suggestions
        }
    },
    getters: {
        slicedQuestions(state) {
            if (state.questions.length < 4) {
                return state.questions;
            }
            return state.questions.slice(0, 3)
        },
        historyWithFlexValues(state) {
            if (state.game && state.game.history) {
                return state.game.history.map(question => {
                    if (question.answeredYes + question.answeredNo === 0) {
                        return {
                            ...question,
                            flexYes: 1,
                            flexNo: 1
                        }
                    }

                    return {
                        ...question,
                        flexYes: question.answeredYes,
                        flexNo: question.answeredNo
                    }
                })
            }
            return [];
        }
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
                commit("changePlayersCount", data.playersCount);
            });
            socket.io.on("gameStarted", data => {
                commit("setGame", data.game);
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
            socket.io.on("newQuestions", questions => {
                commit("setQuestions", questions);
            });
            socket.io.on("updateGame", game => {
                commit("setGame", game);
            });
            socket.io.on("suggestedPersons", suggestions => {
                commit("setSuggestions", suggestions)
            });
            socket.io.on("finalAnswerCorrect", () => {
                alert("Correct!");
                commit("setGame", null);
            })
            socket.io.on("finalAnswerIncorrect", () => {
                alert("Nope, try again.")
            })
        },

        submitSignup({ commit }, { login, password }) {
            axios.post("/signup", { login, password }).then(res => {
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
            axios.get("/logout").then(() => {
                socket.disconnect();
                dispatch("fetchInitialInfo");
            })
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



