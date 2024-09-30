<template>
  <div class="min-h-[100vh] bg-[#efefef] flex">
    <votes-stats />

    <div class="flex-grow px-10 py-8 w-2/5 flex flex-col justify-evenly">
      <votes-stats-by-zone zone="urbana" />
      <votes-stats-by-zone zone="rural" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import VotesStats from "../components/VotesStats.vue";
import VotesStatsByZone from "../components/VotesStatsByZone.vue";
import { useSectionStore } from "../store/section.store";
import { UtilService } from "../services/util.service";

const sectionStore = useSectionStore();

const cb = (_ev: any, sectionId: number, votes: Record<number | "outros", number>) => {
  sectionStore.updateSection({ sectionId: sectionId, votes });
  UtilService.playAlert();
}

onMounted(() => {
  (window as any).electronAPI.onVotesRegistered(cb);
});

onUnmounted(() => {
  (window as any).electronAPI.offVotesRegistered(cb);
});
</script>