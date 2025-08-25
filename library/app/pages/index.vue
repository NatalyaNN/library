<script setup lang="ts">
// Тип для книги
interface Book {
  id: string
  title: string
  author: string
  year: number
  description: string
  coverUrl?: string
}

// Состояние поиска
const searchQuery = ref('')
const searchResults = ref<Book[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

// Функция поиска (заглушка - в реальности API-запрос)
const searchBooks = async () => {
  if (!searchQuery.value.trim()) {
    errorMessage.value = 'Пожалуйста, введите поисковый запрос'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Имитация API-запроса
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Заглушечные данные
    searchResults.value = [
      {
        id: '1',
        title: 'Введение в Nuxt 3',
        author: 'Алексей Иванов',
        year: 2023,
        description: 'Полное руководство по фреймворку Nuxt 3',
        coverUrl: '/covers/nuxt-book.jpg'
      },
      {
        id: '2',
        title: 'Доступный веб-дизайн',
        author: 'Мария Петрова',
        year: 2022,
        description: 'Принципы создания инклюзивных интерфейсов'
      }
    ]
  } catch (error) {
    errorMessage.value = 'Ошибка при поиске книг. Пожалуйста, попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Заголовок с aria-label для скринридеров -->
    <h1 class="text-3xl font-bold mb-8" aria-label="Поиск книг">Поиск книг</h1>
    
    <!-- Форма поиска -->
    
      <form @submit.prevent="searchBooks">
        <div class="flex flex-row space-x-4">
          <UInput
            v-model="searchQuery"
            placeholder="Введите название книги, автора или описание"
            aria-label="Поиск книг"
            aria-required="true"
            size="xl"
            :loading="isLoading"
            icon="i-heroicons-magnifying-glass"
          />
          
          <!-- Кнопка поиска -->
          <UButton
            type="submit"
            size="xl"
            :disabled="isLoading"
            aria-label="Начать поиск"
            label="Найти"
            icon="i-heroicons-arrow-right"
            :trailing="true"
          />
        </div>
      </form>
    

    <!-- Сообщения об ошибках -->
    <UAlert
      v-if="errorMessage"
      :title="errorMessage"
      icon="i-heroicons-exclamation-triangle"
      color="warning"
      variant="solid"
      class="mb-8"
      role="alert"
    />

    <!-- Результаты поиска -->
    <section aria-labelledby="results-heading">
      <h2 id="results-heading" class="sr-only">Результаты поиска</h2>
      
      <template v-if="searchResults.length > 0">
        <ul class="space-y-6">
          <li v-for="book in searchResults" :key="book.id">
            <UCard variant="outline">
              <div class="flex flex-col sm:flex-row gap-4">
                <!-- Обложка книги (если есть) -->
                <div 
                  v-if="book.coverUrl"
                  class="w-full sm:w-48 flex-shrink-0 bg-gray-100 dark:bg-gray-800"
                >
                  <img
                    :src="book.coverUrl"
                    :alt="`Обложка книги ${book.title}`"
                    class="w-full h-full object-cover"
                  />
                </div>
                
                <!-- Информация о книге -->
                <div class="p-4 flex-1">
                  <h3 class="text-xl font-semibold mb-2">
                    <NuxtLink 
                      :to="`/books/${book.id}`"
                      class="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      {{ book.title }}
                    </NuxtLink>
                  </h3>
                  
                  <p class="text-gray-600 dark:text-gray-300 mb-2">
                    <span class="font-medium">Автор:</span> {{ book.author }}
                  </p>
                  
                  <p class="text-gray-600 dark:text-gray-300 mb-2">
                    <span class="font-medium">Год:</span> {{ book.year }}
                  </p>
                  
                  <p class="text-gray-700 dark:text-gray-200">
                    {{ book.description }}
                  </p>
                </div>
              </div>
            </UCard>
          </li>
        </ul>
      </template>
      
      <!-- Сообщение, если результатов нет -->
      <UAlert
        v-else-if="!isLoading && searchQuery"
        title="Книги не найдены"
        description="Попробуйте изменить поисковый запрос"
        icon="i-heroicons-book-open"
        color="info"
        variant="soft"
        class="mt-8"
      />
    </section>
  </div>
</template>