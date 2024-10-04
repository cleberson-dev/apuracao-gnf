<template>
  <div
    class="flex h-[100svh] dark:bg-[#212529] dark:text-white/90"
    :class="{ dark: themeStore.mode === 'dark' }"
  >
    <my-header v-if="!isCollapsed" />

    <main class="h-full overflow-y-auto flex-grow">
      <router-view />
    </main>

    <div class="absolute bottom-1 right-1 font-mono">{{ appVersion }}</div>
  </div>

  <Notification />
  <ModalContainer />
</template>

<script setup lang="tsx">
import { onMounted, onUnmounted, ref } from "vue";
import Notification from "./components/Notification.vue";
import { useMainStore } from "./store/main.store";

import MyHeader from "./components/MyHeader.vue";
import ModalContainer from "./components/ModalContainer.vue";
import ConfirmationDialog from "./components/ConfirmationDialog.vue";
import { useThemeStore } from "./store/theme.store";
import useModal from "./composables/useModal";
import listenToMainEvents from "./utils/listeners";

const appVersion = ref<string | undefined>();

const mainStore = useMainStore();
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

const modal = useModal();

function openConfirmationDialog(confirmFn: () => void) {
  modal.addModal(<ConfirmationDialog onConfirm={confirmFn} />);
}

onMounted(() => {
  mainStore.initializeTime();
  window.addEventListener("keyup", addKeyShortcuts);
  listenToMainEvents(openConfirmationDialog);
  appVersion.value = window.electronAPI.appVersion;
});

onUnmounted(() => {
  window.removeEventListener("keyup", addKeyShortcuts);
});
</script>
