<template>
  <section class="votes-stats-by-zone" v-if="candidates.length > 0">
    <section-header
      class="mb-4"
      :size="0.75"
      :leftTitle="zone"
      :leftSubtitle="`${formatNumbers(
        sectionStore.countedVotesByZone(zone)
      )} votos apurados`"
      :rightTitle="`${formatarPercentual(
        sectionStore.closedSectionsByZone(zone).length /
          sectionStore.sectionsByZone(zone).length
      )}%`"
      :rightSubtitle="`Seções totalizadas (${
        sectionStore.closedSectionsByZone(zone).length
      }/${sectionStore.sectionsByZone(zone).length})`"
    />

    <compact-candidate
      featured
      v-for="challenger of challengers"
      :key="challenger.number"
      :name="challenger.name"
      :profilePicture="challenger.profilePicture"
      :color="challenger.color"
      :votes="sectionStore.votesByCandidateAndZone(challenger.number, zone)"
      :totalVotes="totalValidVotes"
    />

    <div class="flex justify-between flex-wrap mt-4 gap-4">
      <compact-candidate
        v-for="candidate of otherCandidates"
        :key="candidate.number"
        :name="candidate.name"
        :profilePicture="candidate.profilePicture"
        :color="candidate.color"
        :votes="sectionStore.votesByCandidateAndZone(candidate.number, zone)"
        :totalVotes="totalValidVotes"
      />
      <compact-candidate
        name="Brancos, nulos e abstenções"
        color="red"
        :votes="sectionStore.nullVotesByZone(zone)"
        :totalVotes="sectionStore.countedVotesByZone(zone)"
      />
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
import { formatNumbers } from "../utils";

const sectionStore = useSectionStore();

const props = defineProps({
  zone: {
    type: String,
    required: true,
    validate: (val: any) => ["urbana", "rural"].findIndex(val) !== -1,
  },
});

const candidates = CandidateService.getAll();

const challengers = computed(() => {
  return [22, 40, 44].map((num) => candidates.find((c) => c.number === num)!);
});
const otherCandidates = computed(() => {
  const sortedCandidates = sortCandidates(
    candidates.filter(
      (c) => ![22, 40, 44].includes(c.number === "outros" ? 0 : c.number)
    ),
    sectionStore.sections
  );
  return sortedCandidates;
});

function formatarPercentual(decimal: number) {
  const val = isNaN(decimal) ? 0 : decimal;
  return (val * 100).toFixed(2).replace(".", ",");
}

const totalValidVotes = computed(() =>
  sectionStore.sections
    .filter((section) => section.zone === props.zone && !!section.closed)
    .reduce(
      (total, section) =>
        total + Object.values(section.votes).reduce((votes, count) => votes + count, 0),
      0
    )
);
</script>
