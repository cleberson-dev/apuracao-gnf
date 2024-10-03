import { defineStore } from "pinia";
import type { Section, Zone } from "../../types";
import CandidateService from "../services/candidate.service";
import initialSections from "../data/secoes.json";

const candidates = CandidateService.getAll();

const getCleanVotes = () =>
  Object.fromEntries([
    ...candidates.map((candidate) => [candidate.number, 0]),
    ["outros", 0],
  ]);
const initSections = (): Section[] => {
  return initialSections.map((item, idx) => ({
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
    section: (state) => (num: string) =>
      state.sections.find((s) => s.number === num),
    allSections: (state) =>
      state.sections.sort((a, b) => Number(a.number) - Number(b.number)),
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
    validVotesByZone: (state) => (zone: string) =>
      state.sections
        .filter((s) => s.zone === zone && !!s.closed)
        .reduce((prev, acc) => {
          let votados = 0;
          for (let partidoVoto in acc.votes) {
            votados += acc.votes[partidoVoto];
          }
          return prev + votados;
        }, 0),
    votesCounted: (state) =>
      state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => {
          let votados = 0;
          for (let partidoVoto in acc.votes) {
            votados += acc.votes[partidoVoto];
          }
          return prev + votados;
        }, 0),
    votesCountedByZone: (state) => (zone: string) =>
      state.sections
        .filter((s) => !!s.closed && s.zone === zone)
        .reduce((prev, acc) => {
          let votados = 0;
          for (let partidoVoto in acc.votes) {
            votados += acc.votes[partidoVoto];
          }
          return prev + votados;
        }, 0),
    totalElectors: (state) =>
      state.sections.reduce((prev, acc) => prev + acc.voters, 0),
    totalElectorsByZone: (state) => (zone: string) =>
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
        .reduce((prev, acc) => {
          let votados = 0;
          for (let partidoVoto in acc.votes) {
            votados += acc.votes[partidoVoto];
          }
          return prev + (acc.voters - votados);
        }, 0),
    votesByCandidate: (state) => (candidate: number | "outros") =>
      state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => prev + acc.votes[candidate], 0),
    votesByCandidateAndZone:
      (state) => (candidate: number | "outros", zone: string) =>
        state.sections
          .filter((s) => !!s.closed && s.zone === zone)
          .reduce((prev, acc) => prev + acc.votes[candidate], 0),

    votosApurados: (state) =>
      state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => prev + acc.voters, 0),
    votosApuradosPorZona: (state) => (zone: string) =>
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
    async cleanVotes() {
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
    reset() {
      this.sections = initSections();
    },
    simulate() {
      const newSections = initSections().map((stateSection) => {
        const section = { ...stateSection, closed: true };
        let left = section.voters;
        for (const candidateNumber in section.votes) {
          const newVotes = Math.floor(Math.random() * left);
          left -= newVotes;
          section.votes[candidateNumber] = newVotes;
        }
        return section;
      });
      this.sections = newSections;
    },
  },
  persist: {
    storage: localStorage,
  },
});
