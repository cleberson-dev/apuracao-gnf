<template>
  <figure
    :class="[
      'rounded-full border-solid m-0 bg-cover bg-center bg-[#c4c4c4]',
      gray ? 'grayscale-[0.7]' : '',
    ]"
    :alt="description"
    :style="{
      borderColor: color,
      borderWidth: `calc(${borderWidth} * 1px)`,
      backgroundImage: `url(${src})`,
      width: `calc(2rem * ${size})`,
      height: `calc(2rem * ${size})`,
    }"
  />
</template>

<script setup lang="ts">
defineProps({
  description: {
    type: String,
    default: "",
  },
  src: {
    type: String,
    default: "",
  },
  size: {
    type: Number,
    default: 1,
  },
  color: {
    type: String,
    default: "#000",
  },
  borderWidth: {
    type: Number,
    default: 1,
  },
  gray: {
    type: Boolean,
    default: false,
  },
});
</script>
