<template>
  <section class="apuracao-geral" v-if="sortedCandidates.length > 0">
    <h1 class="pageTitle">Apuração Paralela de Gov. Nunes Freire - MA</h1>
    <section-header
      leftTitle="Geral"
      :leftSubtitle="votosApurados + ' votos apurados'"
      :rightTitle="
        formatarPercentual(closedSections.length / allSections.length) + '%'
      "
      :rightSubtitle="
        'Seções totalizadas (' +
        closedSections.length +
        '/' +
        allSections.length +
        ')'
      "
    />

    <candidate
      featured
      :name="challengers[0].nome"
      :profilePicture="challengers[0].perfil"
      :color="challengers[0].cor"
      :votes="votesByCandidate(challengers[0].numero)"
      :totalVotes="validVotes"
    />

    <votes-diff
      :votesA="votesByCandidate(challengers[0].numero)"
      :votesB="votesByCandidate(challengers[1].numero)"
    />

    <candidate
      featured
      :name="challengers[1].nome"
      :profilePicture="challengers[1].perfil"
      :color="challengers[1].cor"
      :votes="votesByCandidate(challengers[1].numero)"
      :totalVotes="validVotes"
    />

    <div class="other-candidates">
      <candidate
        v-for="candidato in otherCandidates"
        :key="candidato.numero"
        :name="candidato.nome"
        :profilePicture="candidato.perfil"
        :color="candidato.cor"
        :votes="votesByCandidate(candidato.numero)"
        :totalVotes="validVotes"
      />

      <candidate
        key="null"
        name="Brancos, nulos e abstenções"
        color="red"
        :votes="nullVotes"
        :totalVotes="votosApurados"
      />
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Candidate from "./Candidate";
import SectionHeader from "./SectionHeader.vue";
import VotesDiff from "./VotesDiff.vue";

export default {
  components: {
    Candidate,
    SectionHeader,
    VotesDiff,
  },
  computed: {
    ...mapGetters([
      "totalElectors",
      "votesCounted",
      "closedSections",
      "allSections",
      "votesByCandidate",
      "sortedCandidates",
      "nullVotes",
      "validVotes",
      "votosApurados",
    ]),
    challengers() {
      return this.sortedCandidates.slice(0, 2);
    },
    otherCandidates() {
      return this.sortedCandidates.slice(2);
    },
  },
  methods: {
    formatarPercentual(decimal) {
      const val = isNaN(decimal) ? 0 : decimal;
      return (val * 100).toFixed(2).replace(".", ",");
    },
  },
};
</script>

<style scoped>
.pageTitle {
  font-size: 2rem;
  font-weight: 800;
  width: 100%;
  margin-top: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}
.header .right {
  text-align: right;
}

section.apuracao-geral {
  flex-grow: 3;
  min-height: 100%;
  background-color: white;
  box-shadow: 0 10px 20px 5px rgba(0, 0, 0, 0.25);
  padding: 60px 40px;
}

section.apuracao-geral .header {
  margin-bottom: 1.6rem;
}

section.apuracao-geral .other-candidates {
  margin-top: 5rem;
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;
  height: 160px;
}

.apuracao-geral .titulo-apuracao {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
}
.apuracao-geral .subtitulo-apuracao {
  font-size: 1rem;
  color: #909090;
  font-weight: 700;
  margin: 0;
}
.apuracao-geral .secoes-rel {
  color: #2a9d8f;
  margin: 0;
  font-size: 2rem;
}
.apuracao-geral .secoes-abs {
  color: #909090;
  font-size: 1rem;
  margin: 0;
}
</style>
