<template>
  <button
    class="rounded-md border-none outline-none font-bold text-xl px-6 py-4 cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed hover:grayscale-[0.4]"
    :disabled="disabled" :type="type" :style="{
      backgroundColor: getBgColorByVariant(variant),
      color: variant === 'light' ? 'black' : 'white',
    }">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: "button",
    validator: (value: string) => {
      return ["submit", "button"].indexOf(value) !== -1;
    },
  },
  variant: {
    type: String,
    default: "primary",
    validator: (value: string) => {
      return (
        ["primary", "light", "dark", "danger", "warn"].indexOf(value) !== -1
      );
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const getBgColorByVariant = (variant: string): string => {
  return {
    primary: '#0066ff',
    danger: '#e63946',
    warn: '#fb5607',
    dark: 'black',
    light: 'white',
  }[variant] ?? '';
}
</script>
