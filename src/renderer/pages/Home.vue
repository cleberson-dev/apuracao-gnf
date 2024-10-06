<template>
  <div
    class="h-full bg-white dark:bg-[#343a40] flex flex-col md:grid overflow-hidden"
    :class="{
      'grid-cols-[6fr_4fr]': themeStore.spacing === 'center',
      'grid-cols-[7fr_3fr]': themeStore.spacing === 'normal',
    }"
  >
    <votes-stats />

    <div
      class="flex-grow h-[100svh] bg-[#efefef] dark:bg-[#212529] px-10 py-4 flex-col gap-10 justify-center hidden md:flex"
      :class="{ 'pr-36': themeStore.spacing === 'center' }"
    >
      <votes-stats-by-zone zone="urbana" />
      <votes-stats-by-zone zone="rural" />
    </div>
  </div>

  <div class="absolute top-4 right-8 flex gap-2 invisible md:block">
    <button
      class="text-black/50 size-10 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors dark:text-white/90 dark:hover:bg-white/10"
      type="button"
      v-if="isDev"
      @click="themeStore.toggleMode()"
    >
      <component :is="themeStore.mode === 'light' ? SunIcon : MoonIcon" class="size-8" />
    </button>
    <button
      @click="themeStore.spacing = themeStore.spacing === 'center' ? 'normal' : 'center'"
      class="text-black/50 size-10 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors dark:text-white/90 dark:hover:bg-white/10"
    >
      <PhotoIcon class="size-8" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import VotesStats from "../components/VotesStats.vue";
import VotesStatsByZone from "../components/VotesStatsByZone.vue";
import { useSectionStore } from "../store/section.store";
import { UtilService } from "../services/util.service";
import { useThemeStore } from "../store/theme.store";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/solid";
import { PhotoIcon } from "@heroicons/vue/24/outline";

const isDev = !!(import.meta as any).env.DEV;

const sectionStore = useSectionStore();
const themeStore = useThemeStore();

const cb = (_ev: any, sectionId: number, votes: Record<number | "outros", number>) => {
  sectionStore.updateSection({ sectionId: sectionId, votes });
  UtilService.playAlert();
};

onMounted(() => {
  window.electronAPI.onVotesRegistered(cb);
});

onUnmounted(() => {
  window.electronAPI.offVotesRegistered(cb);
});
</script>
