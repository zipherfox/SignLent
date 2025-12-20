// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode'
  ],

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
    exposeConfig: true,
    config: {
      theme: {
        extend: {
          colors: {
            'slate-blue': '#6b7a9a',
            'navy-dark': '#394563',
            'navy-deeper': '#1a1f2e',
            'cream': '#ebe9e0',
            'burgundy': '#8e2423',
            'burgundy-dark': '#6b1b1a',
          }
        }
      }
    }
  }
})
