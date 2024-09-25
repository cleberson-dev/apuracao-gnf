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
import { Notivue, Notification } from 'notivue'

import MyHeader from "./components/MyHeader.vue";
import { wsc } from "./main";
import { useStore } from "./store";

const store = useStore();
onMounted(() => {
  store.dispatch('fetchSections');
  store.dispatch('fetchVotes');
  store.commit('initializeTime');

  wsc.onmessage = (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case "UPDATED_SECTION":
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
