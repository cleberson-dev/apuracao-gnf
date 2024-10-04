<template>
  <div class="flex h-[100svh] dark:bg-[#212529] dark:text-white/90" :class="{ 'dark': themeStore.mode === 'dark' }">
    <my-header v-if="!isCollapsed" />

    <main class="h-full overflow-y-auto flex-grow">
      <router-view />
    </main>

    <div class="absolute bottom-1 right-1 font-mono">{{ appVersion }}</div>
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
        <button class="bg-primary rounded px-2 py-1 hover:brightness-90" @click="updateAndRestart">
          Atualizar e Reiniciar
        </button>
      </div>
    </div>
    <Notification v-else :item="item" />
  </Notivue>

  <ModalContainer />
</template>

<script setup lang="tsx">
import { onMounted, onUnmounted, ref } from 'vue';
import { Notivue, Notification, push } from 'notivue';
import { XMarkIcon } from '@heroicons/vue/24/solid';

import { useMainStore } from './store/main.store';

import MyHeader from "./components/MyHeader.vue";
import ModalContainer from './components/ModalContainer.vue';
import ConfirmationDialog from './components/ConfirmationDialog.vue';
import { useThemeStore } from './store/theme.store';
import useModal from './composables/useModal';
import { useSectionStore } from './store/section.store';
import { UtilService } from './services/util.service';

const appVersion = ref<string | undefined>();

const mainStore = useMainStore();
const themeStore = useThemeStore();
const sectionStore = useSectionStore();

const isCollapsed = ref(false);

const updateAndRestart = () => {
  (window as any).electronAPI.updateAndRestartApp();
}

const addKeyShortcuts = (e: KeyboardEvent) => {
  if (!e.ctrlKey) return;
  if (e.key.toLowerCase() === 'n') {
    isCollapsed.value = !isCollapsed.value;
  }

  if (e.key.toLowerCase() === 'b') {
    themeStore.spacing = themeStore.spacing === 'center' ? 'normal' : 'center';
  }
}

const logElectronMessage = (_: any, text: any) => {
  console.log('__ELECTRON__MAIN__MESSAGE', text);
}

const modal = useModal();

function openConfirmationDialog(confirmFn: () => void) {
  modal.addModal(<ConfirmationDialog onConfirm={confirmFn} />);
}

onMounted(() => {
  mainStore.initializeTime();
  window.addEventListener("keyup", addKeyShortcuts);
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

  (window as any).electronAPI.onRemoveAllSections(() => {
    openConfirmationDialog(() => {
      sectionStore.removeAllSections();
      push.info("Todas as seções foram removidas");
    });
  });
  (window as any).electronAPI.onRestoreSections(() => {
    openConfirmationDialog(async () => {
      const importedSections = await UtilService.importSections();
      sectionStore.reset(importedSections);
      push.info('Seções restauradas');
    });
  });

  let sectionsUploadNotification: ReturnType<typeof push.promise>;
  (window as any).electronAPI.onSectionsUploadUploading(() => {
    sectionsUploadNotification = push.promise({
      title: 'Importando Seções',
      message: 'Aguarde enquanto estamos importando seu arquivo...',
    });
  });

  (window as any).electronAPI.onSectionsUploadSuccess(() => {
    sectionsUploadNotification.success({
      title: 'Importação concluída',
      message: 'Para usar, basta restaurar as seções',
    });
  });

  appVersion.value = (window as any).electronAPI.appVersion;
});

onUnmounted(() => {
  window.removeEventListener("keyup", addKeyShortcuts);
  (window as any).electronAPI.offMessage(logElectronMessage);
});
</script>