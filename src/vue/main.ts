import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createNotivue } from "notivue";
import { createPinia } from "pinia";

import App from "./App.vue";
import HomePage from "./pages/Home.vue";
import RegisterPage from "./pages/Register.vue";
import ClearPage from "./pages/Clear.vue";
import DataEditorPage from "./pages/DataEditor.vue";

import "./index.css";
import "notivue/notification.css";
import "notivue/animations.css";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { VueSpinnersPlugin } from "vue3-spinners";

export const wsc = new WebSocket("ws://localhost:5050");

const routes = [
  { path: "/", component: HomePage },
  { path: "/cadastrar", component: RegisterPage },
  { path: "/limpar", component: ClearPage },
  { path: "/database", component: DataEditorPage },
];

const router = createRouter({ routes, history: createWebHistory() });

const pinia = createPinia();
const notivue = createNotivue();

createApp(App)
  .component("EasyDataTable", Vue3EasyDataTable)
  .use(pinia)
  .use(router)
  .use(notivue)
  .use(VueSpinnersPlugin)
  .mount("#app");
