<script setup lang="ts">
import { onMounted, ref } from "vue";

const appVersion = ref("");

onMounted(() => {
  appVersion.value = "v1.8.2";
});
</script>

<template>
  <div
    v-if="appVersion"
    class="absolute bottom-1 right-1 font-mono opacity-80 text-right text-[0.7rem]"
  >
    <span class="bg-gray-200">{{ appVersion }}</span>
    <small class="block">by cleberson.dev</small>
  </div>
</template>
