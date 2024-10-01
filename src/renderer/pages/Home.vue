<template>
  <div class="min-h-[100svh] bg-white dark:bg-[#343a40]  grid grid-cols-[7fr_3fr]">
    <votes-stats />

    <div
      class="flex-grow max-h-[100svh] bg-[#efefef] dark:bg-[#212529]  px-10 py-8 flex flex-col gap-20 justify-center">
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