<template>
  <header class="flex justify-between items-start mb-4 capitalize">
    <div>
      <h1 class="font-bold m-0" :style="{ fontSize: `calc(1.8rem * ${size})` }">
        {{ leftTitle }}
      </h1>
      <h2 class="text-[#909090] font-bold m-0" :style="{ fontSize: `calc(1rem * ${size})` }">
        {{ leftSubtitle }}
      </h2>
    </div>
    <div class="text-right">
      <h1 class="m-0 text-[#2a9d8f] font-bold" :style="{ fontSize: `calc(2rem * ${size})` }">
        {{ rightTitle }}
      </h1>
      <h2 class="m-0 text-[#909090] font-bold" :style="{ fontSize: `calc(1rem * ${size})` }">
        {{ rightSubtitle }}
      </h2>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps({
  leftTitle: String,
  leftSubtitle: String,
  rightTitle: String,
  rightSubtitle: String,
  size: {
    type: Number,
    default: 1,
  },
});
</script>
