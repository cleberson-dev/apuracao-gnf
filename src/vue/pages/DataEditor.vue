<script setup lang="ts">
import { onMounted, reactive, Ref, ref } from 'vue';
import { push } from 'notivue';
import type { Header, Item } from 'vue3-easy-data-table';
import { TrashIcon } from '@heroicons/vue/24/outline';

import SectionService, { Zone } from '../services/section.service';
import CandidateService from '../services/candidate.service';

import { useSectionStore } from '../store/section.store';

const isModalOpen = ref(false);
const sectionForm = reactive({
  id: <number | undefined>undefined,
  number: 0,
  name: '',
  zone: 'urbana',
  voters: 1,
  closed: false,
  votes: <Record<number | "outros", number> | undefined>{ outros: 0 },
})

const sectionStore = useSectionStore();
const getSectionItems = () => sectionStore.sections.sort((a, b) => a.number - b.number).map((s): Item => ({
  id: s.id,
  number: s.number,
  name: s.local,
  zone: s.zone,
  voters: s.voters,
  votes: s.votes,
  closed: s.closed ? 'Sim ✅' : 'Não ❌',
}));
onMounted(() => {
  sectionStore.$subscribe(() => {
    items.value = getSectionItems();
  })
});

const numberOfCandidates = CandidateService.getAll().length;

const headers: Header[] = [
  { text: "Seção # 🔢", value: "number", sortable: true, },
  { text: "Local 🏫", value: "name", sortable: true, },
  { text: "Zona 🏙️🏘️", value: "zone", sortable: true, },
  { text: "Nº de Eleitores 👨‍👩‍👧‍👦", value: "voters", sortable: true, },
  { text: "Votos", value: "votes", },
  { text: "Totalizada", value: "closed", sortable: true, },
  { text: "Ações", value: 'actions', },
];

const items: Ref<Item[]> = ref(getSectionItems());

const onRowClick = (row: any) => {
  const section = sectionStore.sections.find(s => s.id === row.id)!;
  sectionForm.id = section.id;
  sectionForm.number = section.number;
  sectionForm.name = section.local;
  sectionForm.voters = section.voters;
  sectionForm.zone = section.zone;
  sectionForm.closed = section.closed;
  sectionForm.votes = { ...section.votes };

  isModalOpen.value = true;
}

const onNewSectionClick = () => {
  isModalOpen.value = true;

  delete sectionForm.id;
  delete sectionForm.votes;

  sectionForm.number = 0;
  sectionForm.name = '';
  sectionForm.voters = 1;
  sectionForm.zone = 'urbana';
  sectionForm.closed = false;
}

const upsertSection = async () => {
  const values = { ...sectionForm };

  if (!!sectionForm.id) {
    const updatedSection = await SectionService.update(sectionForm.id, {
      number: sectionForm.number,
      closed: sectionForm.closed,
      local: sectionForm.name,
      voters: sectionForm.voters,
      zone: sectionForm.zone as Zone,
    });
    sectionStore.patchSection(sectionForm.id, updatedSection);
    push.success("Seção atualizada!");
    isModalOpen.value = false;
    return;
  }

  if (sectionStore.sections.some(s => s.number === values.number)) {
    push.error("Já existe uma seção com esse numero");
    return;
  }
  const newSection = await SectionService.create({
    number: values.number,
    local: values.name,
    voters: values.voters,
    zone: values.zone as Zone,
  });

  sectionStore.addSection(newSection);
  push.success(`Seção #${newSection.number} foi criada com sucesso!`);
  isModalOpen.value = false;
}

const classes = {
  input: "border border-solid border-borderColor focus:outline-primary placeholder:text-black p-2 text-sm rounded uppercase"
}

async function removeAllSections() {
  await SectionService.removeAll();
  sectionStore.removeAllSections();
  push.success("Todas as seções foram removidas!");
}

async function removeSection(sectionId: number) {
  await SectionService.removeSection(sectionId);
  sectionStore.removeSection(sectionId);
  push.success(`Seção #${sectionId} foi removida com sucesso!`);
}

const candidates = CandidateService.getAll();

const nf = Intl.NumberFormat("pt-BR");

const searchText = ref<string>('');
</script>

