<template>
  <header>
    <div class="logo">
      <img alt="Logo" src="../assets/img/logo.png" />
    </div>
    <nav>
      <li>
        <router-link to="/" class="item">
          <img src="../assets/img/icons/home.svg" />
          Início
        </router-link>
      </li>
      <!-- <li>
        <router-link to="/resultados" class="item">
          <img src="/img/icons/result.svg" />
          Resultados
        </router-link>
      </li> -->
      <li>
        <router-link to="/cadastrar" class="item">
          <img src="../assets/img/icons/pen.svg" />
          Cadastrar
        </router-link>
      </li>
      <li>
        <button @click.prevent="onPrint" class="item">
          <img src="../assets/img/icons/camera.svg" />
          Screenshot
        </button>
      </li>
    </nav>
  </header>
</template>

<script>
import axios from 'axios';
export default {
  name: 'MyHeader',
  methods: {
    async onPrint() {
      const res = await axios.get('http://localhost:5000/print');
      const { data } = res.data;
      const link = document.createElement("a");
      link.download = data.name;
      link.href = data.path;
      link.click();
    }
  }
}
</script>

<style scoped>
header {
  background-color: #2A9D8F;
  height: 100vh;
  width: 80px;
  position: fixed;
}

header ul {
  margin: 0;
}

li {
  list-style: none;
  padding: 15px 0;
}

li:hover {
  background-color: rgba(0, 0, 0, .2);
}

nav .item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 0.8rem;
  text-transform: lowercase;
  font-weight: 700;
}



nav .item img {
  width: 28px;
  height: 28px;
  margin-bottom: 8px;
}

button.item {
  background: none;
  border: none;
  outline: none;
  width: 100%;
  font-family: 'Montserrat',sans-serif;
  cursor: pointer;
}

.logo {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}
.logo img { width: 36px; }
</style>