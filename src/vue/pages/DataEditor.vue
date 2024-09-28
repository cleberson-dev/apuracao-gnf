<script setup lang="ts">
import type { Header, Item } from 'vue3-easy-data-table';
import { useSectionStore } from '../store/section.store';
import { onMounted, reactive, Ref, ref } from 'vue';
import { push } from 'notivue';
import SectionService, { Zone } from '../services/section.service';
import CandidateService from '../services/candidate.service';
import { TrashIcon } from '@heroicons/vue/24/outline';

const isModalOpen = ref(false);
const sectionForm = reactive({
  id: <number | undefined>undefined,
  number: 0,
  name: '',
  zone: 'urbana',
  voters: 1,
  closed: false,
})

const sectionStore = useSectionStore();
const getSectionItems = () => sectionStore.sections.map((s): Item => ({
  id: s.id,
  number: s.number,
  name: s.local,
  zone: s.zone,
  voters: s.voters,
  votes: Object.values(s.votes).reduce((acc, val) => acc + val, 0),
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

  isModalOpen.value = true;
}

const onNewSectionClick = () => {
  isModalOpen.value = true;

  delete sectionForm.id;
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
  push.success("Seção criada!");
  isModalOpen.value = false;
}

const classes = {
  input: "bg-slate-200 placeholder:text-black p-2 text-sm rounded"
}

async function removeAllSections() {
  await SectionService.removeAll();
  sectionStore.removeAllSections();
  push.success("Todas as seções foram removidas");
}

</script>

<template>
  <div class="p-10 w-[calc(100vw-6.3rem)] flex flex-col">
    <h1 class="font-bold text-2xl">Banco de Dados</h1>
    <p class="relative bottom-1"><small>{{ sectionStore.sections.length }} seções, {{ numberOfCandidates }}
        candidatos e {{ sectionStore.votosApurados }} votos
        registrados</small></p>
    <div class="flex self-end gap-4 text-sm">
      <button @click.prevent="onNewSectionClick" class="bg-green-500 text-white p-2 rounded mb-4">
        + Nova Seção
      </button>
      <button @click.prevent="removeAllSections" class="bg-red-500 text-white p-2 rounded mb-4 flex items-center gap-1">
        <TrashIcon class="size-4" /> Remover Seções
      </button>

    </div>
    <EasyDataTable :headers="headers" :items="items" style="width: 100%;" @click-row="onRowClick" />
  </div>

  <div v-if="isModalOpen"
    class="bg-black/50 w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center">
    <div class="w-2/5 bg-white rounded flex flex-col p-4 text-sm">
      <button @click.prevent="isModalOpen = false" class="self-end mb-4">X</button>
      <form class="flex flex-col gap-4" @submit.prevent="upsertSection">
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
        <div v-if="sectionForm.id" class="flex flex-col">
          <label>Totalizada</label>
          <input type="checkbox" v-model="sectionForm.closed" />
        </div>
        <button class="p-2 text-sm bg-green-400 rounded hover:brightness-90" type="submit">{{ sectionForm.id ?
          'Atualizar' :
          'Criar' }}</button>
      </form>
    </div>
  </div>
</template>