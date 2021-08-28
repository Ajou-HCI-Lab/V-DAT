import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    jwtToken: VueCookie.get('x-access-token'),
    login: 0,

  },
  mutations: {
    insertToken(state, token){
      state.jwtToken = token;
      state.login = 1;
    },
  },
  actions: {
  },
  modules: {
  }
})
