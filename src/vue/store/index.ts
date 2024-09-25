import { createStore } from "vuex";
import sections from "./modules/sections";

const store = createStore({
  state: {
    latestUpdate: <number | undefined>undefined,
  },
  mutations: {
    updateTime(state) {
      state.latestUpdate = Date.now();
      localStorage.setItem("latestUpdate", `${state.latestUpdate}`);
    },
    initializeTime(state) {
      const latestUpdate = +localStorage.getItem("latestUpdate")!;
      if (Number.isNaN(latestUpdate)) return;

      state.latestUpdate = latestUpdate;
    },
  },
  modules: { sections },
});

export default store;
