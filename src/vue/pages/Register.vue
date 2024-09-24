<template>
  <form v-if="store.getters.allSections.length > 0 && store.getters.candidates.length > 0">
    <div>
      <h1>Cadastrar votos</h1>
      <label>Selecione a seção</label>
      <select v-model="formSection" @change="onSelectChange">
        <option v-for="section in store.getters.allSections" :key="section.num" :value="section.num" :style="{
          backgroundColor: section.closed && '#ffdb57',
          color: section.closed && 'gray',
        }">
          {{ section.num }} - {{ section.local }}
        </option>
      </select>
    </div>

    <div class="votos" v-if="store.getters.candidates.length > 0">
      <div class="candidato" v-for="candidate in store.getters.candidates" :key="candidate.numero">
        <h4 class="nome">{{ candidate.nome }}</h4>
        <circular-picture :src="candidate.perfil" :size="4" :color="candidate.cor" />
        <input min="0" :max="Number(formVotes[candidate.numero]) + Number(votesLeft)" type="number"
          v-model="formVotes[candidate.numero]" />
        <span>votos</span>
      </div>
    </div>
    <p>
      {{ votesEntered }} votos inseridos de {{ currentFormSection.eleitores }}
      <br />
      {{ 0 > votesLeft ? 0 : votesLeft }} nulos
    </p>
    <div class="btns">
      <custom-button :disabled="isInvalid" @click="registrar" type="button">
        Cadastrar
      </custom-button>
      <custom-button variant="danger" @click="onClose">Sair</custom-button>
    </div>
  </form>
  <div v-else>Nada</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import CircularPicture from "../components/CircularPicture.vue";
import CustomButton from "../components/CustomButton.vue";

const store = useStore();
const router = useRouter();

const formSection = ref(26);
const formVotes: Record<string | number, number> = reactive({
  22: 0,
  40: 0,
  77: 0,
  27: 0,
  outros: 0,
});

const votesEntered = computed(() => {
  let votos = 0;
  for (const numCandidato in formVotes) {
    votos += Number(formVotes[numCandidato]);
  }
  return votos;
});
const areNegatives = computed(() => {
  return Object.entries(formVotes).some(([, value]) => value < 0);
});
const currentFormSection = computed(() => {
  return store.getters.allSections.find((s: any) => s.num === formSection.value);
});
const votesLeft = computed(() => {
  return currentFormSection.value.eleitores - votesEntered.value;
});
const isInvalid = computed(() => {
  return votesEntered.value < 0 || areNegatives.value || votesLeft.value < 0;
});

function onSelectChange() {
  formVotes.value = { ...currentFormSection.value.votos };
};

function onClose() {
  router.push("/");
};

function registrar(e: any) {
  e.preventDefault();

  if (votesEntered.value < 0 || areNegatives.value) return alert("Inválido!");
  if (votesEntered.value > currentFormSection.value.eleitores) {
    return alert("Votos inseridos excederam a quantidade máxima");
  }

  store.dispatch("registerVotes", {
    sectionNum: formSection.value,
    votes: Object.fromEntries(
      Object.entries(formVotes).map(([key, value]) => [
        key,
        Number(value),
      ])
    ),
  });
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
