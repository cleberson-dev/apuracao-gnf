<script setup lang="ts">
import type { Header, Item } from 'vue3-easy-data-table';
import { useSectionStore } from '../store/section.store';
import { reactive, ref } from 'vue';
import { push } from 'notivue';
import { Zone } from '../services/section.service';

const isModalOpen = ref(false);
const isEditing = ref(false);
const sectionForm = reactive({
  number: 0,
  name: '',
  zone: 'urbana',
  voters: 1,
  closed: false,
})

const sectionStore = useSectionStore();

const headers: Header[] = [
  { text: "Seção #", value: "number", sortable: true, },
  { text: "Local", value: "name", sortable: true, },
  { text: "Zona", value: "zone", sortable: true, },
  { text: "Nº de Eleitores", value: "voters", sortable: true, },
  { text: "Totalizada", value: "closed", sortable: true, },
];

const items: Item[] = sectionStore.sections.map((s): Item => ({
  number: s.number,
  name: s.local,
  zone: s.zone,
  voters: `${s.voters} eleitores`,
  closed: s.closed ? 'Sim ✅' : 'Não ❌',
}));

const upsertSection = () => {
  const values = { ...sectionForm };

  if (!isEditing.value && sectionStore.sections.some(s => s.number === values.number)) {
    push.error("Já existe uma seção com esse numero");
    return;
  }
  sectionStore.addSection({
    number: values.number,
    local: values.name,
    voters: values.voters,
    closed: values.closed,
    zone: values.zone as Zone,
  });
  push.success("Seção criada!");
  isModalOpen.value = false;
}

const classes = {
  input: "bg-slate-200 placeholder:text-black p-2 text-sm rounded"
}

</script>

<template>
  <div class="p-10 w-[calc(100vw-6.3rem)] flex flex-col">
    <button @click.prevent="isModalOpen = true" class="bg-green-500 text-white p-2 rounded mb-4 self-end">+ Nova
      Seção</button>
    <p><small>{{ sectionStore.sections.length }} seções registradas</small></p>
    <EasyDataTable :headers="headers" :items="items" style="width: 100%;" />
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
        <button class="p-2 text-sm bg-green-400 rounded hover:brightness-90" type="submit">Criar</button>
      </form>
    </div>
  </div>
</template>