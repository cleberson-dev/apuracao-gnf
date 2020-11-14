<template>
  <div id="app">
    <my-header />

    <main>
      <router-view />
    </main>
  </div>
</template>

  

<script>
import MyHeader from "./components/MyHeader";

export default {
  name: "App",
  components: {
    MyHeader
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
