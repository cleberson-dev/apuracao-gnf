import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { createNotivue } from "notivue";
import { createPinia } from "pinia";
import Vue3EasyDataTable from "vue3-easy-data-table";
import { VueSpinnersPlugin } from "vue3-spinners";
import { defaultConfig, plugin } from "@formkit/vue";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import App from "./App.vue";
import HomePage from "./pages/Home.vue";
import RegisterPage from "./pages/Register.vue";
import ClearPage from "./pages/Clear.vue";
import DataEditorPage from "./pages/DataEditor.vue";
import config from "../../formkit.config";

import "./index.css";
import "notivue/notification.css";
import "notivue/animations.css";
import "vue3-easy-data-table/dist/style.css";

const routes = [
  { path: "/", component: async () => HomePage },
  { path: "/cadastrar", component: async () => RegisterPage },
  { path: "/limpar", component: async () => ClearPage },
  { path: "/database", component: async () => DataEditorPage },
];

const router = createRouter({ routes, history: createWebHashHistory() });

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
const notivue = createNotivue();

createApp(App)
  .component("EasyDataTable", Vue3EasyDataTable)
  .use(pinia)
  .use(router)
  .use(notivue)
  .use(VueSpinnersPlugin)
  .use(plugin, defaultConfig(config))
  .mount("#app");
