<script setup lang="ts">
defineProps<{
  color: string;
  percentage?: number; // Between 0 and 1
  compact?: boolean;
  highlighted?: boolean;
}>();
</script>
<template>
  <div
    class="max-w-full rounded-md"
    :class="[compact ? 'h-5' : 'h-8 md:h-16', highlighted ? 'highlighted' : '']"
    :style="{
      backgroundColor: color,
      width: `calc(100% * ${percentage ?? 0})`,
      content: '',
    }"
  ></div>
</template>

<style>
.highlighted {
  --stripe-color: rgba(0, 0, 0, 0.3);
  background: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 15px,
    var(--stripe-color) 15px,
    var(--stripe-color) 30px
  );
  /* on "bottom" linear-gradient(to bottom, #eee, #999); */
}
</style>
