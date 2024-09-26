<template>
  <header class="bg-[#2a9d8f] h-[100vh] w-20 fixed">
    <div class="w-full flex justify-center items-center py-5">
      <img alt="Logo" src="../assets/img/logo.png" class="w-9" />
    </div>
    <nav class="text-white text-[0.8rem] decoration-none font-bold lowercase">
      <li class="p-4 hover:bg-[rgba(0,0,0,.2)] list-none transition-colors">
        <router-link to="/" class="flex flex-col justify-center items-center">
          <HomeIcon class="size-7 mb-2" />
          Início
        </router-link>
      </li>
      <li class="p-4 hover:bg-[rgba(0,0,0,.2)] list-none transition-colors">
        <router-link to="/cadastrar" class="flex flex-col justify-center items-center">
          <PencilSquareIcon class="size-7 mb-2" />
          Cadastrar
        </router-link>
      </li>
      <li class="p-4 hover:bg-[rgba(0,0,0,.2)] list-none transition-colors">
        <button @click.prevent="onPrint"
          class="bg-none border-none outline-none w-full cursor-pointer flex flex-col justify-center items-center">
          <CameraIcon class="size-7 mb-2" />
          Screenshot
        </button>
      </li>
    </nav>
  </header>
</template>

<script setup lang="ts">
import axios from "axios";
import { HomeIcon, PencilSquareIcon, CameraIcon } from '@heroicons/vue/24/outline'

async function onPrint() {
  const res = await axios.get("http://localhost:5000/print");
  const { data } = res.data;
  const link = document.createElement("a");
  link.download = data.name;
  link.href = data.path;
  link.click();
}
</script>