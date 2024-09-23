import { defineConfig } from "electron-vite";

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: "src/vue/background.js",
      },
    },
  },
});
