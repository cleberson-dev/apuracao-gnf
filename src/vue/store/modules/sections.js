// import { initialSections } from "../data";
// const Datastore = require('nedb');

// export const db = {};
// db.candidates = new Datastore({ filename: 'candidates.db' });
// db.sections = new Datastore({ filename: 'sections.db' });
import axios from 'axios';

const state = {
  sections: [],
  candidates: [],
};

const getters = {
  closedSections: (state) => state.sections.filter((s) => !!s.closed),
  closedSectionsByZone: (state) => (zone) =>
    state.sections.filter((s) => s.zona === zone && !!s.closed),
  section: (state) => (num) => state.sections.find((s) => s.num === num),
  allSections: (state) => state.sections.sort((a, b) => Number(a.num) - Number(b.num)),
  sectionsByZone: (state) => (zone) =>
    state.sections.filter((s) => s.zona === zone),
  validVotes: (state) => state.sections
    .filter(s => !!s.closed)
    .reduce((prev, acc) => {
      let votados = 0;
      for (let partidoVoto in acc.votos) {
        votados += acc.votos[partidoVoto];
      }
      return prev + votados;
    }, 0),
  validVotesByZone: (state) => zone => state.sections
    .filter(s => s.zona === zone && !!s.closed)
    .reduce((prev, acc) => {
      let votados = 0;
      for (let partidoVoto in acc.votos) {
        votados += acc.votos[partidoVoto];
      }
      return prev + votados;
    }, 0),
  votesCounted: (state) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + votados;
      }, 0),
  votesCountedByZone: (state) => (zone) =>
    state.sections
      .filter((s) => !!s.closed && s.zona === zone)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + votados;
      }, 0),
  totalElectors: (state) =>
    state.sections.reduce((prev, acc) => prev + acc.eleitores, 0),
  totalElectorsByZone: (state) => (zone) =>
    state.sections
      .filter((s) => s.zona === zone)
      .reduce((prev, acc) => prev + acc.eleitores, 0),
  nullVotes: (state) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + (acc.eleitores - votados);
      }, 0),
  nullVotesByZone: (state) => (zone) =>
    state.sections
      .filter((s) => !!s.closed && s.zona === zone)
      .reduce((prev, acc) => {
        let votados = 0;
        for (let partidoVoto in acc.votos) {
          votados += acc.votos[partidoVoto];
        }
        return prev + (acc.eleitores - votados);
      }, 0),
  votesByCandidate: (state) => (candidate) =>
    state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votos[candidate], 0),
  votesByCandidateAndZone: (state) => (candidate, zone) =>
    state.sections
      .filter((s) => !!s.closed && s.zona === zone)
      .reduce((prev, acc) => prev + acc.votos[candidate], 0),
  candidates: (state) => state.candidates,
  sortedCandidates: (state) => state.candidates.sort((a, b) => {
    const votesA = state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votos[a.numero], 0);
    const votesB = state.sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votos[b.numero], 0);

    return votesB - votesA;
  }),
  votosApurados: (state) => state.sections
    .filter(s => !!s.closed)
    .reduce((prev, acc) => prev + acc.eleitores, 0),
  votosApuradosPorZona: (state) => zone => state.sections
    .filter(s => !!s.closed && s.zona === zone)
    .reduce((prev, acc) => prev + acc.eleitores, 0)
};

const actions = {
  registerVotes({ commit }, { sectionNum, votes }) {
    axios.patch(`http://localhost:5000/secoes/${sectionNum}/votos`, { votos: votes })
      .then(() => {
        alert('Votos cadastrados!!!');
        commit("updateVotes", { sectionNum, votes });
      });
  },
  fetchCandidates({ commit }) {
    axios
      .get('http://localhost:5000/candidatos')
      .then(({ data }) => {
        commit("fetchCandidates", data);
      })
      .catch(console.error);
  },
  fetchSections({ commit }) {
    axios
      .get('http://localhost:5000/secoes')
      .then(({ data }) => {
        commit("fetchSections", data);
      })
      .catch(console.error);
  },
  async cleanVotes({ commit }) {
    try {
      await axios.get('http://localhost:5000/limparVotos');
      const { data } = await axios.get('http://localhost:5000/secoes');
      commit("fetchSections", data);
    } catch (err) {
      console.error(err);
    }
  },
  updateSection({ commit }, section) {
    console.log('Update Section - Action', section);
    commit("updateSection", section);
  }
};

const mutations = {
  updateVotes: (state, { sectionNum, votes }) => {
    const section = state.sections.find((s) => s.num === sectionNum);
    section.votos = votes;
    section.closed = true;


    // state.sections = state.sections.filter((s) => s.num !== sectionNum);
    // state.sections = [...state.sections, section];
  },
  fetchCandidates: (state, data) => {
    state.candidates = data.map(c => ({ ...c, numero: c.numero === 0 ? 'outros' : c.numero }));
  },
  fetchSections: (state, data) => {
    state.sections = data;
  },
  updateSection: (state, section) => {
    console.log('Update Section - Mutation', section);
    state.sections = [
      ...state.sections.filter(s => s.num !== section.num),
      section
    ];
  }
};

export default { state, getters, actions, mutations };
