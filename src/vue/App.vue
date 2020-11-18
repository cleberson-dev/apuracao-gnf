<template>
  <div id="app">
    <my-header />

    <main>
      <router-view />
    </main>
  </div>
</template>

  

<script>
import { mapActions } from "vuex";
import MyHeader from "./components/MyHeader";
import { wsc } from "./main";

export default {
  name: "App",
  components: {
    MyHeader,
  },
  created() {
    this.fetchSections();
    this.fetchCandidates();
    wsc.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "UPDATED_SECTION":
          console.log(message.payload);
          this.updateSection(message.payload);
          break;
        default:
          console.log(message);
      }
    };
  },
  methods: {
    ...mapActions(["fetchSections", "fetchCandidates", "updateSection"]),
  },
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
