import { defineStore } from "pinia";

type State = {
  mode: "light" | "dark";
};

export const useThemeStore = defineStore("theme", {
  state: () =>
    ({
      mode: "light",
    } as State),
  actions: {
    changeMode(newMode: State["mode"]) {
      this.mode = newMode;
    },
    toggleMode() {
      this.mode = this.mode === "light" ? "dark" : "light";
    },
  },
  persist: true,
});
