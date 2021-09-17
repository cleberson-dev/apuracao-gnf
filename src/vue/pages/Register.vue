<template>
  <form v-if="allSections.length > 0 && candidates.length > 0">
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
        v-for="candidate in candidates"
        :key="candidate.numero"
      >
        <h4 class="nome">{{ candidate.nome }}</h4>
        <circular-picture
          :src="candidate.perfil"
          :size="4"
          :color="candidate.cor"
        />
        <input
          min="0"
          :max="Number(formVotes[candidate.numero]) + Number(votesLeft)"
          type="number"
          v-model="formVotes[candidate.numero]"
        />
        <span>votos</span>
      </div>
    </div>
    <p>
      {{ votesEntered }} votos inseridos de {{ currentFormSection.eleitores }}
      <br />
      {{ 0 > votesLeft ? 0 : votesLeft }} nulos
    </p>
    <div class="btns">
      <custom-button :disabled="isInvalid" @click="registrar" type="submit">
        Cadastrar
      </custom-button>
      <custom-button variant="danger" @click="onClose">Sair</custom-button>
    </div>
  </form>
  <div v-else>Nada</div>
</template>

<script>
import CircularPicture from "../components/CircularPicture";
import CustomButton from "../components/CustomButton";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    CircularPicture,
    CustomButton,
  },
  data() {
    return {
      formSection: 26,
      formVotes: {
        22: 0,
        40: 0,
        77: 0,
        27: 0,
        outros: 0,
      },
    };
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
      return this.allSections.find((s) => s.num === this.formSection);
    },
    votesLeft() {
      return this.currentFormSection.eleitores - this.votesEntered;
    },
    isInvalid() {
      return this.votesEntered < 0 || this.areNegatives || this.votesLeft < 0;
    },
  },
  methods: {
    ...mapActions(["registerVotes"]),
    onSelectChange() {
      this.formVotes = { ...this.currentFormSection.votos };
    },
    onClose() {
      this.$router.push("/");
    },
    registrar(e) {
      e.preventDefault();
      if (this.votesEntered < 0 || this.areNegatives) return alert("Inválido!");
      if (this.votesEntered > this.currentFormSection.eleitores)
        return alert("Votos inseridos excederam a quantidade máxima");
      this.registerVotes({
        sectionNum: this.formSection,
        votes: Object.fromEntries(
          Object.entries(this.formVotes).map(([key, value]) => [
            key,
            Number(value),
          ])
        ),
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
  background-color: #e4e4e4;
  border-radius: 5px;
  border: none;
  padding: 10px 10px;
  width: 40vw;
  margin-top: 5px;
}

form .votos input {
  background-color: #e4e4e4;
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

.btns {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

form label {
  display: block;
}
</style>
