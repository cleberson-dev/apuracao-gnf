<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { push } from 'notivue';
import type { Header, Item } from 'vue3-easy-data-table';
import { PlusIcon, TableCellsIcon, TrashIcon } from '@heroicons/vue/24/solid';

import CandidateService from '../services/candidate.service';

import { useSectionStore } from '../store/section.store';
import useModal from '../composables/useModal';
import ConfirmationDialog from '../components/ConfirmationDialog.vue';
import SectionForm from '../components/SectionForm.vue';
import type { Section } from '../../types';

const modal = useModal();

const isModalOpen = ref(false);

const sectionStore = useSectionStore();
const selectedSection = ref<Section | undefined>();
const getSectionItems = () => sectionStore.sections.sort((a, b) => a.number - b.number);
onMounted(() => {
  sectionStore.$subscribe(() => {
    items.value = getSectionItems();
  })
});

const numberOfCandidates = CandidateService.getAll().length;

const headers: Header[] = [
  { text: "Seção # 🔢", value: "number", sortable: true, },
  { text: "Local 🏫", value: "local", sortable: true, },
  { text: "Zona 🏙️🏘️", value: "zone", sortable: true, },
  { text: "Nº de Eleitores 👨‍👩‍👧‍👦", value: "voters", sortable: true, },
  { text: "Votos", value: "votes" },
  { text: "Totalizada", value: "closed", sortable: true, },
  { text: "Ações", value: 'actions' },
];

const items: Ref<Item[]> = ref(getSectionItems());

const onRowClick = (section: Section) => {
  selectedSection.value = section;
  isModalOpen.value = true;
}

const onNewSectionClick = () => {
  selectedSection.value = undefined;
  isModalOpen.value = true;
}

function openConfirmationDialog(confirmFn: () => void) {
  modal.addModal(<ConfirmationDialog onConfirm={confirmFn} />);
}

async function removeAllSections() {
  sectionStore.removeAllSections();
  push.success("Todas as seções foram removidas!");
}

async function removeSection(section: Section) {
  sectionStore.removeSection(section.id);
  push.success(`Seção #${section.number} foi removida com sucesso!`);
}

function resetSections() {
  sectionStore.reset();
  push.success("Seções restauradas!");
}

const nf = Intl.NumberFormat("pt-BR");

const searchText = ref<string>('');
</script>

<template>
  <div class="p-10 w-[calc(100vw-8rem)] flex flex-col">
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
      <button @click.prevent="onNewSectionClick"
        class="bg-green-500 text-white p-2 rounded mb-4 flex items-center gap-1">
        <PlusIcon class="size-3" /> Criar
      </button>
      <button :disabled="sectionStore.sections.length === 0" @click.prevent="openConfirmationDialog(removeAllSections)"
        class="bg-red-500 text-white p-2 rounded mb-4 flex items-center gap-1 disabled:opacity-50">
        <TrashIcon class="size-3" />
        Remover todas as seções
      </button>
      <button :disabled="sectionStore.sections.length === 0" @click.prevent="openConfirmationDialog(resetSections)"
        class="bg-orange-500 text-white p-2 rounded mb-4 flex items-center gap-1 disabled:opacity-50">
        <TableCellsIcon class="size-3" />
        Restaurar seções
      </button>
    </div>

    <label class="text-xs mb-1">Pesquisar</label>
    <input type="text"
      class="border border-solid border-borderColor rounded mb-2 focus:outline-primary text-sm p-1 px-2 uppercase"
      v-model="searchText" />

    <EasyDataTable :headers="headers" :items="items" style="width: 100%;" @click-row="onRowClick" search-field="local"
      :search-value="searchText">
      <template #item-votes="item">
        {{ (Object.values(item.votes) as number[]).reduce((acc, val) => acc + val, 0) }}
      </template>
      <template #item-actions="item">
        <button @click.stop="openConfirmationDialog(() => removeSection(item))">
          <TrashIcon class="text-red-500 size-4" />
        </button>
      </template>
      <template #item-closed="section">
        {{ section.closed ? 'Sim ✅' : 'Não ❌' }}
      </template>
    </EasyDataTable>
  </div>

  <div v-if="isModalOpen"
    class="backdrop-blur w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center">
    <div class="w-2/5 max-h-[90vh] overflow-auto bg-white rounded flex flex-col p-4 text-sm shadow">
      <div class="flex justify-between">
        <h1 class="font-bold text-2xl">{{ selectedSection ? 'Atualizar seção' : 'Criar seção' }}</h1>
        <button class="rounded-full hover:bg-red-500/20 flex items-center justify-center size-8 transition-colors"
          @click.prevent="isModalOpen = false">X</button>
      </div>

      <SectionForm :section="selectedSection" @success="isModalOpen = false" />
    </div>
  </div>
</template>