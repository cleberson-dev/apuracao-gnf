<template>
  <figure
    class="circular-picture"
    :alt="description"
    :style="{
      borderColor: color,
      borderWidth: `calc(borderWidth * 1px)`,
      backgroundImage: `url(${src})`,
      width: `calc(2rem * ${size})`,
      height: `calc(2rem * ${size})`,
    }"
  />
</template>

<script>
export default {
  props: {
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
  },
};
</script>

<style scoped>
.circular-picture {
  border-radius: 50%;
  border-style: solid;
  margin: 0;
  background-size: cover;
  background-position: center;
  background-color: #c4c4c4;
}
</style>
