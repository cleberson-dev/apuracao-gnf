<template>
  <header class="flex justify-between items-start capitalize dark:text-white/80">
    <div>
      <h1 class="font-bold" :style="{ fontSize: `calc(1.8rem * ${size})`, color: leftTitleColor ?? '' }">
        {{ leftTitle }}
      </h1>
      <h2 class="text-[#909090] font-bold" :style="{ fontSize: `calc(1rem * ${size})` }">
        {{ leftSubtitle }}
      </h2>
    </div>
    <div class="text-right">
      <h1 class="m-0 text-primary font-bold" :style="{ fontSize: `calc(2rem * ${size})` }">
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
  leftTitleColor: String,
  leftSubtitle: String,
  rightTitle: String,
  rightSubtitle: String,
  size: {
    type: Number,
    default: 1,
  },
});
</script>