<template>
  <div class="p-10 w-[calc(100vw-6.3rem)] flex flex-col">
    <h1 class="font-bold text-2xl">Banco de Dados</h1>
    <p class="relative bottom-1">
      <small>
        {{ numberOfCandidates }} candidatos, {{
          nf.format(sectionStore.votosApurados)
        }} votos registrados.
        <br />
        {{ nf.format(sectionStore.totalElectors) }} eleitores, {{ nf.format(sectionStore.totalElectorsByZone("urbana"))
        }} na zona urbana e {{
          nf.format(sectionStore.totalElectorsByZone("rural")) }} na zona rural
        <br />
        {{ sectionStore.sections.length }} seções, {{ sectionStore.sectionsByZone("urbana").length }} urbanas e {{
          sectionStore.sectionsByZone("rural").length }} rurais.
      </small>
    </p>
    <div class="flex self-end gap-4 text-sm">
      <button @click.prevent="onNewSectionClick" class="bg-green-500 text-white p-2 rounded mb-4">
        + Nova Seção
      </button>
      <button @click.prevent="removeAllSections" class="bg-red-500 text-white p-2 rounded mb-4 flex items-center gap-1">
        <TrashIcon class="size-4" />
        Remover Seções
      </button>

    </div>

    <label class="text-xs mb-1">Pesquisar</label>
    <input type="text"
      class="border border-solid border-borderColor rounded mb-2 focus:outline-primary text-sm p-1 px-2 uppercase"
      v-model="searchText" />

    <EasyDataTable :headers="headers" :items="items" style="width: 100%;" @click-row="onRowClick" search-field="name"
      :search-value="searchText">
      <template #item-votes="item">
        {{ (Object.values(item.votes) as number[]).reduce((acc, val) => acc + val, 0) }}
      </template>
      <template #item-actions="item">
        <button @click.stop="removeSection(item.id)">
          <TrashIcon class="text-red-500 size-4" />
        </button>
      </template>
    </EasyDataTable>
  </div>

  <div v-if="isModalOpen"
    class="bg-black/50 w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center">
    <div class="w-2/5 bg-white rounded flex flex-col p-4 text-sm">
      <div class="flex justify-between">
        <h1 class="font-bold text-2xl">{{ sectionForm.id ? 'Atualizar seção' : 'Criar seção' }}</h1>
        <button class="rounded-full hover:bg-red-500/20 flex items-center justify-center size-8 transition-colors"
          @click.prevent="isModalOpen = false">X</button>
      </div>
      <form class="flex flex-col gap-4 mt-10" @submit.prevent="upsertSection">
        <div class="flex flex-col">
          <label>Número</label>
          <input type="number" :class="classes.input" required min="0" v-model="sectionForm.number" />
        </div>
        <div class="flex flex-col">
          <label>Local</label>
          <input type="text" :class="classes.input" required v-model="sectionForm.name" />
        </div>
        <div class="flex flex-col">
          <label>Zona</label>
          <select :class="classes.input" required v-model="sectionForm.zone">
            <option></option>
            <option value="rural">Rural</option>
            <option value="urbana">Urbana</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label>Nº de Eleitores</label>
          <input type="number" :class="classes.input" min="1" required v-model="sectionForm.voters" />
        </div>
        <div v-if="sectionForm.id">
          <label>Totalizada</label>
          <input type="checkbox" class="ml-2" v-model="sectionForm.closed" />
        </div>
        <hr class="my-2" />
        <div v-if="sectionForm.id">
          <label class="font-semibold text-lg block mb-4">Votos</label>
          <ul class="flex flex-col gap-2">
            <li v-for="candidate in candidates" class="grid grid-cols-[auto_1fr_auto] items-center select-none">
              <span class="inline-block rounded-full size-4 mr-1" :style="{ backgroundColor: candidate.color }"></span>
              <span>{{ candidate.name }} ({{ candidate.number }})</span>
              <input type="number"
                class="border border-solid border-borderColor outline-primary w-16 p-2 rounded font-semibold ml-2"
                min="0" v-model="sectionForm.votes![candidate.number]" />
            </li>
          </ul>
        </div>
        <button class="p-2 text-sm bg-green-400 rounded hover:brightness-90 mt-4" type="submit">{{ sectionForm.id ?
          'Atualizar' :
          'Criar' }}</button>
      </form>
    </div>
  </div>
</template>