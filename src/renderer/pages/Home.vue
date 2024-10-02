<template>
  <div class="h-full bg-white dark:bg-[#343a40] grid overflow-hidden"
    :class="{ 'grid-cols-[6fr_4fr]': themeStore.spacing === 'center', 'grid-cols-[7fr_3fr]': themeStore.spacing === 'normal' }">
    <votes-stats />

    <div class="flex-grow h-[100svh] bg-[#efefef] dark:bg-[#212529] px-10 py-4 flex flex-col gap-10 justify-center"
      :class="{ 'pr-36': themeStore.spacing === 'center' }">
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
import { useThemeStore } from "../store/theme.store";

const sectionStore = useSectionStore();
const themeStore = useThemeStore();

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