<script setup lang="tsx">
import { HomeIcon, PencilSquareIcon, CameraIcon, TrashIcon, CircleStackIcon, TableCellsIcon } from '@heroicons/vue/24/outline'
import { UtilService } from "../services/util.service";
import { useRouter } from 'vue-router';
import useModal from '../composables/useModal';
import ConfirmationDialog from './ConfirmationDialog.vue';
import { useSectionStore } from '../store/section.store';
import { IS_DEV } from '../utils';

const router = useRouter();
const modal = useModal();
const sectionStore = useSectionStore();

const items = [
  { href: '/', label: 'Início', icon: HomeIcon },
  { href: '/cadastrar', label: 'Cadastrar', icon: PencilSquareIcon },
  { onClick: onPrint, label: 'Screenshot', icon: CameraIcon },
  { label: "Database", icon: CircleStackIcon, href: '/database' },
]

if (IS_DEV) {
  items.push({ label: "Limpar Votos", icon: TrashIcon, onClick: cleanVotes }, { label: "Simular", icon: TableCellsIcon, onClick: simulate });
}

async function onPrint() {
  const image = await UtilService.screenshot();

  const link = document.createElement("a");
  link.download = `resultados_${Date.now()}.png`;
  link.href = image;
  link.click();
}

async function cleanVotes() {
  modal.addModal(
    <ConfirmationDialog
      onConfirm={() => {
        router.push("/limpar");
      }}
    />
  );
}

async function simulate() {
  sectionStore.simulate();
}
</script>

<template>
  <header class="bg-primary h-full text-white max-w-[6rem]">
    <div class="w-full flex justify-center items-center py-5">
      <img alt="Logo" src="../assets/img/logo.png" class="w-9" />
    </div>
    <nav class="text-[0.8rem] decoration-none font-bold">
      <li v-for="item in items" class="py-4 px-1 hover:bg-[rgba(0,0,0,.2)] list-none transition-colors cursor-pointer">
        <router-link v-if="!!item.href" :to="item.href"
          class="flex flex-col justify-center items-center text-wrap text-center">
          <component :is="item.icon" class="size-7 mb-2" />
          {{ item.label }}
        </router-link>
        <button v-if="!!item.onClick" @click.prevent="item.onClick"
          class="w-full flex flex-col justify-center items-center">
          <component :is="item.icon" class="size-7 mb-2" />
          {{ item.label }}
        </button>
      </li>
    </nav>
  </header>
</template>