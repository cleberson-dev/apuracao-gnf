<template>
  <header>
    <img alt="Logo" src="" />
    <nav>
      <li>
        <router-link to="/" class="item">
          <img src="/img/icons/home.svg" />
          Início
        </router-link>
      </li>
      <li>
        <router-link to="/resultados" class="item">
          <img src="/img/icons/result.svg" />
          Resultados
        </router-link>
      </li>
      <li>
        <router-link to="/cadastrar" class="item">
          <img src="/img/icons/pen.svg" />
          Cadastrar
        </router-link>
      </li>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'MyHeader'
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
</style>