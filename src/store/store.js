import Vuex from "vuex"
import Vue from 'vue'
import axios from "axios";
import router from "../router"
import socket from "../socket"
import uuid from "uuid"

Vue.use(Vuex);


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

        startGame() {
            socket.io.emit("startNewGame")
        },

        sendQuestion({ commit, dispatch }, question) {
            if (!question) {
                return dispatch("addUserAlertWithTimer", { type: "error", text: "Question is not specified" })
            }
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
            if (suggestions) {
                state.suggestions = suggestions
            }
        },
        removeOthersQuestion(state, questionId) {
            const index = state.questions.findIndex(question => question._id === questionId);
            if (index === -1) {
                return
            }
            state.questions.splice(index, 1);
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
            if (!state.game || !state.game.history) {
                return [];
            }

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
    }
};

const main = {
    state: {
        authenticated: false,
        initialDataIsFetching: false,
        playersOnline: 0,
        user: {
            login: ""
        },
        alerts: []
    },
    actions: {
        async submitLogin({ commit, dispatch }, { login, password }) {
            axios.post("/login", { login, password }).then(res => {
                if (res.data.user) {
                    commit("setUserInfo", res.data.user);
                    commit("setAuthenticated");
                    router.push("/");
                    dispatch("fetchInitialInfo");
                } else {
                    dispatch("addUserAlertWithTimer", { text: res.data.message, type: "error" })
                }
            })
        },
        async sendPerson({ commit, dispatch }, person) {
            const { image, name, wikiUrl } = person;
            const formData = new FormData();

            formData.append("image", image);
            formData.append("name", name);
            formData.append("wikiUrl", wikiUrl);

            const response = await axios.post("/upload", formData);

            if (response.data.code && response.data.code !== 0) {
                return dispatch("addUserAlertWithTimer", { text: response.data.message, type: "error" })
            }

            return dispatch("addUserAlertWithTimer", { text: response.data.message, type: "success" })

        },
        setSocketHandlers({ commit, dispatch }) {
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
                dispatch("addUserAlertWithTimer", { text: "Correct!", type: "success" })
                commit("setGame", null);
            });

            socket.io.on("finalAnswerIncorrect", () => {
                dispatch("addUserAlertWithTimer", { text: "Nope, try again", type: "error" })
            });

            socket.io.on("anotherPlayerAnsweredCorrectly", ({ login, person, questionId }) => {
                commit("removeOthersQuestion", questionId);
                dispatch("addUserAlertWithTimer", { text: `${login} guessed person ${person.name}!`, type: "success" })
            });

            socket.io.on("anotherPlayerClosedQuestion", ({ questionId }) => {
                commit("removeOthersQuestion", questionId);
            });

        },

        async submitSignup({ commit, dispatch }, { login, password }) {
            const response = await axios.post("/signup", { login, password })
            if (response.data.code === 0) {
                dispatch("submitLogin", { login, password });
                dispatch("addUserAlertWithTimer", { text: "User created", type: "success" })
            }

        },

        fetchInitialInfo({ commit, dispatch }) {
            axios.get("/init").then(res => {
                if (res.data.user) {
                    commit("setUserInfo", res.data.user);
                    commit("setAuthenticated");
                    dispatch("setSocketHandlers");
                    commit("setGame", res.data.player.currentGame);
                    commit("setQuestions", res.data.questions);
                }
                else if (res.data.message === "Not authenticated") {
                    commit("setAuthenticated", false);
                }
            });
        },
        logout({ dispatch }) {
            axios.get("/logout").then(() => {
                socket.disconnect();
                dispatch("fetchInitialInfo");
            })
        },
        addUserAlertWithTimer({ commit }, { type, text }) {
            const id = uuid();
            commit("addUserAlert", { type, text, id })
            setTimeout(() => {
                commit("removeUserAlert", id)
            }, 5000)
        },

    },
    mutations: {
        setUserInfo(state, user) {
            state.user = user;
        },
        setAuthenticated(state, value) {
            if (value === false) {
                return state.authenticated = false;
            }

            socket.connect();
            state.authenticated = true;
        },

        changePlayersCount(state, count) {
            state.playersOnline = count;
        },

        addUserAlert(state, alert) {
            const { type, text, id } = alert;
            state.alerts.push({ type, text, id });
        },

        removeUserAlert(state, id) {
            const index = state.alerts.findIndex(alert => alert.id === id);
            state.alerts.splice(index, 1);
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



