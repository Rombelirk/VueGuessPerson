import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import store from "./store/store"
import router from "./router"
import VueRouter from "vue-router"

Vue.use(VueRouter);

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')


