import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import sections from "./modules/sections";
import type { State as SectionsState } from "./modules/sections";

type State = {
  latestUpdate?: number;
  sections: SectionsState;
};

export const key: InjectionKey<Store<State>> = Symbol();

const store = createStore<State>({
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

export const useStore = () => baseUseStore(key);

export default store;
