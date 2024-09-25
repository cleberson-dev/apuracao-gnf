import { Commit } from "vuex";
import { VoteService } from "../../services/vote.service";
import SectionService, { Section } from "../../services/section.service";
import { Candidate } from "../../../types";
import CandidateService from "../../services/candidate.service";

export type StateSection = Section & {
  closed: boolean;
  votes: Record<number | "outros", number>;
};

type State = {
  sections: StateSection[];
};

const state: State = {
  sections: [],
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
    {
      sectionNumber,
      votes,
    }: { sectionNumber: number; votes: Record<number | "outros", number> }
  ) {
    await VoteService.vote(sectionNumber, votes);
    commit("updateVotes", { sectionNumber, votes });
    commit("updateTime");
  },
  async fetchSections({ commit }) {
    const sections = await SectionService.fetchAll();
    const candidates = await CandidateService.getAll();
    commit("fetchSections", { sections, candidates });
  },
  async fetchVotes({ commit }) {
    const votes = await VoteService.getAllVotes();
    commit("updateSectionsVotes", votes);
  },
  async cleanVotes({ commit }) {
    try {
      await VoteService.cleanVotes();
      const sections = await SectionService.fetchAll();
      commit("fetchSections", sections);
    } catch (err) {
      console.error(err);
    }
  },
  updateSection({ commit }, section) {
    commit("updateSection", section);
    commit("updateTime");
  },
};

const mutations = {
  updateVotes: (
    state: State,
    {
      sectionNumber,
      votes,
    }: { sectionNumber: number; votes: Record<number | "outros", number> }
  ) => {
    const section = state.sections.find((s) => s.number === sectionNumber)!;
    section.votes = votes;
    section.closed = true;
  },
  fetchSections: (
    state: State,
    { sections, candidates }: { sections: Section[]; candidates: Candidate[] }
  ) => {
    state.sections = sections.map((s) => ({
      ...s,
      closed: false,
      votes: Object.fromEntries([
        ...candidates.map((candidate) => [candidate.number, 0]),
        ["outros", 0],
      ]),
    }));
  },
  updateSection: (
    state: State,
    payload: { section: string; votes: Record<number | "outros", number> }
  ) => {
    const section = state.sections.find((s) => s.number === +payload.section);
    if (!section) return;

    section.votes = payload.votes;
  },

  // NEW
  updateSectionsVotes(
    state: State,
    votes: Awaited<ReturnType<typeof VoteService.getAllVotes>>
  ) {
    votes.forEach((vote) => {
      const section = state.sections.find(
        (s) => s.number === vote.sectionNumber
      );
      if (!section) return;
      section.votes = vote.votes;
      section.closed = true;
    });
  },
};

export default { state, getters, actions, mutations };
