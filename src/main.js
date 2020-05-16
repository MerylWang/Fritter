import Vue from 'vue'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import router from './router'
import VueSession from 'vue-session'



import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(VueSession)



export const eventBus = new Vue();

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
