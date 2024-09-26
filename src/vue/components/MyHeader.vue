<script setup lang="ts">
import { HomeIcon, PencilSquareIcon, CameraIcon } from '@heroicons/vue/24/outline'
import { UtilService } from "../services/util.service";

const items = [
  { href: '/', label: 'Início', icon: HomeIcon },
  { href: '/cadastrar', label: 'Cadastrar', icon: PencilSquareIcon },
  { onClick: onPrint, label: 'Screenshot', icon: CameraIcon },
]

async function onPrint() {
  const data = await UtilService.screenshot();

  const link = document.createElement("a");
  link.download = data.name;
  link.href = data.path;
  link.click();
}
</script>

<template>
  <header class="bg-[#2a9d8f] h-[100vh] w-20 fixed">
    <div class="w-full flex justify-center items-center py-5">
      <img alt="Logo" src="../assets/img/logo.png" class="w-9" />
    </div>
    <nav class="text-white text-[0.8rem] decoration-none font-bold lowercase">
      <li v-for="item in items" class="p-4 hover:bg-[rgba(0,0,0,.2)] list-none transition-colors cursor-pointer">
        <router-link v-if="!!item.href" :to="item.href" class="flex flex-col justify-center items-center">
          <item.icon class="size-7 mb-2" />
          {{ item.label }}
        </router-link>
        <button v-if="!!item.onClick" @click.prevent="item.onClick"
          class="w-full flex flex-col justify-center items-center">
          <item.icon class="size-7 mb-2" />
          {{ item.label }}
        </button>
      </li>
    </nav>
  </header>
</template>