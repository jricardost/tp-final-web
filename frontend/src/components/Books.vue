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
          :src="book.image || getRandomFallback()"
          :alt="book.title"
          class="book-image"
          @error="(e) => (e.target.src = getRandomFallback())"
        />
        <h2 class="book-title">{{ book.title }}</h2>
        <p class="book-author">{{ book.author }}</p>
      </div>
    </div>

    <!-- Exibe o modal de troca apenas se o modo trade estiver ativo -->
    <BookTradeDialog
      v-if="trade"
      v-model:visible="isModalVisible"
      :tradeBook="selectedBook"
      :userBooks="userBooks"
      @confirm="confirmTrade"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BookTradeDialog from './BookTradeDialog.vue'

const props = defineProps({
  trade: {
    type: Boolean,
    default: false,
  },
  books: {
    type: Array,
    default: () => [],
  },
  userBooks: {
    type: Array,
    default: () => [],
  },
})

const isModalVisible = ref(false)
const selectedBook = ref(null)

// Função para gerar um link de placeholder com cores aleatórias
function getRandomFallback() {
  const bgColor = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')
  const textColor = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')
  return `https://placehold.co/200x300/${bgColor}/${textColor}?text=No+Image`
}

// Abre o modal de troca se estiver no modo trade
function handleBookClick(book) {
  if (props.trade) {
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

onMounted(() => {
  console.log('Books:', props.books)
})
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
