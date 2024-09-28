import { defineStore } from "pinia";
import { VoteService } from "../services/vote.service";
import SectionService, { Section } from "../services/section.service";
import CandidateService from "../services/candidate.service";

export type StateSection = Section & {
  closed: boolean;
  votes: Record<number | "outros", number>;
};

export const useSectionStore = defineStore("sections", {
  state: () => ({ sections: <StateSection[]>[], isLoading: true }),
  getters: {
    closedSections: (state) => state.sections.filter((s) => !!s.closed),
    closedSectionsByZone: (state) => (zone: string) =>
      state.sections.filter((s) => s.zone === zone && !!s.closed),
    section: (state) => (num: number) =>
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
      await VoteService.vote(sectionId, votes);

      const section = this.sections.find((s) => s.id === sectionId)!;
      section.votes = votes;
      section.closed = true;
    },
    async fetchSections() {
      const sections = await SectionService.fetchAll();
      const candidates = CandidateService.getAll();

      this.sections = sections.map((s) => {
        const votes = Object.fromEntries([
          ...candidates.map((candidate) => [
            candidate.number,
            s.votes[candidate.number] ?? 0,
          ]),
          ["outros", s.votes["outros"] ?? 0],
        ]);
        return {
          ...s,
          votes,
        };
      });

      this.isLoading = false;
    },
    async cleanVotes() {
      try {
        await VoteService.cleanVotes();
        await this.fetchSections();
      } catch (err) {
        console.error(err);
      }
    },
    updateSection(payload: {
      section: string;
      votes: Record<number | "outros", number>;
    }) {
      const section = this.sections.find((s) => s.id === +payload.section);
      if (!section) return;

      section.votes = payload.votes;
    },
    addSection(payload: Section) {
      const candidates = CandidateService.getAll();
      this.sections.push({
        ...payload,
        votes: Object.fromEntries([
          ...candidates.map((candidate) => [candidate.number, 0]),
          ["outros", 0],
        ]),
      });
    },
    patchSection(sectionId: number, payload: Omit<Section, "id">) {
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
  },
});
