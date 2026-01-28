// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth',
    'nuxt-icon'
  ],

  auth: {
    origin: process.env.NEXTAUTH_URL,
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'credentials'
    }
  },

  runtimeConfig: {
    authSecret: process.env.NEXTAUTH_SECRET,
    public: {
      // Add public config here
    }
  },

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // LiteSpeed server compatibility
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'X-XSS-Protection': '1; mode=block'
        }
      }
    }
  }
})
