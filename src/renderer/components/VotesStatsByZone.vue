<template>
  <section class="votes-stats-by-zone" v-if="candidates.length > 0">
    <section-header :size="0.75" :leftTitle="zone"
      :leftSubtitle="formatNumbers(sectionStore.votosApuradosPorZona(zone)) + ' votos apurados'" :rightTitle="formatarPercentual(
        sectionStore.closedSectionsByZone(zone).length / sectionStore.sectionsByZone(zone).length
      ) + '%'
        " :rightSubtitle="'Seções totalizadas (' +
          sectionStore.closedSectionsByZone(zone).length +
          '/' +
          sectionStore.sectionsByZone(zone).length +
          ')'
          " />

    <compact-candidate featured v-for="challenger of challengers" :key="challenger.number" :name="challenger.name"
      :profilePicture="challenger.profilePicture" :color="challenger.color"
      :votes="sectionStore.votesByCandidateAndZone(challenger.number, zone)"
      :totalVotes="sectionStore.validVotesByZone(zone)" />

    <!-- <votes-diff :votesA="sectionStore.votesByCandidateAndZone(challengers[0].number, zone)"
      :votesB="sectionStore.votesByCandidateAndZone(challengers[1].number, zone)" :size="0.8" /> -->

    <div class="flex justify-between flex-wrap mt-4 gap-4">
      <compact-candidate v-for="candidato in otherCandidates" :key="candidato.number" :name="candidato.name"
        :profilePicture="candidato.profilePicture" :color="candidato.color"
        :votes="sectionStore.votesByCandidateAndZone(candidato.number, zone)"
        :totalVotes="sectionStore.validVotesByZone(zone)" />
      <compact-candidate name="Brancos, nulos e abstenções" color="red" :votes="sectionStore.nullVotesByZone(zone)"
        :totalVotes="sectionStore.votosApuradosPorZona(zone)" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

import CompactCandidate from "./CompactCandidate.vue";
import SectionHeader from "./SectionHeader.vue";
import CandidateService from "../services/candidate.service";
import { sortCandidates } from "../utils";
import { useSectionStore } from "../store/section.store";
import { formatNumbers } from '../utils'

const sectionStore = useSectionStore();

defineProps({
  zone: {
    type: String,
    required: true,
    validate: (val: any) => ["urbana", "rural"].findIndex(val) !== -1,
  },
});

const candidates = CandidateService.getAll();

const challengers = computed(() => {
  return [22, 40, 44].map(num => candidates.find(c => c.number === num)!);
});
const otherCandidates = computed(() => {
  const sortedCandidates = sortCandidates(candidates.filter(c => ![22, 40, 44].includes(c.number === "outros" ? 0 : c.number)), sectionStore.sections);
  return sortedCandidates;
});

function formatarPercentual(decimal: number) {
  const val = isNaN(decimal) ? 0 : decimal;
  return (val * 100).toFixed(2).replace(".", ",");
}
</script>
