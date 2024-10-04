<template>
  <Layout>
    <router-view />
  </Layout>
  <Notification />
  <ModalContainer />
</template>

<script setup lang="tsx">
import { onMounted } from "vue";
import Notification from "./components/Notification.vue";
import { useMainStore } from "./store/main.store";

import ModalContainer from "./components/ModalContainer.vue";
import ConfirmationDialog from "./components/ConfirmationDialog.vue";
import useModal from "./composables/useModal";
import listenToMainEvents from "./utils/listeners";
import Layout from "./components/Layout.vue";

const mainStore = useMainStore();
const modal = useModal();

function openConfirmationDialog(confirmFn: () => void) {
  modal.addModal(<ConfirmationDialog onConfirm={confirmFn} />);
}

onMounted(() => {
  mainStore.initializeTime();
  listenToMainEvents(openConfirmationDialog);
});
</script>
