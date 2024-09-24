<template>
  <button :class="['btn', variant]" @click="$emit('click', $event)" :disabled="disabled" :type="type">
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
</script>

<style scoped>
.btn {
  border-radius: 5px;
  font-family: "Montserrat", sans-serif;
  border: none;
  outline: none;
  font-weight: 700;
  font-size: 1.3rem;
  padding: 15px 22.5px;
  cursor: pointer;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:hover {
  filter: grayscale(0.4);
}

.btn.primary {
  background-color: #0066ff;
}

.btn.danger {
  background-color: #e63946;
}

.btn.warn {
  background-color: yellow;
}

.btn.dark {
  background-color: black;
}

.btn.light {
  background-color: white;
  color: black;
}
</style>
