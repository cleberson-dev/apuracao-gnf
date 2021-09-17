<template>
  <section class="votes-stats-by-zone" v-if="sortedCandidates.length > 0">
    <section-header
      :size="0.75"
      :leftTitle="zone"
      :leftSubtitle="votosApuradosPorZona(zone) + ' votos apurados'"
      :rightTitle="
        formatarPercentual(
          closedSectionsByZone(zone).length / sectionsByZone(zone).length
        ) + '%'
      "
      :rightSubtitle="
        'Seções totalizadas (' +
        closedSectionsByZone(zone).length +
        '/' +
        sectionsByZone(zone).length +
        ')'
      "
    />

    <compact-candidate
      :key="challengers[0].numero"
      :name="challengers[0].nome"
      :profilePicture="challengers[0].perfil"
      :color="challengers[0].cor"
      :votes="votesByCandidateAndZone(challengers[0].numero, zone)"
      :totalVotes="validVotesByZone(zone)"
      featured
    />

    <votes-diff
      :votesA="votesByCandidateAndZone(challengers[0].numero, zone)"
      :votesB="votesByCandidateAndZone(challengers[1].numero, zone)"
      :size="0.8"
    />

    <compact-candidate
      :key="challengers[1].numero"
      :name="challengers[1].nome"
      :profilePicture="challengers[1].perfil"
      :color="challengers[1].cor"
      :votes="votesByCandidateAndZone(challengers[1].numero, zone)"
      :totalVotes="validVotesByZone(zone)"
      featured
    />

    <div class="other-candidates">
      <compact-candidate
        v-for="candidato in otherCandidates"
        :key="candidato.numero"
        :name="candidato.nome"
        :profilePicture="candidato.perfil"
        :color="candidato.cor"
        :votes="votesByCandidateAndZone(candidato.numero, zone)"
        :totalVotes="validVotesByZone(zone)"
      />
      <compact-candidate
        name="Brancos, nulos e abstenções"
        color="red"
        :votes="nullVotesByZone(zone)"
        :totalVotes="votosApuradosPorZona(zone)"
      />
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import CompactCandidate from "./CompactCandidate";
import SectionHeader from "./SectionHeader";
import VotesDiff from "./VotesDiff";

export default {
  components: {
    SectionHeader,
    CompactCandidate,
    VotesDiff,
  },
  props: {
    zone: {
      type: String,
      required: true,
      validate: (val) => ["urbana", "rural"].findIndex(val) !== -1,
    },
  },
  computed: {
    ...mapGetters([
      "sortedCandidates",
      "totalElectorsByZone",
      "votesCountedByZone",
      "closedSectionsByZone",
      "sectionsByZone",
      "votesByCandidateAndZone",
      "nullVotesByZone",
      "validVotesByZone",
      "votosApuradosPorZona",
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
.left .title {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}
.left .subtitle {
  font-size: 0.8rem;
  color: #909090;
  font-weight: 700;
  margin: 0;
}

.right .title,
.right .subtitle {
  margin: 0;
}

.right .title {
  font-size: 1rem;
  color: #2a9d8f;
}

.right .subtitle {
  color: #909090;
  font-size: 0.8rem;
}

.other-candidates {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1.1rem;
}

.other-candidates .compact-candidate_mini {
  margin-right: 2rem;
  margin-bottom: 1rem;
}

.diff {
  margin-bottom: 1rem;
}
</style>
