// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // pages: true,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Library',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  },
  modules: ['@nuxt/ui', '@nuxtjs/color-mode'],
  colorMode: {
    preference: 'system', // или 'light'/'dark'
    fallback: 'dark'
  },
})