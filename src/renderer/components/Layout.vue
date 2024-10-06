<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useThemeStore } from "../store/theme.store";
import Menu from "./Menu.vue";
import AppVersion from "./AppVersion.vue";

const themeStore = useThemeStore();
const isCollapsed = ref(false);

const addKeyShortcuts = (e: KeyboardEvent) => {
  if (!e.ctrlKey) return;
  if (e.key.toLowerCase() === "n") {
    isCollapsed.value = !isCollapsed.value;
  }

  if (e.key.toLowerCase() === "b") {
    themeStore.spacing = themeStore.spacing === "center" ? "normal" : "center";
  }
};

onMounted(() => {
  window.addEventListener("keyup", addKeyShortcuts);
});

onUnmounted(() => {
  window.removeEventListener("keyup", addKeyShortcuts);
});
</script>

<template>
  <div
    class="flex h-[100svh] dark:bg-[#212529] dark:text-white/90"
    :class="{ dark: themeStore.mode === 'dark' }"
  >
    <Menu v-if="!isCollapsed" />

    <main class="h-full overflow-y-auto flex-grow">
      <slot></slot>
    </main>

    <AppVersion />
  </div>
</template>
