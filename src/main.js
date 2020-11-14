import Vue from 'vue'
import VueRouter from 'vue-router';

import HomePage from './pages/Home.vue';
import RegisterPage from './pages/Register.vue';

import App from './App.vue';
import store from './store';

Vue.config.productionTip = false

Vue.use(VueRouter);

const routes = [
  { path: '/', component: HomePage },
  { path: '/cadastrar', component: RegisterPage },
];

const router = new VueRouter({ routes });

new Vue({
  render: h => h(App),
  router, store
}).$mount('#app')
