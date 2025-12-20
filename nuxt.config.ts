// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-icon'
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'SignLent - Sign Language Translation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Translate sign language through smart gloves with real-time text-to-speech and subtitle display' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  colorMode: {
    classSuffix: ''
  },

  tailwindcss: {
    exposeConfig: true
  }
})
