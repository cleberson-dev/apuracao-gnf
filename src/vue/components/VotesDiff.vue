<template>
  <p
    :class="['diff', difference >= 0 ? 'positive' : 'negative']"
    :style="{ fontSize: `calc(1.25rem * ${size})` }"
  >
    {{ difference >= 0 ? "+" : "-" }}
    {{ Math.abs(difference) }}
    <span class="legend" :style="{ fontSize: `calc(0.75rem * ${size})` }"
      >Diferença de votos</span
    >
  </p>
</template>

<script>
export default {
  props: {
    votesA: Number,
    votesB: Number,
    size: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    difference() {
      return this.votesA - this.votesB;
    },
  },
};
</script>

<style scoped>
.diff {
  font-weight: 700;
  width: 100%;
  text-align: right;
  display: flex;
  flex-direction: column;
  margin: 0;
  color: black;
}

.diff span {
  text-transform: uppercase;
  font-weight: 500;
  color: black;
}

.diff.positive {
  color: #2b9348;
}

.diff.negative {
  color: #d62828;
}
</style>
