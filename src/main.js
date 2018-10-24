// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import infiniteScroll from 'vue-infinite-scroll'
import VueLazyload from 'vue-lazyload';
import {currency} from "./util/currency"
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(VueLazyload,
  {loading:"/static/loading-svg/loading-bars.svg"})
Vue.use(infiniteScroll);
Vue.filter("currency",currency);//全局过滤器
Vue.use(Vuex);
const store=new Vuex.Store({
  state:{
    Nickname:"",
    cartCount:0
  },
  mutations:{
     //更新用户信息
       updateUserInfo(state, Nickname) {
         state.Nickname = Nickname;
       },
       updateCartCount(state, cartCount) {
         state.cartCount += cartCount;
       },
       initCartCount(state, cartCount) {
         state.cartCount = cartCount;
       }

  }

});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
