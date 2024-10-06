<template>
  <section
    class="flex-grow-[3] h-[100svh] shadow-lg px-3 md:px-10 py-4 dark:text-white/80 flex flex-col justify-center"
    v-if="candidates.length > 0"
    :class="{ 'pl-36': themeStore.spacing === 'center' }"
  >
    <div class="flex flex-col md:flex-row items-start md:mb-2">
      <div class="flex-grow text-[#2E3790]">
        <h1 class="text-sm md:text-lg font-extrabold">
          Apuração paralela Gov. Nunes Freire - MA
        </h1>
        <p class="uppercase font-bold text-xl md:text-3xl">Votação Geral</p>
        <p
          class="m-0 font-normal text-sm block text-[#909090]"
          v-if="formattedLatestUpdate"
        >
          Última Atualização: {{ formattedLatestUpdate }}
        </p>
      </div>
      <div
        class="text-left md:text-right font-bold flex md:flex-col md:mb-4 mt-2 md:mt-0 justify-between md:justify-start w-full md:w-fit items-center md:items-end"
      >
        <div>
          <h1 class="text-primary text-[1.6rem]">
            {{
              formatarPercentual(sectionStore.countedVotes / sectionStore.totalVoters)
            }}%
          </h1>
          <h2 class="text-[#909090] text-xs">
            Votos apurados ({{ formatNumbers(sectionStore.countedVotes) }}/{{
              formatNumbers(sectionStore.totalVoters)
            }})
          </h2>
        </div>
        <div class="text-right">
          <h1 class="text-primary text-[1.6rem] md:text-[2rem]">
            {{
              formatarPercentual(
                sectionStore.closedSections.length / sectionStore.sections.length
              )
            }}%
          </h1>
          <h2 class="text-[#909090] text-xs md:text-base">
            Seções totalizadas ({{ sectionStore.closedSections.length }}/{{
              sectionStore.sections.length
            }})
          </h2>
        </div>
      </div>
    </div>
    <div class="flex flex-col flex-grow justify-center md:justify-start md:flex-grow-0">
      <candidate
        featured
        principal
        :name="challengers[0].name"
        :profilePicture="challengers[0].profilePicture"
        :color="challengers[0].color"
        :votes="sectionStore.votesByCandidate(challengers[0].number)"
        :totalVotes="sectionStore.validVotes"
        size="large"
        :hasWon="config.ENABLE_PREDICT_WINNER && hasPrincipalWon"
      />

      <votes-diff
        :votesA="sectionStore.votesByCandidate(challengers[0].number)"
        :votesB="sectionStore.votesByCandidate(challengers[1].number)"
      />

      <candidate
        class="ml-4 md:ml-[3.03rem]"
        featured
        :name="challengers[1].name"
        :profilePicture="challengers[1].profilePicture"
        :color="challengers[1].color"
        :votes="sectionStore.votesByCandidate(challengers[1].number)"
        :totalVotes="sectionStore.validVotes"
        :hasLost="config.ENABLE_PREDICT_WINNER && hasPrincipalWon"
      />

      <votes-diff
        :votesA="sectionStore.votesByCandidate(challengers[0].number)"
        :votesB="sectionStore.votesByCandidate(challengers[2].number)"
      />

      <candidate
        class="ml-4 md:ml-[3.03rem]"
        featured
        :name="challengers[2].name"
        :profilePicture="challengers[2].profilePicture"
        :color="challengers[2].color"
        :votes="sectionStore.votesByCandidate(challengers[2].number)"
        :totalVotes="sectionStore.validVotes"
        :hasLost="config.ENABLE_PREDICT_WINNER && hasPrincipalWon"
      />
    </div>
    <div
      class="flex justify-between flex-wrap mt-2 md:mt-12 content-center md:content-start gap-3 md:gap-0"
    >
      <candidate
        v-for="candidate of otherCandidates"
        :key="candidate.number"
        :name="candidate.name"
        :profilePicture="candidate.profilePicture"
        :color="candidate.color"
        :votes="sectionStore.votesByCandidate(candidate.number)"
        :totalVotes="sectionStore.validVotes"
      />

      <candidate
        name="Brancos, nulos e abstenções"
        color="red"
        :votes="sectionStore.nullVotes"
        :totalVotes="sectionStore.countedVotes"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Candidate from "./Candidate.vue";
import VotesDiff from "./VotesDiff.vue";
import { sortCandidates, formatNumbers } from "../utils";
import CandidateService from "../services/candidate.service";
import { useSectionStore } from "../store/section.store";
import { useMainStore } from "../store/main.store";
import { useThemeStore } from "../store/theme.store";
import { UtilService } from "../services/util.service";

const config = UtilService.getConfig();

const mainStore = useMainStore();
const sectionStore = useSectionStore();
const themeStore = useThemeStore();

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

const formattedLatestUpdate = computed(() =>
  mainStore.latestUpdate
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(mainStore.latestUpdate)
    : undefined
);

const hasPrincipalWon = computed(() => {
  if (!config.ENABLE_PREDICT_WINNER) return false;

  const sortedCandidatesByVote = candidates
    .map((c) => ({ ...c, totalVotes: sectionStore.votesByCandidate(c.number) }))
    .sort((a, b) => b.totalVotes - a.totalVotes);

  const principalIdx = sortedCandidatesByVote.findIndex((c) => c.number === 22)!;
  if (principalIdx !== 0) return false;

  const [principal, secondPlace] = sortedCandidatesByVote;
  const difference = principal.totalVotes - secondPlace.totalVotes;

  return (
    difference > 0 && difference > sectionStore.totalVoters - sectionStore.countedVotes
  );
});

const formatarPercentual = (decimal: number) => {
  const val = isNaN(decimal) ? 0 : decimal;
  return (val * 100).toFixed(2).replace(".", ",");
};
</script>
