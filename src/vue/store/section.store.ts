import { defineStore } from "pinia";
import { VoteService } from "../services/vote.service";
import SectionService, { Section } from "../services/section.service";
import CandidateService from "../services/candidate.service";

export type StateSection = Section & {
  closed: boolean;
  votes: Record<number | "outros", number>;
};

export const useSectionStore = defineStore("sections", {
  state: () => ({ sections: <StateSection[]>[] }),
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
      sectionNumber,
      votes,
    }: {
      sectionNumber: number;
      votes: Record<number | "outros", number>;
    }) {
      await VoteService.vote(sectionNumber, votes);

      const section = this.sections.find((s) => s.number === sectionNumber)!;
      section.votes = votes;
      section.closed = true;
    },
    async fetchSections() {
      const sections = await SectionService.fetchAll();
      const candidates = await CandidateService.getAll();

      this.sections = sections.map((s) => ({
        ...s,
        closed: false,
        votes: Object.fromEntries([
          ...candidates.map((candidate) => [candidate.number, 0]),
          ["outros", 0],
        ]),
      }));
    },
    async fetchVotes() {
      const votes = await VoteService.getAllVotes();
      votes.forEach((vote) => {
        const section = this.sections.find(
          (s) => s.number === vote.sectionNumber
        );
        if (!section) return;

        section.votes = vote.votes;
        section.closed = true;
      });
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
      const section = this.sections.find((s) => s.number === +payload.section);
      if (!section) return;

      section.votes = payload.votes;
    },
  },
});
