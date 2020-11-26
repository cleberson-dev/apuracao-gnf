<template>
  <section class="votes-stats-by-zone">
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
      :key="fernando.numero"
      :name="fernando.nome"
      :profilePicture="fernando.perfil"
      :color="fernando.cor"
      :votes="votesByCandidateAndZone(fernando.numero, zone)"
      :totalVotes="validVotesByZone(zone)"
      featured
    />

    <votes-diff
      :votesA="votesByCandidateAndZone(fernando.numero, zone)"
      :votesB="votesByCandidateAndZone(josimar.numero, zone)"
      :size="0.8"
    />

    <compact-candidate
      :key="josimar.numero"
      :name="josimar.nome"
      :profilePicture="josimar.perfil"
      :color="josimar.cor"
      :votes="votesByCandidateAndZone(josimar.numero, zone)"
      :totalVotes="validVotesByZone(zone)"
      featured
    />
    <div class="other-candidates">
      <compact-candidate
        v-for="candidato in outrosCandidatos.sort(
          (a, b) =>
            votesByCandidateAndZone(b.numero, zone) -
            votesByCandidateAndZone(a.numero, zone)
        )"
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
      "candidates",
      "totalElectorsByZone",
      "votesCountedByZone",
      "closedSectionsByZone",
      "sectionsByZone",
      "votesByCandidateAndZone",
      "nullVotesByZone",
      "validVotesByZone",
      "votosApuradosPorZona",
    ]),
    fernando() {
      return this.candidates.find((c) => c.numero === 22);
    },
    josimar() {
      return this.candidates.find((c) => c.numero === 40);
    },
    outrosCandidatos() {
      return this.candidates.filter((c) => c.numero !== 40 && c.numero !== 22);
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