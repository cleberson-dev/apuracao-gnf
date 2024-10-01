<template>
  <div class="relative" @blur="onBlur" ref="container-ref">
    <div
      class="border border-solid border-borderColor p-2 cursor-pointer rounded flex items-center justify-between select-none">
      <input type="text" placeholder="Selecione sua seção" class="outline-none flex-grow bg-transparent"
        @focus="isExpanded = true" v-model="searchText" @keydown="onKeyDown" ref="input-ref" />
      <button @click="isExpanded = !isExpanded" type="button">
        <component :is="isExpanded ? ChevronUpIcon : ChevronDownIcon" class="size-4" />
      </button>
    </div>
    <ul ref="list-ref"
      class="z-10 max-h-64 bg-white dark:bg-[#212529] border border-solid border-borderColor rounded absolute top-full w-full left-0 overflow-auto"
      :class="{ invisible: !isExpanded }">
      <li v-if="filteredItems.length === 0" class="p-2 text-center">No results</li>
      <li v-for="item in filteredItems" class="p-2 hover:bg-black/10 cursor-pointer focus:bg-black/10"
        :class="{ 'bg-black/10': item.value === hovered?.value, 'bg-red-500 hover:bg-red-600 text-gray-600': item.marked }"
        @click.stop="onSelect(item)">{{
          item.label }}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef, ref } from 'vue';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid';

type Item = {
  label: string;
  value: any;
  marked?: boolean;
}

const props = defineProps<{
  items: Item[];
  value?: any;
}>();

const emit = defineEmits<{ (e: "change", value: any): void }>()

const isExpanded = ref(false);
const searchText = ref('');

const filteredItems = computed(() => {
  return props.items.filter(item => item.label.toLowerCase().includes(searchText.value?.toLowerCase()));
});

const selected = computed(() => props.value ? filteredItems.value.find(item => item.value === props.value) : undefined);
const hovered = ref<Item | null>(null);

const containerRef = useTemplateRef<HTMLDivElement>('container-ref');
const inputRef = useTemplateRef<HTMLInputElement>('input-ref');

const onBlur = () => {
  isExpanded.value = false;
  searchText.value = selected.value?.label ?? '';
}

const onSelect = (item: Item) => {
  if (item.value !== selected.value?.value) {
    searchText.value = item.label;
    emit("change", item.value);
  }
  isExpanded.value = false;
}

const clickOutside = (e: MouseEvent) => {
  const isInside = containerRef.value!.contains((e.target as Element));
  if (isInside || !isExpanded.value) return;
  isExpanded.value = false;

  if (!searchText.value) {
    emit("change", undefined);
    return;
  }

  const exactMatch = filteredItems.value.find(v => v.label.toLowerCase() === searchText.value.toLowerCase());
  if (exactMatch) {
    if (exactMatch.value === selected.value?.value) return;
    emit("change", exactMatch.value);
    return;
  } else {
    searchText.value = '';
    emit("change", undefined);
  }
}

onMounted(() => {
  window.addEventListener("click", clickOutside)
});

onUnmounted(() => {
  window.removeEventListener("click", clickOutside);
});

const onKeyDown = (e: KeyboardEvent) => {
  isExpanded.value = true;

  if (e.key === "ArrowDown") {
    if (!hovered.value) {
      hovered.value = filteredItems.value[0];
      return;
    }
    const idx = filteredItems.value.findIndex(val => val.value === hovered.value!.value);
    if (idx === -1) return;
    hovered.value = filteredItems.value.at((idx + 1) % filteredItems.value.length)!;
  }

  if (e.key === "ArrowUp") {
    if (!hovered.value) return;
    const idx = filteredItems.value.findIndex(val => val.value === hovered.value!.value);
    if (idx === 0) {
      hovered.value = null;
      return;
    }
    hovered.value = filteredItems.value.at((idx - 1))!;
  }

  if (e.key === 'Enter' && hovered.value) {
    emit("change", hovered.value.value);
    searchText.value = hovered.value.label;
    inputRef.value?.blur();
    isExpanded.value = false;
    return;
  }
}
</script>