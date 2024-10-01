<template>
  <div class="flex h-[100svh]">
    <my-header v-if="!isCollapsed" />

    <main class="h-full overflow-y-auto flex-grow">
      <router-view />
    </main>

    <div class="absolute bottom-1 right-1 font-mono">{{ appVersion }}</div>
  </div>

  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>

  <ModalContainer />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Notivue, Notification } from 'notivue';

import { useMainStore } from './store/main.store';

import MyHeader from "./components/MyHeader.vue";
import ModalContainer from './components/ModalContainer.vue';

const appVersion = ref<string | undefined>();

const mainStore = useMainStore();

const isCollapsed = ref(false);

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