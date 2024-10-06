<template>
  <div
    v-if="featured"
    :class="['flex items-center relative gap-1', gray ? 'gray' : '']"
    :title="name"
  >
    <div class="relative flex flex-col">
      <circular-picture
        :src="profilePicture ?? '/empty-profile-picture.png'"
        :size="size"
        :color="color"
      />
    </div>
    <div class="flex flex-grow z-10">
      <div class="relative flex-grow flex">
        <p
          class="text-nowrap absolute font-bold"
          :class="principal ? 'text-2xl -top-8' : 'text-sm -top-5'"
        >
          {{ name }}
        </p>
        <div
          class="h-16 max-w-full rounded-md"
          :style="{
            backgroundColor: color,
            width: `calc(100% * ${percentage})`,
            content: '',
          }"
        ></div>
        <div class="flex flex-col items-end relative">
          <p :style="{ color }" class="text-4xl font-bold ml-2 translate-y-2">
            {{ formatNumbers(votes) }}
          </p>
          <p
            v-if="votes > 0"
            :style="{ color }"
            class="text-2xl font-bold absolute -bottom-8"
          >
            {{ formattedPercentage }}%
          </p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex gap-3" :title="name">
    <figure
      class="size-11 bg-cover bg-center rounded-full border-4 border-solid m-0 bg-[#c4c4c4]"
      alt="Foto do candidato"
      :style="{
        borderColor: color,
        backgroundImage: `url(${profilePicture})`,
      }"
    />
    <div class="flex flex-col h-100">
      <p class="font-bold text-sm">{{ name }}</p>
      <p class="text-[#909090] font-bold text-xs">{{ formatNumbers(votes) }} votos</p>
      <p class="font-bold text-sm justify-self-end" :style="{ color: color }">
        {{ formattedPercentage }}%
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import CircularPicture from "./CircularPicture.vue";
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
  gray: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "normal",
  },
  principal: {
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
