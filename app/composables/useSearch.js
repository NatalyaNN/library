export function useSearch() {
   const results = ref([])
   const query = ref('')
   const loading = ref(false)

   async function search() {
      if (!query.value.trim()) return

      loading.value = true
      try {
         const response = await fetch(`/api/books?query=${query.value}`)
         const data = await response.json()
         results.value = data
      } catch (error) {
         console.error('Ошибка при поиске:', error)
      } finally {
         loading.value = false
      }
   }

   return {
      search,
      results,
      loading
   }
}
 