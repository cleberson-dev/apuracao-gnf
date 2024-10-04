<script setup lang="ts">
import type { NotivueItem } from "notivue";

defineProps<{
  item: NotivueItem;
}>();

const updateAndRestart = () => {
  window.electronAPI.updateAndRestartApp();
};
</script>

<template>
  <div
    class="w-[350px] bg-white text-[#171717] p-2 rounded-[0.625rem] shadow-[rgba(0,0,0,0.06)_0px_4px_6px_-1px,_rgba(0,0,0,0.03)_0px_2px_4px_-1px] relative"
  >
    <div class="text-[0.925rem] flex flex-col flex-grow p-[calc(0.625rem*.15)]">
      <h3 class="font-bold mb-[0.33em]">{{ item.title }}</h3>
      <p class="max-h-64 whitespace-pre-line">{{ item.message }}</p>
    </div>
    <button
      class="absolute top-0 right-0 text-[0.925rem] hover:bg-black/10 rounded transition-colors cursor-pointer p-[calc(0.625rem/2)] m-[0.625rem] ml-0 font-bold"
      @click="item.clear"
    >
      <XMarkIcon class="opacity-65 flex size-5" />
    </button>
    <div class="flex justify-end text-white text-sm">
      <button
        class="bg-primary rounded px-2 py-1 hover:brightness-90"
        @click="updateAndRestart"
      >
        Atualizar e Reiniciar
      </button>
    </div>
  </div>
</template>
