import { createStore } from "vuex";
import sections from "./modules/sections";

const store = createStore({
  modules: { sections },
});

export default store;
