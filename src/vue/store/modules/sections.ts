import { Commit } from "vuex";
import { VoteService } from "../../services/vote.service";
import Candidate from "../../components/Candidate.vue";
import CandidateService from "../../services/candidate.service";
import SectionService from "../../services/section.service";

type Section = any;
type Candidate = any;

type State = {
  sections: Section[];
  candidates: Candidate[];
};

const state: State = {
  sections: [],
  candidates: [],
};

const getters = {
  closedSections: (state: State) => state.sections.filter((s) => !!s.closed),
  closedSectionsByZone: (state: State) => (zone: string) =>
    state.sections.filter((s) => s.zona === zone && !!s.closed),
  section: (state: State) => (num: number) =>
    state.sections.find((s) => s.num === num),
  allSections: (state: State) =>
    state.sections.sort((a, b) => Number(a.num) - Number(b.num)),
  sectionsByZone: (state: State) => (zone: string) =>
    state.sections.filter((s) => s.zona === zone),
  validVotes: (state: State) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + votados;
      }, 0),
  validVotesByZone: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => s.zona === zone && !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + votados;
      }, 0),
  votesCounted: (state: State) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + votados;
      }, 0),
  votesCountedByZone: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => !!s.closed && s.zona === zone)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + votados;
      }, 0),
  totalElectors: (state: State) =>
    state.sections.reduce((prev, acc) => prev + acc.eleitores, 0),
  totalElectorsByZone: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => s.zona === zone)
      .reduce((prev, acc) => prev + acc.eleitores, 0),
  nullVotes: (state: State) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + (acc.eleitores - votados);
      }, 0),
  nullVotesByZone: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => !!s.closed && s.zona === zone)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + (acc.eleitores - votados);
      }, 0),
  votesByCandidate: (state: State) => (candidate: number) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votos[candidate], 0),
  votesByCandidateAndZone:
    (state: State) => (candidate: number, zone: string) =>
      state.sections
        .filter((s) => !!s.closed && s.zona === zone)
        .reduce((prev, acc) => prev + acc.votos[candidate], 0),
  candidates: (state: State) => state.candidates,
  sortedCandidates: (state: State) =>
    state.candidates.sort((a, b) => {
      const votesA = state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => prev + acc.votos[a.numero], 0);
      const votesB = state.sections
        .filter((s) => !!s.closed)
        .reduce((prev, acc) => prev + acc.votos[b.numero], 0);

      return votesB - votesA;
    }),
  votosApurados: (state: State) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.eleitores, 0),
  votosApuradosPorZona: (state: State) => (zone: string) =>
    state.sections
      .filter((s) => !!s.closed && s.zona === zone)
      .reduce((prev, acc) => prev + acc.eleitores, 0),
};

const actions: Record<
  string,
  ({ commit }: { commit: Commit }, ...args: any[]) => void
> = {
  async registerVotes({ commit }, { sectionNum, votes }) {
    await VoteService.vote(sectionNum, votes);
    commit("updateVotes", { sectionNum, votes });
  },
  async fetchCandidates({ commit }) {
    const { data } = await CandidateService.fetchAll();
    commit("fetchCandidates", data.candidates);
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
    { sectionNum, votes }: { sectionNum: number; votes: number }
  ) => {
    const section = state.sections.find((s) => s.num === sectionNum);
    section.votos = votes;
    section.closed = true;
  },
  fetchCandidates: (state: State, candidates: Candidate[]) => {
    state.candidates = candidates.map((candidate: Candidate) => ({
      ...candidate,
      numero: candidate.numero === 0 ? "outros" : candidate.numero,
    }));
  },
  fetchSections: (state: State, sections: Section[]) => {
    state.sections = sections;
  },
  updateSection: (state: State, section: Section) => {
    console.log("Update Section - Mutation", section);
    state.sections = [
      ...state.sections.filter((s) => s.num !== section.num),
      section,
    ];
  },
};

export default { state, getters, actions, mutations };
