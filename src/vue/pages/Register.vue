<template>
  <form v-if="sectionStore.sections.length > 0 && candidates.length > 0">
    <div>
      <h1>Cadastrar votos</h1>
      <label>Selecione a seção</label>
      <select :value="formSection" @input="formSection = +($event.target as HTMLSelectElement).value"
        @change="onSelectChange">
        <option v-for="section in sectionStore.allSections" :key="section.number" :value="section.number" :style="{
          backgroundColor: section.closed ? '#ffdb57' : undefined,
          color: section.closed ? 'gray' : undefined,
        }">
          {{ section.number }} - {{ section.local }}
        </option>
      </select>
    </div>

    <div class="votos" v-if="candidates.length > 0">
      <div class="candidato" v-for="candidate in candidates" :key="candidate.number">
        <h4 class="nome">{{ candidate.name }}</h4>
        <circular-picture :src="candidate.profilePicture" :size="4" :color="candidate.color" />
        <input min="0" :max="Number(formVotes[candidate.number]) + Number(votesLeft)" type="number"
          v-model="formVotes[candidate.number]" />
        <span>votos</span>
      </div>
    </div>
    <p>
      {{ votesEntered }} votos inseridos de {{ currentFormSection.voters }}
      <br />
      {{ votesLeft > 0 ? votesLeft : 0 }} nulos
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
import { useRouter } from "vue-router";
import { push } from "notivue";

import CircularPicture from "../components/CircularPicture.vue";
import CustomButton from "../components/CustomButton.vue";
import CandidateService from "../services/candidate.service";
import { StateSection, useSectionStore } from "../store/section.store";
import { useMainStore } from "../store/main.store";

const sectionStore = useSectionStore();
const mainStore = useMainStore();

const router = useRouter();
const candidates = CandidateService.getAll();

const initialSection = sectionStore.sections[0];
const formSection = ref(initialSection.number);
const formVotes: Record<number | "outros", number> = reactive({ ...initialSection.votes });

const votesEntered = computed(() => {
  let votes = 0;
  for (const numCandidato in formVotes) {
    votes += Number(formVotes[numCandidato]);
  }
  return votes;
});
const areNegatives = computed(() => {
  return Object.entries(formVotes).some(([, value]) => value < 0);
});
const currentFormSection = computed<StateSection>(() => {
  return sectionStore.sections.find((section: StateSection) => section.number === formSection.value)!;
});
const votesLeft = computed(() => {
  return currentFormSection.value.voters - votesEntered.value;
});
const isInvalid = computed(() => {
  return votesEntered.value < 0 || areNegatives.value || votesLeft.value < 0;
});

function onSelectChange() {
  Object.entries(currentFormSection.value.votes).forEach(([candidateNumber, votes]) => {
    formVotes[Number.isNaN(+candidateNumber) ? "outros" : +candidateNumber] = votes;
  })
};

function onClose() {
  router.push("/");
};

async function registrar(e: any) {
  e.preventDefault();

  if (votesEntered.value < 0 || areNegatives.value) return push.error("Inválido!");
  if (votesEntered.value > currentFormSection.value.voters) {
    return push.error("Votos inseridos excederam a quantidade máxima");
  }

  await sectionStore.registerVotes({
    sectionNumber: formSection.value,
    votes: { ...formVotes },
  });
  mainStore.updateTime();

  push.success("Votos computados com sucesso!");
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
