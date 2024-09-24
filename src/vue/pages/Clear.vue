<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

onMounted(async () => {
  await store.dispatch("cleanVotes");
  router.push("/");
});
</script>
