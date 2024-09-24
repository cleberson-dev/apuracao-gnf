import { Commit } from "vuex";
import { VoteService } from "../../services/vote.service";
import CandidateService from "../../services/candidate.service";
import SectionService from "../../services/section.service";
import type { Candidate } from "../../../types";
import {
  RepositorySection,
  SectionVotes,
} from "../../../repositories/section.repository";

type State = {
  sections: RepositorySection[];
  candidates: Candidate[];
};

const state: State = {
  sections: [],
  candidates: [],
};

const getters = {
  closedSections: (state: State) => state.sections.filter((s) => !!s.closed),
  closedSectionsByZone: (state: State) => (zone: string) =>
    state.sections.filter((s) => s.zone === zone && !!s.closed),
  section: (state: State) => (num: number) =>
    state.sections.find((s) => s.number === num),
  allSections: (state: State) =>
    state.sections.sort((a, b) => Number(a.number) - Number(b.number)),
  sectionsByZone: (state: State) => (zone: string) =>
    state.sections.filter((s) => s.zone === zone),
  validVotes: (state: State) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votes) {
          votados += acc.votes[partidoVoto];
        }
        return prev + votados;
      }, 0),
  validVotesByZone: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => s.zone === zone && !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votes) {
          votados += acc.votes[partidoVoto];
        }
        return prev + votados;
      }, 0),
  votesCounted: (state: State) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votes) {
          votados += acc.votes[partidoVoto];
        }
        return prev + votados;
      }, 0),
  votesCountedByZone: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => !!s.closed && s.zone === zone)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votes) {
          votados += acc.votes[partidoVoto];
        }
        return prev + votados;
      }, 0),
  totalElectors: (state: State) =>
    state.sections.reduce((prev, acc) => prev + acc.voters, 0),
  totalElectorsByZone: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => s.zone === zone)
      .reduce((prev, acc) => prev + acc.voters, 0),
  nullVotes: (state: State) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votes) {
          votados += acc.votes[partidoVoto];
        }
        return prev + (acc.voters - votados);
      }, 0),
  nullVotesByZone: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => !!s.closed && s.zone === zone)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votes) {
          votados += acc.votes[partidoVoto];
        }
        return prev + (acc.voters - votados);
      }, 0),
  votesByCandidate: (state: State) => (candidate: number) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votes[candidate], 0),
  votesByCandidateAndZone:
    (state: State) => (candidate: number, zone: string) =>
      state.sections
        .filter((s) => !!s.closed && s.zone === zone)
        .reduce((prev, acc) => prev + acc.votes[candidate], 0),
  candidates: (state: State) => state.candidates,
  sortedCandidates: (state: State) =>
    state.candidates.sort((a, b) => {
      const votesA = state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => prev + acc.votes[a.number], 0);
      const votesB = state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => prev + acc.votes[b.number], 0);

      return votesB - votesA;
    }),
  votosApurados: (state: State) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.voters, 0),
  votosApuradosPorZona: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => !!s.closed && s.zone === zone)
      .reduce((prev, acc) => prev + acc.voters, 0),
};

const actions: Record<
  string,
  ({ commit }: { commit: Commit }, ...args: any[]) => void
> = {
  async registerVotes(
    { commit },
    { sectionNumber, votes }: { sectionNumber: number; votes: SectionVotes }
  ) {
    await VoteService.vote(sectionNumber, votes);
    commit("updateVotes", { sectionNumber, votes });
  },
  async fetchCandidates({ commit }) {
    const candidates = await CandidateService.fetchAll();
    commit("fetchCandidates", candidates);
  },
  async fetchSections({ commit }) {
    const { data } = await SectionService.fetchAll();
    commit("fetchSections", data);
  },
  async cleanVotes({ commit }) {
    try {
      await VoteService.cleanVotes();
      const { data } = await SectionService.fetchAll();
      commit("fetchSections", data);
    } catch (err) {
      console.error(err);
    }
  },
  updateSection({ commit }, section) {
    commit("updateSection", section);
  },
};

const mutations = {
  updateVotes: (
    state: State,
    { sectionNumber, votes }: { sectionNumber: number; votes: SectionVotes }
  ) => {
    const section = state.sections.find((s) => s.number === sectionNumber)!;
    section.votes = votes;
    section.closed = true;
  },
  fetchCandidates: (state: State, candidates: Candidate[]) => {
    state.candidates = candidates.map((candidate: Candidate) => ({
      ...candidate,
      numero: candidate.number === 0 ? "outros" : candidate.number,
    }));
  },
  fetchSections: (state: State, sections: RepositorySection[]) => {
    state.sections = sections;
  },
  updateSection: (state: State, section: RepositorySection) => {
    console.log("Update Section - Mutation", section);
    state.sections = [
      ...state.sections.filter((s) => s.number !== section.number),
      section,
    ];
  },
};

export default { state, getters, actions, mutations };
