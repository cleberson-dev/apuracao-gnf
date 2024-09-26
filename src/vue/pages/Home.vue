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
import VotesStats from "../components/VotesStats.vue";
import VotesStatsByZone from "../components/VotesStatsByZone.vue";
</script>