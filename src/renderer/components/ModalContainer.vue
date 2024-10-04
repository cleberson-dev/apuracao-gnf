<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useModalStore } from "../store/modal.store";

const modalStore = useModalStore();
const { modals } = storeToRefs(modalStore);
</script>

<template>
  <div
    v-if="modals.length > 0"
    class="fixed backdrop-blur w-screen h-screen top-0 left-0 flex items-center justify-center z-50"
  >
    <div class="rounded bg-white px-4 py-5 shadow max-h-[90%]">
      <component v-for="modal of modals" :is="modal.component" />
    </div>
  </div>
</template>
