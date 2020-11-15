<template>
  <form>
    <div>
      <h1>Cadastrar votos</h1>
      <label>Selecione a seção</label>
      <select v-model="formSection" @change="onSelectChange">
        <option
          v-for="section in allSections"
          :key="section.num"
          :value="section.num"
          :style="{
            backgroundColor: section.closed && '#ffdb57',
            color: section.closed && 'gray',
          }"
        >
          {{ section.num }} - {{ section.local }}
        </option>
      </select>
    </div>

    <div class="votos" v-if="candidates.length > 0">
      <div
        class="candidato"
        v-for="candidate in candidates.sort(
          (a, b) => ordering.indexOf(a.numero) - ordering.indexOf(b.numero)
        )"
        :key="candidate.numero"
      >
        <h4 class="nome">{{ candidate.nome }}</h4>
        <circular-picture
          :src="'/img/candidatos/' + candidate.numero + '.jpg'"
          :size="4"
          :color="candidate.cor"
        />
        <input type="number" v-model="formVotes[candidate.numero]" />
        <span>votos</span>
      </div>
    </div>
    <p>
      {{ votesEntered }} votos inseridos de {{ currentFormSection.eleitores }}
      <br />
      {{ 0 > votesLeft ? 0 : votesLeft }} nulos
    </p>
    <div class="btns">
      <button
        :disabled="votesEntered < 0 || areNegatives || votesLeft < 0"
        @click.prevent="registrar"
        type="submit"
      >
        Cadastrar
      </button>
      <button class="close" @click="onClose">Sair</button>
    </div>
  </form>
</template>

<script>
import CircularPicture from "../components/CircularPicture";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    CircularPicture,
  },
  data() {
    return {
      formSection: 26,
      formVotes: {
        22: 0,
        40: 0,
        77: 0,
        27: 0,
        outros: 0
      },
      ordering: [22, 40, 77, 27, 'outros']
    };
  },
  created() {
    this.formVotes = {...this.currentFormSection.votos};
  },
  computed: {
    ...mapGetters(["allSections", "candidates"]),
    votesEntered() {
      let votos = 0;
      for (const numCandidato in this.formVotes) {
        votos += Number(this.formVotes[numCandidato]);
      }
      return votos;
    },
    areNegatives() {
      return Object.entries(this.formVotes).some(([, value]) => value < 0);
    },
    currentFormSection() {
      return this.allSections.find(s => s.num === this.formSection);
    },
    votesLeft() {
      return this.currentFormSection.eleitores - this.votesEntered
    }
  },
  methods: {
    ...mapActions(["registerVotes"]),
    onSelectChange() {
      console.log(this.formVotes);
      this.formVotes = {...this.currentFormSection.votos};
    },
    onClose() {
      this.$router.push("/");
    },
    registrar() {
      if (this.votesEntered < 0 || this.areNegatives) return alert('Inválido!');
      if (this.votesEntered > this.currentFormSection.eleitores) return alert('Votos inseridos excederam a quantidade máxima');
      this.registerVotes({ 
        sectionNum: this.formSection,
        votes: Object.fromEntries(
          Object.entries(this.formVotes)
            .map(([key, value]) => [key, Number(value)])
        )
      });
    },
  },
};
</script>

<style scoped>
form {
  height: 100vh;
  box-sizing: border-box;
  padding: 40px 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

form h1 {
  font-size: 2.25rem;
  font-weight: 900;
}

form h4 {
  font-weight: 800;
}

form label {
  font-size: 1rem;
  font-weight: 700;
  color: #909090;
}

form select {
  background-color: #E4E4E4;
  border-radius: 5px;
  border: none;
  padding: 10px 10px;
  width: 40vw;
  margin-top: 5px;
}

form .votos input {
  background-color: #E4E4E4;
  border: none;
  outline: none;
  font-size: 28px;
  width: 5rem;
  padding: 8px 10px;
  font-family: "Montserrat", sans-serif;
  text-align: center;
  margin-top: 10px;
  border-radius: 5px;
}

form .votos input:focus {
  outline: 1px solid gray;
}

form .votos input::-webkit-outer-spin-button,
form .votos input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

form .votos {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

form .votos .candidato {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form .votos .candidato .nome {
  margin-top: 0;
  margin-bottom: 5px;
}

button {
  border-radius: 5px;
  font-family: "Montserrat", sans-serif;
  border: none;
  outline: none;
  font-weight: 700;
  font-size: 1.3rem;
  padding: 15px 22.5px;
  cursor: pointer;
}

.btns {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

button[type="submit"] {
  background-color: #0066FF;
  color: white;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button.close {
  background-color: red;
  color: white;
}

button:hover {
  filter: grayscale(0.4);
}

form label {
  display: block;
}
</style>