import { defineConfig } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  main: {},
  preload: {
    build: {
      lib: {
        formats: ["cjs"],
      },
    },
  },
  renderer: {
    plugins: [vue(), vueJsx()],
  },
});
