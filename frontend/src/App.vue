<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link
        v-if="!token"
        to="/login"
      >Login</router-link>
      <router-link
        v-if="!token"
        to="/register"
      >Cadastro</router-link>
      <a
        v-if="token"
        @click="logout"
      >Sair</a>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = ref(localStorage.getItem('token'))
let isAdmin = ref(localStorage.getItem('isAdmin')).value == 'true' ? true : false

function logout() {
  localStorage.clear()
  token.value = null
  isAdmin = false
  router.push('/')
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 20px;
}

nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

nav a {
  text-decoration: none;
  color: #42b983;
}

nav a.router-link-exact-active {
  font-weight: bold;
}
</style>