<template>
  <div class="home">
    <section class="apuracao-geral">
      <div class="header">
        <div class="left">
          <h1 class="pageTitle">Apuração Paralela de Gov. Nunes Freire - MA</h1>
          <h1 class="titulo-apuracao">Geral</h1>
          <h2 class="subtitulo-apuracao">{{ votesCounted }} votos apurados</h2>
        </div>
        <div class="right">
          <h1 class="secoes-rel">
            {{
              formatarPercentual(closedSections.length / allSections.length)
            }}%
          </h1>
          <h2 class="secoes-abs">
            Seções totalizadas ({{ closedSections.length }}/{{
              allSections.length
            }})
          </h2>
        </div>
      </div>

      <candidate
        featured
        :name="fernando.nome"
        :profilePicture="'/img/candidatos/' + fernando.numero + '.jpg'"
        :color="fernando.cor"
        :votes="votesByCandidate(fernando.numero)"
        :totalVotes="validVotes"
      />

      <p 
        class="diff"
        :style="{ color: diffVotos(fernando.numero, josimar.numero) >= 0 ? 'green' : 'red' }"
      >
        {{ diffVotos(fernando.numero, josimar.numero) >= 0 ? '+' : '-' }} {{ Math.abs(diffVotos(fernando.numero, josimar.numero)) }}
        <span class="legend">Diferença de votos</span>
      </p>

      <candidate
        featured
        :name="josimar.nome"
        :profilePicture="'/img/candidatos/' + josimar.numero + '.jpg'"
        :color="josimar.cor"
        :votes="votesByCandidate(josimar.numero)"
        :totalVotes="validVotes"
      />

      <div class="other-candidates">
        <candidate
          v-for="candidato in outrosCandidatos.sort(
            (a, b) => votesByCandidate(b.numero) - votesByCandidate(a.numero)
          )"
          :key="candidato.numero"
          :name="candidato.nome"
          :profilePicture="'/img/candidatos/' + candidato.numero + '.jpg'"
          :featured="candidato.numero === 22 || candidato.numero === 40"
          :color="candidato.cor"
          :votes="votesByCandidate(candidato.numero)"
          :totalVotes="validVotes"
        />

        <candidate
          key="null"
          name="Brancos, nulos e abstenções"
          color="red"
          :votes="nullVotes"
          :totalVotes="validVotes"
        />
      </div>
    </section>

    <div class="filtros">
      <section class="apuracao-urbana">
        <div class="header">
          <div class="left">
            <h1 class="titulo-apuracao">Urbana</h1>
            <h2 class="subtitulo-apuracao">
              {{ votesCountedByZone("urbana") }} votos apurados
            </h2>
          </div>
          <div class="right">
            <h1 class="secoes-rel">
              {{
                formatarPercentual(
                  closedSectionsByZone("urbana").length /
                    sectionsByZone("urbana").length
                )
              }}%
            </h1>
            <h2 class="secoes-abs">
              Seções totalizadas ({{ closedSectionsByZone("urbana").length }}/{{
                sectionsByZone("urbana").length
              }})
            </h2>
          </div>
        </div>

        <compact-candidate
          v-for="candidato in candidatosDestaque"
          :key="candidato.numero"
          :name="candidato.nome"
          :profilePicture="'/img/candidatos/' + candidato.numero + '.jpg'"
          :color="candidato.cor"
          :votes="votesByCandidateAndZone(candidato.numero, 'urbana')"
          :totalVotes="validVotesByZone('urbana')"
          featured
        />
        <div class="other-candidates">
          <compact-candidate
            v-for="candidato in outrosCandidatos.sort(
              (a, b) =>
                votesByCandidateAndZone(b.numero, 'urbana') -
                votesByCandidateAndZone(a.numero, 'urbana')
            )"
            :key="candidato.numero"
            :name="candidato.nome"
            :profilePicture="'/img/candidatos/' + candidato.numero + '.jpg'"
            :color="candidato.cor"
            :votes="votesByCandidateAndZone(candidato.numero, 'urbana')"
            :totalVotes="validVotesByZone('urbana')"
          />
          <compact-candidate
            name="Brancos, nulos e abstenções"
            color="red"
            :votes="nullVotesByZone('urbana')"
            :totalVotes="votesCountedByZone('urbana')"
          />
        </div>
      </section>

      <section class="apuracao-rural" :style="{ marginTop: '30px' }">
        <div class="header">
          <div class="left">
            <h1 class="titulo-apuracao">Rural</h1>
            <h2 class="subtitulo-apuracao">
              {{ votesCountedByZone("rural") }} votos apurados
            </h2>
          </div>
          <div class="right">
            <h1 class="secoes-rel">
              {{
                formatarPercentual(
                  closedSectionsByZone("rural").length /
                    sectionsByZone("rural").length
                )
              }}%
            </h1>
            <h2 class="secoes-abs">
              Seções totalizadas ({{ closedSectionsByZone("rural").length }}/{{
                sectionsByZone("rural").length
              }})
            </h2>
          </div>
        </div>

        <compact-candidate
          v-for="candidato in candidatosDestaque"
          :key="candidato.numero"
          :name="candidato.nome"
          :profilePicture="'/img/candidatos/' + candidato.numero + '.jpg'"
          :color="candidato.cor"
          :votes="votesByCandidateAndZone(candidato.numero, 'rural')"
          :totalVotes="validVotesByZone('rural')"
          featured
        />
        <div class="other-candidates">
          <compact-candidate
            v-for="candidato in outrosCandidatos.sort(
              (a, b) =>
                votesByCandidateAndZone(b.numero, 'rural') -
                votesByCandidateAndZone(a.numero, 'rural')
            )"
            :key="candidato.numero"
            :name="candidato.nome"
            :profilePicture="'/img/candidatos/' + candidato.numero + '.jpg'"
            :color="candidato.cor"
            :votes="votesByCandidateAndZone(candidato.numero, 'rural')"
            :totalVotes="validVotesByZone('rural')"
          />
          <compact-candidate
            name="Brancos, nulos e abstenções"
            color="red"
            :votes="nullVotesByZone('rural')"
            :totalVotes="votesCountedByZone('rural')"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Candidate from "../components/Candidate";
