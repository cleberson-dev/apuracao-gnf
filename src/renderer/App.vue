<template>
  <div class="flex h-[100svh] dark:bg-[#212529] dark:text-white/90" :class="{ 'dark': themeStore.mode === 'dark' }">
    <my-header v-if="!isCollapsed" />

    <main class="h-full overflow-y-auto flex-grow">
      <router-view />
    </main>

    <div class="absolute bottom-1 right-1 font-mono">{{ appVersion }}</div>
    <button
      class="text-black/50 absolute top-4 right-8 size-10 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors dark:text-white/90 dark:hover:bg-white/10"
      type="button" v-if="isDev" @click="themeStore.toggleMode()">
      <component :is="themeStore.mode === 'light' ? SunIcon : MoonIcon" class="size-8 " />
    </button>
  </div>

  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>

  <ModalContainer />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Notivue, Notification } from 'notivue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/solid';

import { useMainStore } from './store/main.store';

import MyHeader from "./components/MyHeader.vue";
import ModalContainer from './components/ModalContainer.vue';
import { useThemeStore } from './store/theme.store';

const appVersion = ref<string | undefined>();

const mainStore = useMainStore();
const themeStore = useThemeStore();

const isCollapsed = ref(false);

const isDev = !!(import.meta as any).env.DEV;

const toggleCollapse = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'n') {
    isCollapsed.value = !isCollapsed.value;
  }
}

const logElectronMessage = (_: any, text: any) => {
  console.log('__ELECTRON__MAIN__MESSAGE', text);
}

onMounted(() => {
  mainStore.initializeTime();
  window.addEventListener("keyup", toggleCollapse);
  (window as any).electronAPI.onMessage(logElectronMessage);
  appVersion.value = (window as any).electronAPI.appVersion;
});

onUnmounted(() => {
  window.removeEventListener("keyup", toggleCollapse);
  (window as any).electronAPI.offMessage(logElectronMessage);
});
</script>