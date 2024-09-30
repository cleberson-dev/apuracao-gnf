import { defineStore } from "pinia";
import { Component } from "vue";
import { v4 as uuid } from "uuid";

export const useModalStore = defineStore("modal", {
  state: () => ({
    modals: <{ id: string; component: Component }[]>[],
  }),
  actions: {
    addModal(component: Component): string {
      const id = uuid();
      this.modals.push({ id, component });
      return id;
    },
    pop() {
      this.modals.pop();
    },
    remove(id: string) {
      this.modals = this.modals.filter((m) => m.id !== id);
    },
  },
});
