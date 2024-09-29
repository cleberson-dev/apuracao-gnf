<script setup lang="ts">
import { FormKit } from '@formkit/vue';
import { push } from 'notivue';

import CandidateService from '../services/candidate.service';
import SectionService, { Zone } from '../services/section.service';

import { StateSection, useSectionStore } from '../store/section.store';

const sectionStore = useSectionStore();
const candidates = CandidateService.getAll();

const props = defineProps<{ section?: StateSection }>();
const emit = defineEmits(["success"]);

const classes = {
  input: "border border-solid border-borderColor focus:outline-primary placeholder:text-black p-2 text-sm rounded uppercase w-full"
}

const onSubmit = async (fields: any) => {
  if (!!props.section) {
    const updatedSection = await SectionService.update(props.section.id, {
      number: fields.number,
      closed: fields.closed,
      local: fields.name,
      voters: fields.voters,
      zone: fields.zone as Zone,
    });
    sectionStore.patchSection(props.section.id, updatedSection);
    push.success("Seção atualizada!");
    emit("success");
    return;
  }

  if (sectionStore.sections.some(s => s.number === fields.number)) {
    push.error("Já existe uma seção com esse numero");
    return;
  }
  const newSection = await SectionService.create({
    number: fields.number,
    local: fields.local,
    voters: fields.voters,
    zone: fields.zone as Zone,
  });

  sectionStore.addSection(newSection);
  push.success(`Seção #${newSection.number} foi criada com sucesso!`);
  emit('success');
}

const castRangeToNumber = (node: any) => {
  if (node.context.type === "number") {
    node.hook.input((value: any, next: any) => next(+value));
  }
}

</script>

<template>
  <FormKit type="form" :classes="{ form: 'flex flex-col gap-4 mt-10', message: 'text-red-500' }" @submit="onSubmit"
    :plugins="[castRangeToNumber]" :submit-label="section ? 'Atualizar' : 'Criar'" :submit-attrs="{
      inputClass: 'bg-primary w-full text-white rounded p-2 hover:brightness-90 transition-all'
    }">
    <div class="grid grid-cols-3 gap-4">
      <FormKit :classes="{ input: classes.input, message: 'text-red-500', label: 'font-bold text-gray-500' }"
        type="number" label="Nº Seção" name="number" :value="(section?.number ?? 0) + ''" validation="required|min:0" />
      <FormKit :classes="{ input: classes.input, message: 'text-red-500', label: 'font-bold text-gray-500' }"
        type="select" label="Zona" name="zone" :value="section?.zone" :options="['urbana', 'rural']"
        validation="required" />
      <FormKit :classes="{ input: classes.input, message: 'text-red-500', label: 'font-bold text-gray-500' }"
        type="number" label="Nº de Eleitores" name="voters" :value="(section?.voters ?? 0) + ''"
        validation="required|min:0" />
    </div>
    <FormKit :classes="{ input: classes.input, message: 'text-red-500', label: 'font-bold text-gray-500' }" type="text"
      label="Local" name="local" :value="section?.local" validation="required" />
    <FormKit v-if="!!section"
      :classes="{ input: classes.input, message: 'text-red-500', wrapper: 'flex gap-1 items-center w-fit' }"
      type="checkbox" label="Totalizada" name="closed" :value="!!section.closed" />
    <hr class="my-2" />
    <FormKit type="group" name="votes" v-if="!!section && Object.values(section.votes).some(vote => vote !== 0)">
      <label class="font-semibold text-lg block mb-4">Votos</label>
      <ul class="flex flex-col gap-2">
        <li v-for="candidate in candidates" class="grid grid-cols-[auto_1fr_auto] items-center select-none">
          <span class="inline-block rounded-full size-4 mr-1" :style="{ backgroundColor: candidate.color }"></span>
          <span>{{ candidate.name }} ({{ candidate.number }})</span>
          <FormKit type="number"
            :classes="{ input: 'border border-solid border-borderColor outline-primary w-16 p-2 rounded font-semibold ml-2', message: 'text-red-500' }"
            :name="candidate.number + ''" :value="section.votes[candidate.number] + ''" validation="required|min:0" />
        </li>
      </ul>
    </FormKit>
  </FormKit>
</template>