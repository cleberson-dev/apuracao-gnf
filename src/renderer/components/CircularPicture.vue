<template>
  <figure
    class="rounded-full border-solid m-0 bg-cover bg-center bg-[#c4c4c4]"
    :class="{
      'grayscale-[0.7]': gray,
      'size-20 md:size-40': size === 'large',
      'size-18 md:size-32': size === 'extranormal',
      'size-16 md:size-28': size === 'normal',
      'size-14 md:size-[2.4rem]': size === 'small',
      'size-12 md:size-8': size === 'smaller',
    }"
    :alt="description"
    :style="{
      borderColor: color,
      borderWidth: `calc(${borderWidth} * 1px)`,
      backgroundImage: `url(${src})`,
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
    type: String,
    default: "normal",
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
