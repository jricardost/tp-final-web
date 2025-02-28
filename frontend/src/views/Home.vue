<template>
  <div class="home-page">
    <header>
      <h1>Home</h1>
    </header>
    <section class="user-books-section">
      <h2>Meus Livros</h2>
      <!-- Exibe os livros do usuário (trade: false por padrão) -->
      <Books />
    </section>
    <section class="trade-books-section">
      <h2>Disponíveis para troca</h2>
      <!-- Exibe os livros disponíveis para troca, passando a prop trade -->
      <Books :trade="true" />
    </section>
  </div>
</template>

<script setup>
import Books from '../components/Books.vue'
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

section {
  margin-bottom: 3rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}
</style>
