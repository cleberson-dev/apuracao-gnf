<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { push } from "notivue";
import { useStore } from "../store";

const store = useStore();
const router = useRouter();

onMounted(async () => {
  await store.dispatch("cleanVotes");
  push.success("Votos limpos com sucesso!");
  router.push("/");
});
</script>
