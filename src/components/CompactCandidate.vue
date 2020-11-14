<template>
  <div v-if="featured" class="compact-candidate">
    <div class="stats">
      <div 
        class="bar-wrapper"
        :style="{ flexGrow: 1 }"
      >
        <div
          class="bar"
          :style="{
            backgroundColor: color,
            width: `calc(100% * ${percentage})`
          }"
        />
      </div>
      <circular-picture 
        :src="profilePicture"
        :color="color"
        :size="1"
      />
      <p class="rel-votes" :style="{ color: color }">{{formattedPercentage}}%</p>
    </div>
    <p class="abs-votes" :style="{ color: color }">{{votes}} votos</p>
  </div>

  <div v-else class="compact-candidate_mini">
    <circular-picture 
      :src="profilePicture"
      :color="color"
      :size="1"
    />
    <div class="votes">
      <p class="relative" :style="{ color: color }">{{formattedPercentage}}%</p>
      <p class="absolute">{{votes}} votos</p>
    </div>
  </div>
</template>

<script>
import CircularPicture from './CircularPicture';

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
.compact-candidate .stats {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.compact-candidate .bar {
  flex-grow: 1;
  height: 20px;
  border-radius: 4px;
}

.compact-candidate .rel-votes,
.compact-candidate .abs-votes {
  font-weight: 700;
  margin: 0;
}
.compact-candidate .rel-votes { font-size: 1.1rem; }
.compact-candidate .abs-votes { font-size: 0.9rem; }


.compact-candidate .rel-votes { margin-left: 5px; }


.compact-candidate_mini {
  display: flex;
}

.compact-candidate_mini .votes p { margin: 0; }

.compact-candidate_mini .votes {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
}

.compact-candidate_mini .votes .relative {
  font-size: 1rem;
  font-weight: 700;
}

.compact-candidate_mini .votes .absolute {
  font-size: 0.8rem;
  font-weight: 700;
  color: #909090;
}
</style>