<script setup lang="tsx">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import { push } from "notivue";
import type { Header, Item } from "vue3-easy-data-table";
import { PencilIcon, PlusIcon, TableCellsIcon, TrashIcon } from "@heroicons/vue/24/solid";

import CandidateService from "../services/candidate.service";

import { useSectionStore } from "../store/section.store";
import useModal from "../composables/useModal";
import ConfirmationDialog from "../components/ConfirmationDialog.vue";
import SectionForm from "../components/SectionForm.vue";
import type { Section } from "../../types";
import EraserIcon from "../icons/Eraser.icon.vue";
import { IS_DEV } from "../utils";
import { UtilService } from "../services/util.service";

const modal = useModal();

const isModalOpen = ref(false);

const sectionStore = useSectionStore();
const selectedSection = ref<Section | undefined>();
const getSectionItems = () =>
  sectionStore.sections.sort((a, b) => a.number.localeCompare(b.number));
onMounted(() => {
  sectionStore.$subscribe(() => {
    items.value = getSectionItems();
  });
});

const numberOfCandidates = CandidateService.getAll().length;

const headers: Header[] = [
  { text: "Seção # 🔢", value: "number", sortable: true },
  { text: "Local 🏫", value: "local", sortable: true },
  { text: "Zona 🏙️🏘️", value: "zone", sortable: true },
  { text: "Nº de Eleitores 👨‍👩‍👧‍👦", value: "voters", sortable: true },
  { text: "Votos", value: "votes" },
  { text: "Totalizada", value: "closed", sortable: true },
  { text: "Ações", value: "actions" },
];

const items: Ref<Item[]> = ref(getSectionItems());

const onRowClick = (section: Section) => {
  selectedSection.value = section;
  isModalOpen.value = true;
};

const onNewSectionClick = () => {
  selectedSection.value = undefined;
  isModalOpen.value = true;
};

function openConfirmationDialog(confirmFn: () => void) {
  modal.addModal(<ConfirmationDialog onConfirm={confirmFn} />);
}

async function removeAllSections() {
  sectionStore.removeAllSections();
  push.info("Todas as seções foram removidas!");
}

async function removeSection(section: Section) {
  sectionStore.removeSection(section.id);
  push.success(`Seção #${section.number} foi removida com sucesso!`);
}

async function resetSections() {
  const sections = await UtilService.importSections();
  sectionStore.reset(sections);
  push.info("Seções restauradas!");
}

const nf = Intl.NumberFormat("pt-BR");

const searchText = ref<string>("");

const sectionRowClassName = (item: Item) => {
  if (item.closed) return "closed-section-row";
  return "";
};
</script>

<template>
  <div class="p-10 w-[calc(100vw-8rem)] flex flex-col">
    <h1 class="font-bold text-2xl">Banco de Dados</h1>
    <p class="relative bottom-1">
      <small>
        {{ numberOfCandidates }} candidatos,
        {{ nf.format(sectionStore.countedVotes) }} votos registrados.
        <br />
        {{ nf.format(sectionStore.totalVoters) }} eleitores,
        {{ nf.format(sectionStore.totalVotersByZone("urbana")) }} na zona urbana e
        {{ nf.format(sectionStore.totalVotersByZone("rural")) }} na zona rural
        <br />
        {{ sectionStore.sections.length }} seções,
        {{ sectionStore.sectionsByZone("urbana").length }} urbanas e
        {{ sectionStore.sectionsByZone("rural").length }} rurais.
      </small>
    </p>
    <div class="flex self-end gap-4 text-sm">
      <button
        @click.prevent="onNewSectionClick"
        class="bg-green-500 text-white p-2 rounded mb-4 flex items-center gap-1"
      >
        <PlusIcon class="size-3" /> Criar
      </button>
    </div>

    <label class="text-xs mb-1">Pesquisar</label>
    <input
      type="text"
      class="border border-solid border-borderColor rounded mb-2 focus:outline-primary text-sm p-1 px-2 uppercase"
      v-model="searchText"
    />

    <EasyDataTable
      :headers="headers"
      :items="items"
      :search-value="searchText"
      search-field="local"
      :style="{ width: '100%' }"
      :body-row-class-name="sectionRowClassName"
    >
      <template #item-votes="item">
        {{ (Object.values(item.votes) as number[]).reduce((acc, val) => acc + val, 0) }}
      </template>
      <template #item-actions="item">
        <div class="flex gap-1 items-center">
          <button @click="onRowClick(item)" title="Editar">
            <PencilIcon
              class="text-blue-500 size-4 hover:text-blue-700 transition-colors"
            />
          </button>
          <button
            @click="openConfirmationDialog(() => removeSection(item))"
            title="Remover seção"
          >
            <TrashIcon class="text-red-500 size-4 hover:text-red-700 transition-colors" />
          </button>
          <button
            @click="
              openConfirmationDialog(() => sectionStore.cleanVotesBySection(item.id))
            "
            title="Limpar Votos da Seção"
          >
            <EraserIcon
              class="text-green-500 size-4 hover:text-green-700 transition-colors"
            />
          </button>
        </div>
      </template>
      <template #item-zone="section">
        <span class="uppercase">
          {{ section.zone }}
        </span>
      </template>
      <template #item-closed="section">
        {{ section.closed ? "Sim ✅" : "Não ❌" }}
      </template>
    </EasyDataTable>
  </div>

  <div
    v-if="isModalOpen"
    class="backdrop-blur w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center"
  >
    <div
      class="w-2/5 max-h-[90vh] overflow-auto bg-white rounded flex flex-col p-4 text-sm shadow"
    >
      <div class="flex justify-between">
        <h1 class="font-bold text-2xl">
          {{ selectedSection ? "Atualizar seção" : "Criar seção" }}
        </h1>
        <button
          class="rounded-full hover:bg-red-500/20 flex items-center justify-center size-8 transition-colors"
          @click.prevent="isModalOpen = false"
        >
          X
        </button>
      </div>

      <SectionForm :section="selectedSection" @success="isModalOpen = false" />
    </div>
  </div>
</template>

<style>
.vue3-easy-data-table__main .vue3-easy-data-table__body tr.closed-section-row td {
  @apply bg-green-100;
}

.vue3-easy-data-table__main .vue3-easy-data-table__body tr.closed-section-row:hover td {
  @apply bg-green-200;
}
</style>
