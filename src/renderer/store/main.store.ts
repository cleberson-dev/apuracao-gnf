import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    latestUpdate: <number | undefined>undefined,
  }),
  actions: {
    updateTime() {
      this.latestUpdate = Date.now();
      localStorage.setItem("latestUpdate", `${this.latestUpdate}`);
    },
    initializeTime() {
      const latestUpdate = +localStorage.getItem("latestUpdate")!;
      if (Number.isNaN(latestUpdate)) return;

      this.latestUpdate = latestUpdate;
    },
    clearTime() {
      delete this.latestUpdate;
      localStorage.removeItem("latestUpdate");
    },
  },
});
