import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  root: "./src/renderer",
  plugins: [vue(), vueJsx(), vueDevTools()],
});
