<template>
  <section class="flex-grow-[3] h-[100svh] shadow-lg px-10 py-4 dark:text-white/80 flex flex-col justify-center"
    v-if="candidates.length > 0">
    <h1 class="text-lg font-extrabold w-full" :style="{ color: '#2E3790' }">Apuração paralela Gov. Nunes
      Freire - MA
      <small class="m-0 font-normal text-sm opacity-60 block" v-if="formattedLatestUpdate">
        Última Atualização: {{ formattedLatestUpdate }}
      </small>
    </h1>
    <section-header leftTitle="VOTAÇÃO GERAL"
      :leftSubtitle="`${formatNumbers(sectionStore.votosApurados)} votos apurados`" :rightTitle="formatarPercentual(sectionStore.closedSections.length / sectionStore.allSections.length) + '%'
        " leftTitleColor="#2E3790"
      :rightSubtitle="`Seções totalizadas (${sectionStore.closedSections.length}/${sectionStore.allSections.length})`" />

    <candidate featured principal :name="challengers[0].name" :profilePicture="challengers[0].profilePicture"
      :color="challengers[0].color" :votes="sectionStore.votesByCandidate(challengers[0].number)"
      :totalVotes="sectionStore.validVotes" :size="5" />

    <votes-diff :votesA="sectionStore.votesByCandidate(challengers[0].number)"
      :votesB="sectionStore.votesByCandidate(challengers[1].number)" />

    <candidate class="ml-[3.03rem]" featured :name="challengers[1].name" :profilePicture="challengers[1].profilePicture"
      :color="challengers[1].color" :votes="sectionStore.votesByCandidate(challengers[1].number)"
      :totalVotes="sectionStore.validVotes" :size="3.5" />

    <votes-diff :votesA="sectionStore.votesByCandidate(challengers[0].number)"
      :votesB="sectionStore.votesByCandidate(challengers[2].number)" />

    <candidate class="ml-[3.03rem]" featured :name="challengers[2].name" :profilePicture="challengers[2].profilePicture"
      :color="challengers[2].color" :votes="sectionStore.votesByCandidate(challengers[2].number)"
      :totalVotes="sectionStore.validVotes" :size="3.5" />

    <div class="mt-12 flex justify-between flex-wrap">
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
import { sortCandidates, formatNumbers } from "../utils";
import CandidateService from "../services/candidate.service";
import { useSectionStore } from "../store/section.store";
import { useMainStore } from "../store/main.store";

const mainStore = useMainStore();
const sectionStore = useSectionStore();

const candidates = CandidateService.getAll();
const challengers = computed(() => {
  return [22, 40, 44].map(num => candidates.find(c => c.number === num)!);
});
const otherCandidates = computed(() => {
  const sortedCandidates = sortCandidates(candidates.filter(c => ![22, 40, 44].includes(c.number === "outros" ? 0 : c.number)), sectionStore.sections);
  return sortedCandidates;
});

const formattedLatestUpdate = computed(() => mainStore.latestUpdate ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "medium" }).format(mainStore.latestUpdate) : undefined)

const formatarPercentual = (decimal: number) => {
  const val = isNaN(decimal) ? 0 : decimal;
  return (val * 100).toFixed(2).replace(".", ",");
} 
</script>