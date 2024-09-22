import { createApp } from "vue";
import { createRouter } from "vue-router";

import HomePage from "./pages/Home.vue";
import RegisterPage from "./pages/Register.vue";
import ClearPage from "./pages/Clear.vue";

import App from "./App.vue";
import store from "./store";
import { createWebHistory } from "vue-router";

export const wsc = new WebSocket("ws://localhost:5050");

// Vue.config.productionTip = false;

const routes = [
  { path: "/", component: HomePage },
  { path: "/cadastrar", component: RegisterPage },
  { path: "/limpar", component: ClearPage },
];
const router = createRouter({ routes, history: createWebHistory() });

createApp(App).use(router).use(store).mount("#app");
