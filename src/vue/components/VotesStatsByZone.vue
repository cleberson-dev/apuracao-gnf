<template>
  <section class="votes-stats-by-zone" v-if="candidates.length > 0">
    <section-header :size="0.75" :leftTitle="zone"
      :leftSubtitle="store.getters.votosApuradosPorZona(zone) + ' votos apurados'" :rightTitle="formatarPercentual(
        store.getters.closedSectionsByZone(zone).length / store.getters.sectionsByZone(zone).length
      ) + '%'
        " :rightSubtitle="'Seções totalizadas (' +
          store.getters.closedSectionsByZone(zone).length +
          '/' +
          store.getters.sectionsByZone(zone).length +
          ')'
          " />

    <compact-candidate featured :key="challengers[0].number" :name="challengers[0].name"
      :profilePicture="challengers[0].profilePicture" :color="challengers[0].color"
      :votes="store.getters.votesByCandidateAndZone(challengers[0].number, zone)"
      :totalVotes="store.getters.validVotesByZone(zone)" />

    <votes-diff :votesA="store.getters.votesByCandidateAndZone(challengers[0].number, zone)"
      :votesB="store.getters.votesByCandidateAndZone(challengers[1].number, zone)" :size="0.8" />

    <compact-candidate featured :key="challengers[1].number" :name="challengers[1].name"
      :profilePicture="challengers[1].profilePicture" :color="challengers[1].color"
      :votes="store.getters.votesByCandidateAndZone(challengers[1].number, zone)"
      :totalVotes="store.getters.validVotesByZone(zone)" />

    <div class="other-candidates">
      <compact-candidate v-for="candidato in otherCandidates" :key="candidato.number" :name="candidato.name"
        :profilePicture="candidato.profilePicture" :color="candidato.color"
        :votes="store.getters.votesByCandidateAndZone(candidato.number, zone)"
        :totalVotes="store.getters.validVotesByZone(zone)" />
      <compact-candidate name="Brancos, nulos e abstenções" color="red" :votes="store.getters.nullVotesByZone(zone)"
        :totalVotes="store.getters.votosApuradosPorZona(zone)" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

import CompactCandidate from "./CompactCandidate.vue";
import SectionHeader from "./SectionHeader.vue";
import VotesDiff from "./VotesDiff.vue";
import CandidateService from "../services/candidate.service";
import { sortCandidates } from "../utils";

const store = useStore();

defineProps({
  zone: {
    type: String,
    required: true,
    validate: (val: any) => ["urbana", "rural"].findIndex(val) !== -1,
  },
});

const candidates = CandidateService.getAll();
const sortedCandidates = computed(() => sortCandidates(candidates, store.state.sections.sections));

const challengers = computed(() => {
  return sortedCandidates.value.slice(0, 2);
});
const otherCandidates = computed(() => {
  return sortedCandidates.value.slice(2);
});

function formatarPercentual(decimal: number) {
  const val = isNaN(decimal) ? 0 : decimal;
  return (val * 100).toFixed(2).replace(".", ",");
}
</script>

<style scoped>
.left .title {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}

.left .subtitle {
  font-size: 0.8rem;
  color: #909090;
  font-weight: 700;
  margin: 0;
}

.right .title,
.right .subtitle {
  margin: 0;
}

.right .title {
  font-size: 1rem;
  color: #2a9d8f;
}

.right .subtitle {
  color: #909090;
  font-size: 0.8rem;
}

.other-candidates {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1.1rem;
}

.other-candidates .compact-candidate_mini {
  margin-right: 2rem;
  margin-bottom: 1rem;
}

.diff {
  margin-bottom: 1rem;
}
</style>
