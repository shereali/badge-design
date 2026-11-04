<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
    <Navbar v-if="!hideNavbar" />
    <main class="flex-1 w-full flex flex-col">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const hideNavbar = computed(() => {
  return route.path.includes("/page-builder");
});
</script>
