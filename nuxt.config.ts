// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  debug: true,
  devtools: { enabled: true },
  sourcemap: {
    server: true,
    client: true,
  },
  nitro: {
    preset: "node-server",
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },

  runtimeConfig: {
    public: {
      // apiBase: process.env.API_BASE_URL || "https://api.dressnio.com/api",
      apiBase: process.env.API_BASE_URL || "http://localhost:8000/api",
    },
  },

  extends: ["./modules/designbadge"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@vueuse/nuxt", // required
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-color-picker",
    "@nuxtjs/google-fonts",
    "nuxt-qrcode",
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
              DEFAULT: "#10b981", // You can use 'brand' directly
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
      // variant: "pixelated",
      // OR
      variant: {
        inner: "circle",
        marker: "rounded",
        pixel: "rounded",
      },
      radius: 1,
      blackColor: "currentColor", // 'var(--ui-text-highlighted)' if you are using `@nuxt/ui` v3
      whiteColor: "transparent", // 'var(--ui-bg)'
    },
  },

  build: {
    transpile: ["qrcode"],
  },

  // plugins: ["~/modules/plugins/page-builder.client.ts"],

  app: {
    head: {
      title: "Badge Design",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },

        // { hid: "description", name: "description", content: "" },
        // { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        // {
        //   rel: "stylesheet",
        //   href: "/css/style.css",
        // },
        // {
        //   rel: "stylesheet",
        //   href: "/css/font-awesome.css",
        // },
      ],
      script: [
        // {
        //   type: "text/javascript",
        //   src: "/js/script.js",
        // },
      ],
    },
  },

  // routeRules: {
  //   "/api/**": {
  //     cors: true,
  //   },
  // },

  vite: {
    server: {
      fs: {
        strict: false,
      },
    },
  },
});
