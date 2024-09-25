<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { push } from "notivue";

import { useSectionStore } from "../store/section.store";
import { useMainStore } from "../store/main.store";

const sectionStore = useSectionStore();
const mainStore = useMainStore();

const router = useRouter();

onMounted(async () => {
  await sectionStore.cleanVotes();
  mainStore.clearTime();
  push.success("Votos limpos com sucesso!");
  router.push("/");
});
</script>
