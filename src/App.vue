<template>
  <div id="app">
    <my-header />

    <main>
      <router-view />
    </main>
  </div>
</template>

  

<script>
import { mapActions } from 'vuex';
import MyHeader from "./components/MyHeader";

export default {
  name: "App",
  components: {
    MyHeader
  },
  created() {
    this.fetchSections();
    this.fetchCandidates();
  },
  methods: {
    ...mapActions(["fetchSections", "fetchCandidates"])
  }
};
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: "Montserrat", sans-serif;
  min-height: 100vh;
}

main {
  margin-left: 80px;
  height: 100%;
}
</style>
