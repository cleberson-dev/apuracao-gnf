<template>
  <div v-if="featured">
    <div class="flex items-center justify-start">
      <div class="flex-grow">
        <Bar compact :color="color" :percentage="percentage" />
      </div>
      <circular-picture :src="profilePicture" :color="color" size="smaller" />
      <p class="font-bold m-0 ml-1 text-lg" :style="{ color: color }">
        {{ formattedPercentage }}%
      </p>
    </div>
    <p class="font-bold m-0 text-sm" :style="{ color: color }">
      {{ formatNumbers(votes) }} votos
    </p>
  </div>

  <div v-else class="compact-candidate_mini flex">
    <circular-picture :src="profilePicture" :color="color" size="small" />
    <div class="flex flex-col justify-between ml-2">
      <p class="text-base font-bold m-0" :style="{ color: color }">
        {{ formattedPercentage }}%
      </p>
      <p class="text-xs font-bold text-[#909090] m-0">{{ formatNumbers(votes) }} votos</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CircularPicture from "./CircularPicture.vue";
import Bar from "./Bar.vue";
import { formatNumbers } from "../utils";

const props = defineProps({
  name: {
    type: String,
    required: false,
    default: "",
  },
  votes: {
    type: Number,
    default: 0,
  },
  totalVotes: Number,
  profilePicture: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "#000",
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

const percentage = computed(() => props.totalVotes && props.votes / props.totalVotes);
const formattedPercentage = computed(() => {
  const val =
    percentage.value === undefined || isNaN(percentage.value) ? 0 : percentage.value;
  return (val * 100).toFixed(2).replace(".", ",");
});
</script>
