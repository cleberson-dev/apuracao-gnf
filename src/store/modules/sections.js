import { initialSections } from "../data";

const state = {
  sections: initialSections.map((s) => ({ ...s, zona: s.zona.toLowerCase() })),
  candidates: [
    { numero: 22, nome: "Fernando PL", cor: "blue" },
    { numero: 40, nome: "Josimar da Serraria", cor: "yellow" },
    { numero: 77, nome: "Dra. Regina", cor: "blueviolet" },
    { numero: 27, nome: "Dr. Haroldo", cor: "green" },
  ],
};

const getters = {
  closedSections: (state) => state.sections.filter((s) => !!s.closed),
  closedSectionsByZone: (state) => (zone) =>
    state.sections.filter((s) => s.zona === zone && !!s.closed),
  section: (state) => (num) => state.sections.find((s) => s.num === num),
  allSections: (state) => state.sections,
  sectionsByZone: (state) => (zone) =>
    state.sections.filter((s) => s.zona === zone),
  votesCounted: (state) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.eleitores, 0),
  votesCountedByZone: (state) => (zone) =>
    state.sections
      .filter((s) => !!s.closed && s.zona === zone)
      .reduce((prev, acc) => prev + acc.eleitores, 0),
  totalElectors: (state) =>
    state.sections.reduce((prev, acc) => prev + acc.eleitores, 0),
  totalElectorsByZone: (state) => (zone) =>
    state.sections
      .filter((s) => s.zona === zone)
      .reduce((prev, acc) => prev + acc.eleitores, 0),
  nullVotes: (state) =>
    state.sections.reduce((prev, acc) => {
      let votados = 0;
      for (let partidoVoto in acc.votos) {
        votados += acc.votos[partidoVoto];
      }
      return prev + (acc.eleitores - votados);
    }),
  votesByCandidate: (state) => (candidate) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votos[candidate], 0),
  votesByCandidateAndZone: (state) => (candidate, zone) =>
    state.sections
      .filter((s) => !!s.closed && s.zona === zone)
      .reduce((prev, acc) => prev + acc.votos[candidate], 0),
  candidates: (state) => state.candidates
};

const actions = {
  registerVotes({ commit }, { sectionNum, votes }) {
    commit("registerVotes", { sectionNum, votes });
  },
};

const mutations = {
  registerVotes: (state, { sectionNum, votes }) => {
    const section = state.sections.find((s) => s.num === sectionNum);
    section.votos = votes;
    section.closed = true;

    // state.sections = state.sections.filter((s) => s.num !== sectionNum);
    // state.sections = [...state.sections, section];
  },
};

export default { state, getters, actions, mutations };
