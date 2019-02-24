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

Vue.directive(
  'click-outside', {
    bind: function (el, binding, vNode) {
      // Provided expression must evaluate to a function.
      if (typeof binding.value !== 'function') {
        const compName = vNode.context.name
        let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
        if (compName) { warn += `Found in component '${compName}'` }

        console.warn(warn)
      }
      // Define Handler and cache it on the element
      const bubble = binding.modifiers.bubble
      const handler = (e) => {
        if (bubble || (!el.contains(e.target) && el !== e.target)) {
          binding.value(e)
        }
      }
      el.__vueClickOutside__ = handler

      // add Event Listeners
      document.addEventListener('click', handler)
    },

    unbind: function (el, binding) {
      // Remove Event Listeners
      document.removeEventListener('click', el.__vueClickOutside__)
      el.__vueClickOutside__ = null

    }

  })


