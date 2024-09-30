<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { push } from "notivue";

import Combobox from "./Combobox.vue";
import CircularPicture from "../components/CircularPicture.vue";
import CustomButton from "../components/CustomButton.vue";
import CandidateService from "../services/candidate.service";
import { useSectionStore } from "../store/section.store";
import type { Section } from "../../types";
import { useMainStore } from "../store/main.store";

const sectionStore = useSectionStore();
const mainStore = useMainStore();

const router = useRouter();
const candidates = CandidateService.getAll();

const formSectionId = ref<number | undefined>(undefined);
const formVotes: Record<number | "outros", number> = reactive(Object.fromEntries([...candidates.map(candidate => [candidate.number, 0]), ["outros", 0]]));

const currentFormSection = computed<Section>(() => {
  return sectionStore.sections.find((section: Section) => section.id === formSectionId.value)!;
});

const votesEntered = computed(() => {
  const sum = Object.values(formVotes).reduce((acc, val) => acc + +val, 0);
  return sum;
});

const areNegatives = computed(() => {
  return Object.entries(formVotes).some(([, value]) => value < 0);
});

const votesLeft = computed(() => {
  const votesEntered = Object.values(formVotes).reduce((acc, val) => acc + +val, 0);
  if (!formSectionId.value) return 0;

  const numberOfVoters = sectionStore.sections.find((section: Section) => section.id === formSectionId.value)!.voters;
  return numberOfVoters - votesEntered;
});

const isInvalid = computed(() => {
  return votesEntered.value < 0 || areNegatives.value || votesLeft.value < 0 || formSectionId.value === undefined;
});

function onSelectChange(newId: number) {
  formSectionId.value = newId;
  const section = sectionStore.sections.find(s => s.id === newId);
  if (!section) {
    candidates.forEach(candidate => {
      formVotes[candidate.number] = 0;
      formVotes.outros = 0;
    });
    return;
  }
  Object.entries(section.votes).forEach(([candidateNumber, votes]) => {
    formVotes[Number.isNaN(+candidateNumber) ? "outros" : +candidateNumber] = votes as number;
  });
};

async function registerVote(e: any) {
  e.preventDefault();

  if (votesEntered.value < 0 || areNegatives.value) return push.error("Inválido!");
  if (votesEntered.value > currentFormSection.value?.voters) {
    return push.error("Votos inseridos excederam a quantidade máxima");
  }
  await sectionStore.registerVotes({
    sectionId: formSectionId.value!,
    votes: { ...formVotes },
  });
  (window as any).electronAPI.registerVotes(formSectionId.value!, { ...formVotes });
  mainStore.updateTime();

  push.success("Votos computados com sucesso!");
};
</script>

<template>
  <form class="h-[100vh] box-border px-20 py-10 flex flex-col justify-between items-start">
    <div>
      <h1 class="text-4xl font-black mb-5">Cadastrar votos</h1>
      <label class="block text-base font-bold text-[#909090]">Selecione a seção</label>
      <Combobox
        :items="sectionStore.allSections.map(s => ({ label: `${s.number} - ${s.local}`, value: s.id, marked: s.closed }))"
        :value="formSectionId" @change="onSelectChange($event)" class="w-[40vw]" />
      <!-- <select class="bg-[#e4e4e4] rounded-md border-none p-3 w-[40vw] mt-1" :value="formSectionId"
        @input="formSectionId = +($event.target as HTMLSelectElement).value" @change="onSelectChange()">
        <option v-for="section in sectionStore.allSections" :key="section.id" :value="section.id" :style="{
          backgroundColor: section.closed ? '#ffdb57' : undefined,
          color: section.closed ? 'gray' : undefined,
        }">
          {{ section.number }} - {{ section.local }}
        </option>
      </select> -->
    </div>

    <div class="flex justify-between w-full">
      <div class="flex flex-col items-center" v-for="candidate in candidates" :key="candidate.number">
        <h4 class="mt-0 mb-1 font-extrabold">{{ candidate.name }}</h4>
        <circular-picture :src="candidate.profilePicture" :size="4" :color="candidate.color" />
        <input
          class="border border-solid border-borderColor outline-none text-3xl w-20 text-center px-3 py-2 mt-3 rounded focus:outline-1 focus:outline-gray disabled:opacity-50 disabled:cursor-not-allowed"
          min="0" :max="Number(formVotes[candidate.number]) + Number(votesLeft)" type="number"
          v-model="formVotes[candidate.number]" :disabled="!formSectionId" />
        <span>votos</span>
      </div>
    </div>
    <p :class="{ 'invisible': !currentFormSection?.voters }">
      {{ votesEntered }} votos inseridos de {{ currentFormSection?.voters }}
      <br />
      {{ votesLeft || 0 }} nulos
    </p>
    <div class="flex justify-between w-full">
      <custom-button :disabled="isInvalid" @click="registerVote" type="button">
        Cadastrar
      </custom-button>
      <custom-button variant="danger" @click="router.push('/')">Sair</custom-button>
    </div>
  </form>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>