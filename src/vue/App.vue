<template>
  <div id="app">
    <my-header />

    <main>
      <router-view />
    </main>
  </div>

  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from "vuex";
import { Notivue, Notification } from 'notivue'

import MyHeader from "./components/MyHeader.vue";
import { wsc } from "./main";

const store = useStore();
onMounted(() => {
  store.dispatch('fetchSections');
  store.dispatch('fetchCandidates');

  wsc.onmessage = (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case "UPDATED_SECTION":
        console.log(message.payload);
        store.dispatch('updateSection', message.payload);
        break;
      default:
        console.log(message);
    }
  };
});
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: "Montserrat", sans-serif;
  min-height: 100vh;
}

main {
  margin-left: 80px;
  height: 100%;
}
</style>
