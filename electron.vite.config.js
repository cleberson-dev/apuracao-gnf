import { defineConfig } from "electron-vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: "src/vue/background.js",
      },
    },
  },
  renderer: {
    root: ".",
    plugins: [vue()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "index.html"),
        },
      },
    },
  },
});
