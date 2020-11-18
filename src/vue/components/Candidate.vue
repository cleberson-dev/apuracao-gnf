<template>
  <div v-if="featured" :class="['candidate', gray ? 'gray' : '' ]">
    <circular-picture :src="profilePicture" :size="size" :color="color" />
    <div class="info">
      <div
        class="bar"
        :style="{
          backgroundColor: color,
          width: `calc(100% * ${percentage})`,
        }"
      ></div>
      <div class="votes">
      <p :style="{ color: color }" class="abs-votes">{{ votes }}</p>
      <p v-if="votes > 0" :style="{ color: color }" class="rel-votes">
        {{ formattedPercentage }}%
      </p>
    </div>
    </div>
    
  </div>

  <div v-else class="candidate_compact">
    <figure
      class="profile-picture"
      alt="Foto do candidato"
      :style="{
        borderColor: color,
        backgroundImage: `url(${profilePicture})`,
      }"
    />
    <div class="info">
      <p class="name">{{ name }}</p>
      <p class="abs-votes">{{ votes }} votos</p>
      <p class="rel-votes" :style="{ color: color }">
        {{ formattedPercentage }}%
      </p>
    </div>
  </div>
</template>


<script>
import CircularPicture from "./CircularPicture.vue";

export default {
  components: {
    CircularPicture,
  },
  props: {
    name: {
      type: String,
      required: false,
      default: ""
    },
    votes: {
      type: Number,
      default: 0,
    },
    totalVotes: Number,
    profilePicture: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#000",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    gray: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 4
    }
  },
  computed: {
    percentage() {
      return this.votes / this.totalVotes;
    },
    formattedPercentage() {
      const val = isNaN(this.percentage) ? 0 : this.percentage;
      return (val * 100).toFixed(2).replace(".", ",");
    },
  },
};
</script>

<style scoped>
.candidate {
  display: flex;
  align-items: center;
  position: relative;
}

.candidate.gray figure {
  filter: grayscale(0.7);
}

.candidate .info {
  display: flex;
  flex-grow: 1;
  z-index: 2;
  margin-left: 5px;
}

.candidate .bar-wrapper {
  display: flex;
  align-items: center;
}

.candidate .bar {
  content: "";
  height: 60px;
  max-width: 100%;
  border-radius: 6px;
}

.candidate .profile-picture {
  width: 140px;
  height: 140px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  border: 5px solid;
  margin: 0;
  z-index: 3;
}

.candidate p {
  margin: 0;
}

.candidate .votes {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
}

.candidate .abs-votes {
  font-size: 2.5rem;
  font-weight: 700;
  margin-left: 5px;
}

.candidate .rel-votes {
  font-size: 1.5rem;
  font-weight: 800;
  position: absolute;
  bottom: -30px;
}

.candidate_compact {
  display: flex;
  margin-right: 3rem;
  margin-bottom: 2rem;
}

.candidate_compact .info {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 10px;
}

.candidate_compact .name {
  font-size: 0.9rem;
  font-weight: 700;
}

.candidate_compact .abs-votes {
  color: #909090;
  font-weight: 700;
  font-size: 0.8rem;
}

.candidate_compact .rel-votes {
  font-weight: 700;
  font-size: 0.9rem;
  justify-self: flex-end;
}

.candidate_compact p {
  margin: 0;
}

.candidate_compact .profile-picture {
  width: 45px;
  height: 45px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  border: 5px solid;
  margin: 0;
  background-color: #C4C4C4;
}
</style>