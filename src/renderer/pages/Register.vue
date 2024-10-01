<template>
  <div class="dark:bg-[#212529] dark:text-white/80">
    <VoteRegisterForm v-if="sectionStore.sections.length > 0" />
    <div v-if="sectionStore.sections.length === 0" class="flex items-center justify-center h-full">
      <h1 class="font-bold text-2xl text-center">
        <span class="block text-8xl animate-bounce mb-2">😢</span>
        Sem seções carregadas, crie seções ou importe-as!
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import VoteRegisterForm from '../components/VoteRegisterForm.vue';
import { useSectionStore } from "../store/section.store";

const sectionStore = useSectionStore();
</script>
