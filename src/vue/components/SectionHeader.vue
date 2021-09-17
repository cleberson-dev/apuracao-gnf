<template>
  <header class="section-header">
    <div class="left">
      <h1 class="title" :style="{ fontSize: `calc(1.8rem * ${size})` }">
        {{ leftTitle }}
      </h1>
      <h2 class="subtitle" :style="{ fontSize: `calc(1rem * ${size})` }">
        {{ leftSubtitle }}
      </h2>
    </div>
    <div class="right">
      <h1 class="title" :style="{ fontSize: `calc(2rem * ${size})` }">
        {{ rightTitle }}
      </h1>
      <h2 class="subtitle" :style="{ fontSize: `calc(1rem * ${size})` }">
        {{ rightSubtitle }}
      </h2>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    leftTitle: String,
    leftSubtitle: String,
    rightTitle: String,
    rightSubtitle: String,
    size: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}
.section-header .right {
  text-align: right;
}

.left .title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
}
.left .subtitle {
  font-size: 1rem;
  color: #909090;
  font-weight: 700;
  margin: 0;
}

.right .title {
  color: #2a9d8f;
  margin: 0;
  font-size: 2rem;
}

.right .subtitle {
  color: #909090;
  font-size: 1rem;
  margin: 0;
}

.title,
.subtitle {
  text-transform: capitalize;
}
</style>
