<script setup lang="ts">
import { useModalStore } from '../store/modal.store';

const emit = defineEmits(["confirm", "cancel"])

const modalStore = useModalStore();

const onConfirm = () => {
  emit("confirm");
  modalStore.pop();
}

const onCancel = () => {
  emit("cancel");
  modalStore.pop();
}
</script>

<template>
  <div class="flex flex-col">
    <p>Você tem certeza que quer fazer isso?</p>
    <div class="text-white flex gap-1 mt-5 self-end">
      <button type="button" @click="onConfirm"
        class="rounded bg-green-500 p-2 hover:brightness-90 transition-all">Confirmar</button>
      <button type="button" @click="onCancel"
        class="rounded bg-red-500 p-2 hover:brightness-90 transition-all">Cancelar</button>
    </div>
  </div>
</template>