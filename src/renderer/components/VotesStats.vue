<template>
  <section class="flex-grow-[3] min-h-full bg-white shadow-lg px-10 py-16" v-if="candidates.length > 0">
    <h1 class="text-3xl font-extrabold w-full mt-0 mb-4">Apuração Paralela de Gov. Nunes Freire - MA
      <small class="m-0 font-normal text-sm opacity-60 block" v-if="formattedLatestUpdate">
        Última Atualização: {{ formattedLatestUpdate }}
      </small>
    </h1>
    <section-header leftTitle="Geral" :leftSubtitle="`${sectionStore.votosApurados} votos apurados`" :rightTitle="formatarPercentual(sectionStore.closedSections.length / sectionStore.allSections.length) + '%'
      "
      :rightSubtitle="`Seções totalizadas (${sectionStore.closedSections.length}/${sectionStore.allSections.length})`" />

    <candidate featured :name="challengers[0].name" :profilePicture="challengers[0].profilePicture"
      :color="challengers[0].color" :votes="sectionStore.votesByCandidate(challengers[0].number)"
      :totalVotes="sectionStore.validVotes" />

    <votes-diff :votesA="sectionStore.votesByCandidate(challengers[0].number)"
      :votesB="sectionStore.votesByCandidate(challengers[1].number)" />

    <candidate featured :name="challengers[1].name" :profilePicture="challengers[1].profilePicture"
      :color="challengers[1].color" :votes="sectionStore.votesByCandidate(challengers[1].number)"
      :totalVotes="sectionStore.validVotes" />

    <div class="mt-20 flex justify-between flex-wrap h-[160px]">
      <candidate v-for="candidate in otherCandidates" :key="candidate.number" :name="candidate.name"
        :profilePicture="candidate.profilePicture" :color="candidate.color"
        :votes="sectionStore.votesByCandidate(candidate.number)" :totalVotes="sectionStore.validVotes" />

      <candidate name="Brancos, nulos e abstenções" color="red" :votes="sectionStore.nullVotes"
        :totalVotes="sectionStore.votosApurados" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Candidate from "./Candidate.vue";
import SectionHeader from "./SectionHeader.vue";
import VotesDiff from "./VotesDiff.vue";
import { sortCandidates } from "../utils";
import CandidateService from "../services/candidate.service";
import { useSectionStore } from "../store/section.store";
import { useMainStore } from "../store/main.store";

const mainStore = useMainStore();
const sectionStore = useSectionStore();

const candidates = CandidateService.getAll();
const sortedCandidates = computed(() => sortCandidates(candidates, sectionStore.sections));
const challengers = computed(() => {
  const sortedCandidates = sortCandidates(candidates, sectionStore.sections);
  return sortedCandidates.slice(0, 2);
});
const otherCandidates = computed(() => {
  const sortedCandidates = sortCandidates(candidates, sectionStore.sections);
  return sortedCandidates.slice(2);
});

const formattedLatestUpdate = computed(() => mainStore.latestUpdate ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" }).format(mainStore.latestUpdate) : undefined)

const formatarPercentual = (decimal: number) => {
  const val = isNaN(decimal) ? 0 : decimal;
  return (val * 100).toFixed(2).replace(".", ",");
} 
</script>