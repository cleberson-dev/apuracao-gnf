import { defineStore } from "pinia";
import type { Section, Zone } from "../../types";
import CandidateService from "../services/candidate.service";
import initialSections from "../data/secoes.json";
import { shuffleArray } from "../utils";

const candidates = CandidateService.getAll();

const getCleanVotes = () =>
  Object.fromEntries([
    ...candidates.map((candidate) => [candidate.number, 0]),
    ["outros", 0],
  ]);
const initSections = (newSections?: Section[]): Section[] => {
  return (newSections ?? initialSections).map((item, idx) => ({
    id: idx + 1,
    number: item.number,
    local: item.local,
    voters: item.voters,
    closed: false as boolean,
    zone: (item.zone as Zone) ?? "urbana",
    votes: getCleanVotes(),
  }));
};

export const useSectionStore = defineStore("sections", {
  state: () => ({ sections: initSections() }),
  getters: {
    closedSections: (state) => state.sections.filter((s) => !!s.closed),
    closedSectionsByZone: (state) => (zone: string) =>
      state.sections.filter((s) => s.zone === zone && !!s.closed),
    sortedSections: (state) =>
      state.sections.sort((a, b) => a.number.localeCompare(b.local)),
    sectionsByZone: (state) => (zone: string) =>
      state.sections.filter((s) => s.zone === zone),
    validVotes: (state) =>
      state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => {
          let votados = 0;
          for (let partidoVoto in acc.votes) {
            votados += acc.votes[partidoVoto];
          }
          return prev + votados;
        }, 0),
    totalVoters: (state) =>
      state.sections.reduce((prev, acc) => prev + acc.voters, 0),
    totalVotersByZone: (state) => (zone: string) =>
      state.sections
        .filter((s) => s.zone === zone)
        .reduce((prev, acc) => prev + acc.voters, 0),
    nullVotes: (state) =>
      state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => {
          let votados = 0;
          for (let partidoVoto in acc.votes) {
            votados += acc.votes[partidoVoto];
          }
          return prev + (acc.voters - votados);
        }, 0),
    nullVotesByZone: (state) => (zone: string) =>
      state.sections
        .filter((s) => !!s.closed && s.zone === zone)
        .reduce(
          (total, section) =>
            total +
            (section.voters -
              Object.values(section.votes).reduce(
                (count, votes) => count + votes
              )),
          0
        ),
    votesByCandidate: (state) => (candidate: number | "outros") =>
      state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => prev + acc.votes[candidate], 0),
    votesByCandidateAndZone:
      (state) => (candidate: number | "outros", zone: string) =>
        state.sections
          .filter((s) => !!s.closed && s.zone === zone)
          .reduce((prev, acc) => prev + acc.votes[candidate], 0),

    countedVotes: (state) =>
      state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => prev + acc.voters, 0),
    countedVotesByZone: (state) => (zone: string) =>
      state.sections
        .filter((s) => !!s.closed && s.zone === zone)
        .reduce((prev, acc) => prev + acc.voters, 0),
  },
  actions: {
    async registerVotes({
      sectionId,
      votes,
    }: {
      sectionId: number;
      votes: Record<number | "outros", number>;
    }) {
      const section = this.sections.find((s) => s.id === sectionId)!;
      section.votes = votes;
      section.closed = true;
    },
    cleanVotes() {
      try {
        this.sections = this.sections.map((s) => ({
          ...s,
          closed: false,
          votes: getCleanVotes(),
        }));
      } catch (err) {
        console.error(err);
      }
    },
    async cleanVotesBySection(id: number) {
      const section = this.sections.find((s) => s.id === id);
      if (!section) return console.error("Section not found");
      section.closed = false;
      section.votes = getCleanVotes();
    },
    updateSection(payload: {
      sectionId: number;
      votes: Record<number | "outros", number>;
    }) {
      const section = this.sections.find((s) => s.id === payload.sectionId);
      if (!section) return;

      section.votes = payload.votes;
      section.closed = true;
    },
    createSection(payload: Omit<Section, "id" | "votes" | "closed">) {
      this.sections.push({
        id: this.sections.at(-1)?.id ?? 1,
        votes: getCleanVotes(),
        closed: false,
        ...payload,
      });
    },
    patchSection(sectionId: number, payload: Omit<Section, "id" | "votes">) {
      const section = this.sections.find(
        (section) => section.id === sectionId
      )!;

      section.number = payload.number;
      section.local = payload.local;
      section.closed = payload.closed;
      section.voters = payload.voters;
      section.zone = payload.zone;
    },
    removeAllSections() {
      this.sections = [];
    },
    removeSection(sectionId: number) {
      this.sections = this.sections.filter((s) => s.id !== sectionId);
    },
    reset(newSections?: Section[]) {
      this.sections = initSections(newSections);
    },
    simulate() {
      const shuffledCandidates = shuffleArray(
        candidates.map((candidate) => candidate.number)
      );
      const newSections = initSections().map((stateSection) => {
        const section = { ...stateSection, closed: true };
        let left = section.voters;
        shuffledCandidates.forEach((candidateNumber) => {
          const newVotes = Math.floor(Math.random() * left);
          left -= newVotes;
          section.votes[candidateNumber as number | "outros"] = newVotes;
        });
        return section;
      });
      this.sections = newSections;
    },
  },
  persist: {
    storage: localStorage,
  },
});
