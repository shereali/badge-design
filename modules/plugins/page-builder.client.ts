import { defineNuxtPlugin } from "#app";
import PageBuilder from "@myissue/vue-website-page-builder";
import "@myissue/vue-website-page-builder/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PageBuilder);
});
