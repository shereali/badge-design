// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    "@vueuse/nuxt",
    "@pinia/nuxt", // required
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-color-picker",
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
