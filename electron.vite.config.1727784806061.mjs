// electron.vite.config.js
import { defineConfig } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
var electron_vite_config_default = defineConfig({
  main: {},
  preload: {
    build: {
      lib: {
        formats: ["cjs"]
      }
    }
  },
  renderer: {
    plugins: [vue(), vueJsx()]
  }
});
export {
  electron_vite_config_default as default
};
