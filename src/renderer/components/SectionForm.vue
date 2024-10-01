<script setup lang="ts">
import { getNode } from '@formkit/core';
import { FormKit } from '@formkit/vue';
import { push } from 'notivue';

import CandidateService from '../services/candidate.service';
import type { Section, Zone } from '../../types';

import { useSectionStore } from '../store/section.store';

const sectionStore = useSectionStore();
const candidates = CandidateService.getAll();

const props = defineProps<{ section?: Section }>();
const emit = defineEmits(["success"]);

const votes = getNode('votes');
console.log({ votes });

const ENABLE_VOTES = false;

const classes = {
  input: "border border-solid border-borderColor focus:outline-primary placeholder:text-black p-2 text-sm rounded uppercase w-full"
}

const onSubmit = async (fields: any) => {
  if (!!props.section) {
    sectionStore.patchSection(props.section.id, {
      number: fields.number,
      closed: fields.closed,
      local: fields.local.toUpperCase(),
      voters: fields.voters,
      zone: fields.zone as Zone,
    });
    push.success("Seção atualizada!");
    emit("success");
    return;
  }

  sectionStore.createSection({
    number: fields.number,
    local: fields.local,
    voters: fields.voters,
    zone: fields.zone as Zone,
  });
  push.success(`Seção '${fields.local}' foi criada com sucesso!`);
  emit('success');
}

const castRangeToNumber = (node: any) => {
  if (node.context.type === "number") {
    node.hook.input((value: any, next: any) => next(+value));
  }
}

const votesWithVoters = (node: any) => {
  const totalVotes = node.children.reduce((acc: any, val: any) => acc + val.value, 0)
  const voters = node.at('$parent.voters').value;

  return totalVotes < voters;
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
    <FormKit type="group" id="votes" name="votes"
      v-if="!!section && Object.values(section.votes).some(vote => vote !== 0)" validation-visibility="live"
      :validation-rules="{ votesWithVoters }" validation="votesWithVoters" :validation-messages="{
        votesWithVoters: () => 'Votos totais devem ser menor que total de eleitores'
      }" #default="{ id, messages, fns, classes }">
      <label class="font-semibold text-lg block mb-4">Votos</label>
      <ul :class="classes.messages" v-if="fns.length(messages)">
        <li v-for="message in messages" :key="message.key" :class="classes.message" :id="`${id}-${message.key}`"
          :data-message-type="message.type">{{ message.value }}</li>
      </ul>
      <ul class="flex flex-col gap-2">
        <li v-if="ENABLE_VOTES" v-for="candidate in candidates"
          class="grid grid-cols-[auto_1fr_auto] items-center select-none relative">
          <span class="inline-block rounded-full size-4 mr-1" :style="{ backgroundColor: candidate.color }"></span>
          <span>{{ candidate.name }} ({{ candidate.number }})</span>
          <FormKit type="number"
            :classes="{ input: 'border border-solid border-borderColor outline-primary w-16 p-2 rounded font-semibold ml-2', message: 'text-red-500 absolute left-0 -bottom-3' }"
            :name="candidate.number + ''" :value="section.votes[candidate.number] + ''" validation="required|min:0" />
        </li>
      </ul>
    </FormKit>
  </FormKit>
</template>