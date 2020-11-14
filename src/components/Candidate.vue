<template>
  <div v-if="featured" class="candidate">
    <div class="info">
      <p :style="{ color: color }" class="rel-votes">
        {{ formattedPercentage }}%
      </p>
      <div
        class="bar"
        :style="{ backgroundColor: color, width: `calc(100% * ${percentage})` }"
      ></div>
      <p :style="{ color: color }" class="abs-votes">{{ votes }} votos</p>
    </div>
    <circular-picture 
      :src="profilePicture"
      :size="4"
      :color="color"
    />
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
      <p 
        class="rel-votes"
        :style="{ color: color }"
      >{{ formattedPercentage }}%</p>
    </div>
  </div>
</template>


<script>
import CircularPicture from './CircularPicture.vue';

export default {
  components: {
    CircularPicture
  },
  props: {
    name: {
      type: String,
    },
    votes: {
      type: Number,
      default: 0
    },
    totalVotes: Number,
    profilePicture: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: "#000",
    },
    featured: {
      type: Boolean,
      default: false,
    },
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
  justify-content: space-between;
  align-items: center;
}

.candidate .info {
  flex-grow: 1;
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
}

.candidate p {
  margin: 0;
}

.candidate .abs-votes {
  font-size: 1.75rem;
  font-weight: 700;
}

.candidate .rel-votes {
  font-size: 2.5rem;
  font-weight: 800;
}



.candidate_compact {
  display: flex;  
}

.candidate_compact .info {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 10px;
}

.candidate_compact .name {
  font-size: 1rem;
  font-weight: 700;
}

.candidate_compact .abs-votes {
  color: #909090;
  font-weight: 700;
}

.candidate_compact .rel-votes {
  font-weight: 700;
  font-size: 26px;
  justify-self: flex-end;
}

.candidate_compact p {
  margin: 0;
}

.candidate_compact .profile-picture {
  width: 60px;
  height: 60px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  border: 5px solid;
  margin: 0;
  background-color: #C4C4C4;
}
</style>