import { defineStore } from "pinia";

type State = {
  mode: "light" | "dark";
  spacing: "normal" | "center";
};

export const useThemeStore = defineStore("theme", {
  state: () =>
    ({
      mode: "light",
      spacing: "normal",
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
