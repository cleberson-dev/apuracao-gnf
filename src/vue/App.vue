<template>
  <my-header />

  <main class="h-full ml-20">
    <router-view />
  </main>

  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Notivue, Notification } from 'notivue'

import MyHeader from "./components/MyHeader.vue";
import { wsc } from "./main";

import { useSectionStore } from './store/section.store';
import { useMainStore } from './store/main.store';

const sectionsStore = useSectionStore();
const mainStore = useMainStore();

onMounted(() => {
  sectionsStore.fetchSections();
  sectionsStore.fetchVotes();
  mainStore.initializeTime();

  wsc.onmessage = (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case "UPDATED_SECTION":
        sectionsStore.updateSection(message.payload);
        break;
      default:
        console.log(message);
    }
  };
});
</script>