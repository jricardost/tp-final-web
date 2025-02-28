<template>
  <Dialog
    v-model:visible="localVisible"
    :style="dialogStyle"
    contentClass="trade-dialog-content"
    :closable="false"
  >
    <div class="trade-dialog-container">
      <div class="user-books-collection">
        <h2>Selecione um livro para troca</h2>
        <div class="books-grid">
          <div
            v-for="book in userBooks"
            :key="book.id"
            class="book-card"
            :class="{ selected: selectedUserBook && selectedUserBook.id === book.id }"
            @click="selectUserBook(book)"
          >
            <img
              :src="book.image || fallbackImage"
              :alt="book.title"
              class="book-image"
              @error="(e) => (e.target.src = fallbackImage)"
            />
            <h3 class="book-title">{{ book.title }}</h3>
          </div>
        </div>
      </div>
      <div class="trade-book-details">
        <h2>Livro para troca</h2>
        <div class="book-card trade-book">
          <img
            :src="tradeBook.image || fallbackImage"
            :alt="tradeBook.title"
            class="book-image"
            @error="(e) => (e.target.src = fallbackImage)"
          />
          <h3 class="book-title">{{ tradeBook.title }}</h3>
          <p class="book-author">{{ tradeBook.author }}</p>
        </div>
      </div>
    </div>
    <div class="dialog-actions">
      <Button
        label="Cancelar"
        @click="cancel"
        class="p-button-secondary"
      />
      <Button
        label="Confirmar Troca"
        @click="confirm"
        :disabled="!selectedUserBook"
      />
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  tradeBook: {
    type: Object,
    required: true,
  },
  userBooks: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

const localVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  },
})

const fallbackImage = 'https://placehold.co/200x300?text=No+Image'
const selectedUserBook = ref(null)

watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      selectedUserBook.value = null
    }
  }
)

function selectUserBook(book) {
  selectedUserBook.value = book
}

function confirm() {
  emit('confirm', selectedUserBook.value)
  close()
}

function cancel() {
  emit('cancel')
  close()
}

function close() {
  localVisible.value = false
}

const dialogStyle = computed(() => ({
  width: '90%',
  maxWidth: '1000px',
  margin: '0',
  borderRadius: '0',
  overflow: 'auto',
}))
</script>

<style scoped>
.trade-dialog-content {
  padding: 1rem;
}

.trade-dialog-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.user-books-collection {
  flex: 1 1 50%;
  border-right: 1px solid #ccc;
  padding-right: 1rem;
}

.trade-book-details {
  flex: 1 1 45%;
  padding-left: 1rem;
}

.books-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.book-card {
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  padding: 0.5rem;
  text-align: center;
  transition: transform 0.2s, border-color 0.2s;
}

.book-card.selected {
  border-color: #007bff;
  transform: scale(1.05);
}

.trade-book {
  cursor: default;
  border: none;
}

.book-image {
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
  object-fit: cover;
  margin-bottom: 0.5rem;
}

.book-title {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.book-author {
  font-size: 0.9rem;
  color: #555;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
