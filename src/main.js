import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import store from "./store/store";
import router from "./router";
import VueRouter from "vue-router";
import "./configs/fontAwesome";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueRouter);

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')


