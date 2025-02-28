<template>
  <div class="user-books">
    <div class="books-grid">
      <div
        v-for="book in books"
        :key="book.id"
        class="book-card"
        @click="trade && handleBookClick(book)"
      >
        <img
          :src="book.image || fallbackImage"
          :alt="book.title"
          class="book-image"
          @error="(e) => (e.target.src = fallbackImage)"
        />
        <h2 class="book-title">{{ book.title }}</h2>
        <p class="book-author">{{ book.author }}</p>
      </div>
    </div>

    <BookTradeDialog
      v-model:visible="isModalVisible"
      :tradeBook="selectedBook"
      :userBooks="userBooks"
      @confirm="confirmTrade"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BookTradeDialog from '../components/BookTradeDialog.vue'

const { trade, books, userBooks } = defineProps({
  trade: {
    type: Boolean,
    default: false,
  },
  books: {
    type: Array,
    default: () => [
      { id: 1, title: 'Livro 1', author: 'Autor 1', image: 'https://placehold.co/200x300?text=No+Image' },
      { id: 2, title: 'Livro 2', author: 'Autor 2', image: 'https://placehold.co/200x300?text=No+Image' },
      { id: 3, title: 'Livro 3', author: 'Autor 3', image: 'https://placehold.co/200x300?text=No+Image' },
      { id: 4, title: 'Livro 4', author: 'Autor 4', image: 'https://placehold.co/200x300?text=No+Image' },
    ],
  },
  // Coleção de livros do usuário para seleção na troca
  userBooks: {
    type: Array,
    default: () => [
      { id: 101, title: 'Meu Livro 1', author: 'Eu', image: 'https://placehold.co/200x300?text=No+Image' },
      { id: 102, title: 'Meu Livro 2', author: 'Eu', image: 'https://placehold.co/200x300?text=No+Image' },
      // Adicione mais livros conforme necessário
    ],
  },
})

const fallbackImage = 'https://placehold.co/200x300?text=No+Image'
const isModalVisible = ref(false)
const selectedBook = ref(null)

function handleBookClick(book) {
  if (trade) {
    selectedBook.value = book
    isModalVisible.value = true
  }
}

function confirmTrade(selectedUserBook) {
  console.log('Troca confirmada para o livro:', selectedBook.value, 'com meu livro:', selectedUserBook)
  closeModal()
}

function closeModal() {
  isModalVisible.value = false
  selectedBook.value = null
}
</script>

<style scoped>
.user-books {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.books-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.book-card {
  flex: 1 1 200px;
  border-radius: 0.25rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.book-card:hover {
  transform: scale(1.02);
}

.book-image {
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
  object-fit: cover;
  margin-bottom: 1rem;
}

.book-title {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.book-author {
  font-size: 1rem;
  color: #555;
}
</style>
