<template>
  <div class="home">
    <votes-stats />
    
    <div class="filtros">
      <votes-stats-by-zone zone="urbana" />
      <votes-stats-by-zone zone="rural" />
    </div>
  </div>
</template>

<script>
import VotesStats from "../components/VotesStats";
import VotesStatsByZone from "../components/VotesStatsByZone";

export default {
  components: {
    VotesStats,
    VotesStatsByZone,
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #EFEFEF;
  display: flex;
}

.filtros {
  flex-grow: 1;
  padding: 30px 40px;
  padding-right: 40px;
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>