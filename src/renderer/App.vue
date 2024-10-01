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
    <div v-if="item.props.isUpdateDownloaded"
      class="w-[350px] bg-white text-[#171717] p-2 rounded-[0.625rem] shadow-[rgba(0,0,0,0.06)_0px_4px_6px_-1px,_rgba(0,0,0,0.03)_0px_2px_4px_-1px] relative">
      <div class="text-[0.925rem] flex flex-col flex-grow p-[calc(0.625rem*.15)]">
        <h3 class="font-bold mb-[0.33em]">{{ item.title }}</h3>
        <p class="max-h-64 whitespace-pre-line">{{ item.message }}</p>
      </div>
      <button
        class="absolute top-0 right-0 text-[0.925rem] hover:bg-black/10 rounded transition-colors cursor-pointer p-[calc(0.625rem/2)] m-[0.625rem] ml-0 font-bold"
        @click="item.clear">
        <XMarkIcon class="opacity-65 flex size-5" />
      </button>
      <div class="flex justify-end text-white text-sm">
        <button class="bg-primary rounded px-2 py-1 hover:brightness-90">Atualizar e Reiniciar</button>
      </div>
    </div>
    <Notification v-else :item="item" />
  </Notivue>

  <ModalContainer />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Notivue, Notification, push } from 'notivue';
import { SunIcon, MoonIcon, XMarkIcon } from '@heroicons/vue/24/solid';

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


  // Listening for Auto-Update Events
  let uploadNotification: ReturnType<typeof push.promise>;
  (window as any).electronAPI.onUpdateAvailable(() => {
    uploadNotification = push.promise({
      title: "Atualização disponível!",
      message: "Realizando o download...",
    });
  });

  (window as any).electronAPI.onUpdateDownloaded(() => {
    uploadNotification.success<{ isUpdateDownloaded: boolean }>({
      title: "✅ Download de Atualização Completo!",
      duration: 20000,
      message: "Caso queira que atualize imediatamente, clique no botão abaixo.",
      props: {
        isUpdateDownloaded: true,
      },
    });
  });

  (window as any).electronAPI.onUpdateError(() => {
    uploadNotification.error({
      title: "Atualização não concluída!",
      message: "Algo aconteceu enquanto atualizava a aplicação.",
    })
  });

  appVersion.value = (window as any).electronAPI.appVersion;

  const onUpdateAndRestart = () => {
    (window as any).electronAPI.updateAndRestartApp();
  }
});

onUnmounted(() => {
  window.removeEventListener("keyup", toggleCollapse);
  (window as any).electronAPI.offMessage(logElectronMessage);
});
</script>