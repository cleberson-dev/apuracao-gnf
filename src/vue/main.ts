import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import HomePage from "./pages/Home.vue";
import RegisterPage from "./pages/Register.vue";
import ClearPage from "./pages/Clear.vue";

import store from "./store/index";

export const wsc = new WebSocket("ws://localhost:5050");

const routes = [
  { path: "/", component: HomePage },
  { path: "/cadastrar", component: RegisterPage },
  { path: "/limpar", component: ClearPage },
];
const router = createRouter({ routes, history: createWebHistory() });

createApp(App).use(router).use(store).mount("#app");
