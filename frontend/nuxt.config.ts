// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: false,
  devtools: { enabled: false },
  sourcemap: {
    server: true,
    client: true,
  },
  nitro: {
    preset: "node-server",
    prerender: {
      crawlLinks: false,
      failOnError: false,
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "/api",
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-color-picker",
    "@nuxtjs/google-fonts",
    "nuxt-qrcode",
    "nuxt-toast",
  ],

  tailwindcss: {
    config: {
      content: [
        "./components/**/*.{vue,js,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
      ],
      theme: {
        extend: {
          colors: {
            brand: {
              light: "#a7f3d0",
              DEFAULT: "#10b981",
              dark: "#065f46",
            },
            customBlue: "#1e40af",
            customGray: "#e5e7eb",
          },
        },
      },
    },
  },

  googleFonts: {
    families: {
      Cairo: true,
      "Sans+Serif": true,
      Roboto: true,
      "Open+Sans": true,
      Lato: true,
      Montserrat: true,
      Oswald: true,
      "Source+Sans+Pro": true,
      Raleway: true,
      Poppins: true,
      "Noto+Sans": true,
      Ubuntu: true,
      Merriweather: true,
      "PT+Sans": true,
      "Roboto+Condensed": true,
      "Playfair+Display": true,
      Nunito: true,
      Mukta: true,
      Inconsolata: true,
      Quicksand: true,
      "Fira+Sans": true,
      Assistant: true,
    },
    display: "swap",
  },

  qrcode: {
    options: {
      variant: {
        inner: "circle",
        marker: "rounded",
        pixel: "rounded",
      },
      radius: 1,
      blackColor: "currentColor",
      whiteColor: "transparent",
    },
  },

  build: {
    transpile: ["qrcode"],
  },

  app: {
    head: {
      title: "PorichoyID - Smart Badge & ID Card Studio",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Design and print high quality ID cards, event passes, and badges with QR codes in minutes." },
      ],
    },
  },

  vite: {
    server: {
      fs: {
        strict: false,
      },
    },
  },
});

