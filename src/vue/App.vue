<template>
  <div class="flex h-[100svh]">
    <my-header v-if="!isCollapsed" />

    <main class="h-full overflow-y-auto flex-grow">
      <router-view />
    </main>

  </div>

  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Notivue, Notification } from 'notivue'

import MyHeader from "./components/MyHeader.vue";

import { useSectionStore } from './store/section.store';
import { useMainStore } from './store/main.store';

const sectionsStore = useSectionStore();
const mainStore = useMainStore();

const isCollapsed = ref(false);

const toggleCollapse = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'm') {
    isCollapsed.value = !isCollapsed.value;
  }
}

onMounted(() => {
  sectionsStore.fetchSections();

  mainStore.initializeTime();

  window.addEventListener("keyup", toggleCollapse);
});

onUnmounted(() => {
  window.removeEventListener("keyup", toggleCollapse);
});
</script>