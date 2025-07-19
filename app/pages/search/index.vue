<template>
   <div class="min-h-screen bg-gray-100 p-6">
      <h1 class="text-3xl font-bold mb-6 text-center">
         Поиск книг
      </h1>

      <form @submit.prevent="search" class="max-w-lg mx-auto">
         <div class="mb-4">
            <label for="query" class="block text-gray-700 font-bold mb-2">
               Введите название или автора
            </label>
            <input id="query" v-model="query" type="text"
               class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
               aria-label="Поиск книг" :placeholder="placeholder" @keydown.enter="search">
         </div>

         <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded font-semibold focus:outline-none"
            :disabled="!query">
            Поиск
         </button>
      </form>

      <div v-if="results.length > 0" class="mt-8 max-w-lg mx-auto">
         <h2 class="text-2xl font-bold mb-4">Результаты поиска:</h2>
         <div role="list" aria-label="Список найденных книг">
            <div v-for="(book, index) in results" :key="book.id" role="listitem"
               class="bg-white shadow p-4 mb-4 rounded">
               <h3 class="text-lg font-bold">{{ book.title }}</h3>
               <p class="text-gray-600">{{ book.author }}</p>
               <button @click="openBook(book.id)" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded font-semibold">
                  Открыть книгу
               </button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
// import { ref, onMounted } from 'vue'
import { useSearch } from '~/composables/useSearch'

const { search, results, loading } = useSearch()
const query = ref('')
const placeholder = ref('Начните вводить название или автора')

onMounted(() => {
   document.title = 'Поиск книг | Электронная библиотека'
})

function openBook(id) {
   // Логика перехода к книге
}
</script>
 
