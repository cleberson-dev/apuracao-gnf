<template>
  <p
    :class="[
      'font-bold w-full text-right flex flex-col text-black',
      difference >= 0 ? 'text-green-700' : 'text-red-700',
    ]"
    :style="{ fontSize: `calc(1.25rem * ${size})` }"
  >
    {{ difference >= 0 ? "+" : "-" }}
    {{ formatNumbers(Math.abs(difference)) }}
    <span
      class="uppercase font-medium text-black dark:text-white"
      :style="{ fontSize: `calc(0.75rem * ${size})` }"
      >Diferença de votos</span
    >
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatNumbers } from "../utils";

const props = defineProps({
  votesA: Number,
  votesB: Number,
  size: {
    type: Number,
    default: 1,
  },
});

const difference = computed(() => {
  if ([props.votesA, props.votesB].includes(undefined)) return 0;
  return props.votesA! - props.votesB!;
});
</script>
