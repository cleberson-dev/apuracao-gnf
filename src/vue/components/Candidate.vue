<template>
  <div v-if="featured" :class="['flex items-center relative', gray ? 'gray' : '']" :title="name">
    <circular-picture :src="profilePicture ?? '/empty-profile-picture.png'" :size="size" :color="color" />
    <div class="flex flex-grow z-10 ml-1">
      <div class="h-16 max-w-full rounded-md" :style="{
        backgroundColor: color,
        width: `calc(100% * ${percentage})`,
        content: '',
      }"></div>
      <div class="flex flex-col items-end relative">
        <p :style="{ color: color }" class="m-0 text-4xl font-bold ml-2 translate-y-2">{{ votes }}</p>
        <p v-if="votes > 0" :style="{ color: color }" class="m-0 text-2xl font-bold absolute -bottom-8">
          {{ formattedPercentage }}%
        </p>
      </div>
    </div>
  </div>

  <div v-else class="flex mr-12 mb-8" :title="name">
    <figure class="size-11 bg-cover bg-center rounded-full border-4 border-solid m-0 bg-[#c4c4c4]"
      alt="Foto do candidato" :style="{
        borderColor: color,
        backgroundImage: `url(${profilePicture})`,
      }" />
    <div class="flex flex-col h-100 ml-3">
      <p class="font-bold text-sm m-0">{{ name }}</p>
      <p class="text-[#909090] font-bold text-xs m-0">{{ votes }} votos</p>
      <p class="font-bold text-sm justify-self-end m-0" :style="{ color: color }">
        {{ formattedPercentage }}%
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import CircularPicture from "./CircularPicture.vue";

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
  gray: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 4,
  },
});

const percentage = computed(() => props.totalVotes && props.votes / props.totalVotes);
const formattedPercentage = computed(() => {
  const val = percentage.value === undefined || isNaN(percentage.value) ? 0 : percentage.value;
  return (val * 100).toFixed(2).replace(".", ",");
});
</script>