import CompactCandidate from "../components/CompactCandidate";

export default {
  components: {
    Candidate,
    CompactCandidate,
  },
  computed: {
    candidatosDestaque() {
      return this.candidates.filter((c) => c.numero === 40 || c.numero === 22);
    },
    outrosCandidatos() {
      return this.candidates.filter((c) => c.numero !== 40 && c.numero !== 22);
    },
    ...mapGetters([
      "totalElectors",
      "totalElectorsByZone",
      "votesCounted",
      "votesCountedByZone",
      "closedSections",
      "closedSectionsByZone",
      "allSections",
      "sectionsByZone",
      "votesByCandidate",
      "votesByCandidateAndZone",
      "candidates",
      "nullVotes",
      "nullVotesByZone",
      "validVotes",
      "validVotesByZone",
    ]),
    fernando() {
      return this.candidates.find((c) => c.numero === 22);
    },
    josimar() {
      return this.candidates.find((c) => c.numero === 40);
    },
  },
  methods: {
    formatarPercentual(decimal) {
      const val = isNaN(decimal) ? 0 : decimal;
      return (val * 100).toFixed(2).replace(".", ",");
    },
    diffVotos(a, b) {
      return Number(
        this.votesByCandidate(a) - this.votesByCandidate(b)
      );
    },
  },
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #EFEFEF;
  display: flex;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
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
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
  height: 160px;
}

.filtros {
  flex-grow: 1;
  padding: 30px 40px;
  padding-right: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
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

.filtros .titulo-apuracao {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
}
.filtros .subtitulo-apuracao {
  font-size: 0.8rem;
  color: #909090;
  font-weight: 700;
  margin: 0;
}

.header .right {
  text-align: right;
}

.apuracao-geral .secoes-rel {
  color: #2A9D8F;
  margin: 0;
  font-size: 2rem;
}
.apuracao-geral .secoes-abs {
  color: #909090;
  font-size: 1rem;
  margin: 0;
}

.filtros .secoes-rel,
.filtros .secoes-abs {
  margin: 0;
}

.filtros .secoes-rel {
  font-size: 1rem;
  color: #2A9D8F;
}

.filtros .secoes-abs {
  color: #909090;
  font-size: 0.8rem;
}

.filtros .other-candidates {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  flex-wrap: wrap;
  height: 85px;
  width: 76%;
  margin-top: 1.1rem;
}

.diff {
  font-weight: 700;
  font-size: 1.25rem;
  width: 100%;
  text-align: right;
  display: flex;
  flex-direction: column;
  margin: 0;
  color: green;
}

.diff span {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.75rem;
  color: black;
}

.pageTitle {
  font-size: 2rem;
  font-weight: 800;
  width: 100%;
  margin-top: 0;
}
</style>