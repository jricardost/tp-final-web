<template>
  <div class="home-page">
    <header>
      <h1>Home</h1>
    </header>
    <section class="user-books-section">
      <h2>Meus Livros</h2>
      <!-- Exibe os livros do usuário (modo troca: false) -->
      <Books :books="books" />
    </section>
    <section class="trade-books-section">
      <h2>Disponíveis para troca</h2>
      <!-- Exibe os livros disponíveis para troca, passando a prop trade e a coleção de livros para seleção -->
      <Books
        :trade="true"
        :books="books"
        :userBooks="books"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Books from '../components/Books.vue'

// Ref que armazenará os livros retornados pela API
const books = ref([])

// Livros default para teste
const defaultBooks = [
  {
    id: 1,
    ownerId: 1,
    title: "O Codificador Limpo",
    author: "Bob Martin",
    edition: "Alta Books; 1ª edição (4 maio 2012)",
    preservation: "Novo",
    image: ""
  },
  {
    id: 7,
    ownerId: 1,
    title: "Livro Sobre Qualquer Coisa",
    author: "Joao Ricardo",
    edition: "2ª",
    preservation: "Novo",
    image: ""
  }
]

// Função que busca os livros do usuário via GET
async function fetchBooks() {
  
  const userId = localStorage.getItem('userId')
  try {
    const response = await fetch(`http://localhost:3000/books?userId=${userId}&filter=my`)
    const data = await response.json()
    if (Array.isArray(data) && data.length > 0) {
      books.value = data
    } else {
      books.value = defaultBooks
    }
  } catch (error) {
    console.error('Erro ao buscar os livros:', error)
    books.value = defaultBooks
  }
}

onMounted(() => {
  fetchBooks()
})
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
