<script setup lang="ts">
defineProps<{
  color: string;
  percentage?: number; // Between 0 and 1
  compact?: boolean;
}>();
</script>
<template>
  <div
    class="max-w-full rounded-md"
    :class="[compact ? 'h-5' : 'h-8 md:h-16']"
    :style="{
      backgroundColor: color,
      width: `calc(100% * ${percentage ?? 0})`,
      content: '',
    }"
  ></div>
</template>
