import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createNotivue } from "notivue";
import { createPinia } from "pinia";

import App from "./App.vue";
import HomePage from "./pages/Home.vue";
import RegisterPage from "./pages/Register.vue";
import ClearPage from "./pages/Clear.vue";

import "./index.css";
import "notivue/notification.css";
import "notivue/animations.css";

export const wsc = new WebSocket("ws://localhost:5050");

const routes = [
  { path: "/", component: HomePage },
  { path: "/cadastrar", component: RegisterPage },
  { path: "/limpar", component: ClearPage },
];

const router = createRouter({ routes, history: createWebHistory() });

const pinia = createPinia();
const notivue = createNotivue();

createApp(App).use(pinia).use(router).use(notivue).mount("#app");
