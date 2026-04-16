import tailwindcss from "@tailwindcss/vite";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    ['@posthog/nuxt', {
      publicKey: process.env.NUXT_PUBLIC_POSTHOG_KEY || '',
      host: process.env.NUXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      clientConfig: {
        autocapture: true,
        capture_pageview: true,
      },
    }],
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    adminSessionPassword: process.env.NUXT_ADMIN_SESSION_PASSWORD || '',
    slackWebhookUrl: process.env.NUXT_SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL || '',
    supabaseServiceRoleKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.NUXT_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NUXT_SUPABASE_KEY || '',
    },
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'fr',
    locales: [
      { code: 'fr', name: 'Francais', language: 'fr-FR', file: 'fr.json' },
      { code: 'en', name: 'English', language: 'en-US', file: 'en.json' },
    ],
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'cours_info_locale',
      redirectOn: 'root',
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  ssr: true
})
