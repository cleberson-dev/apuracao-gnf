<template>
  <section class="apuracao-geral" v-if="store.getters.sortedCandidates.length > 0">
    <h1 class="pageTitle">Apuração Paralela de Gov. Nunes Freire - MA</h1>
    <section-header leftTitle="Geral" :leftSubtitle="store.getters.votosApurados + ' votos apurados'" :rightTitle="formatarPercentual(store.getters.closedSections.length / store.getters.allSections.length) + '%'
      " :rightSubtitle="'Seções totalizadas (' +
        store.getters.closedSections.length +
        '/' +
        store.getters.allSections.length +
        ')'
        " />

    <candidate featured :name="challengers[0].name" :profilePicture="challengers[0].profilePicture"
      :color="challengers[0].color" :votes="store.getters.votesByCandidate(challengers[0].number)"
      :totalVotes="store.getters.validVotes" />

    <votes-diff :votesA="store.getters.votesByCandidate(challengers[0].number)"
      :votesB="store.getters.votesByCandidate(challengers[1].number)" />

    <candidate featured :name="challengers[1].nome" :profilePicture="challengers[1].profilePicture"
      :color="challengers[1].color" :votes="store.getters.votesByCandidate(challengers[1].number)"
      :totalVotes="store.getters.validVotes" />

    <div class="other-candidates">
      <candidate v-for="candidate in otherCandidates" :key="candidate.number" :name="candidate.name"
        :profilePicture="candidate.profilePicture" :color="candidate.color"
        :votes="store.getters.votesByCandidate(candidate.number)" :totalVotes="store.getters.validVotes" />

      <candidate key="null" name="Brancos, nulos e abstenções" color="red" :votes="store.getters.nullVotes"
        :totalVotes="store.getters.votosApurados" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import Candidate from "./Candidate.vue";
import SectionHeader from "./SectionHeader.vue";
import VotesDiff from "./VotesDiff.vue";

const store = useStore();

const challengers = computed(() => {
  return store.getters.sortedCandidates.slice(0, 2);
});
const otherCandidates = computed(() => {
  return store.getters.sortedCandidates.slice(2);
});

const formatarPercentual = (decimal: number) => {
  const val = isNaN(decimal) ? 0 : decimal;
  return (val * 100).toFixed(2).replace(".", ",");
} 
</script>

<style scoped>
.pageTitle {
  font-size: 2rem;
  font-weight: 800;
  width: 100%;
  margin-top: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.header .right {
  text-align: right;
}

section.apuracao-geral {
  flex-grow: 3;
  min-height: 100%;
  background-color: white;
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.25);
  padding: 60px 40px;
}

section.apuracao-geral .header {
  margin-bottom: 1.6rem;
}

section.apuracao-geral .other-candidates {
  margin-top: 5rem;
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;
  height: 160px;
}

.apuracao-geral .titulo-apuracao {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
}

.apuracao-geral .subtitulo-apuracao {
  font-size: 1rem;
  color: #909090;
  font-weight: 700;
  margin: 0;
}

.apuracao-geral .secoes-rel {
  color: #2a9d8f;
  margin: 0;
  font-size: 2rem;
}

.apuracao-geral .secoes-abs {
  color: #909090;
  font-size: 1rem;
  margin: 0;
}
</style>
