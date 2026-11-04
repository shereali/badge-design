<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <!-- Brand Logo -->
        <div class="flex items-center space-x-3">
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Icon name="mdi:badge-account-outline" class="text-2xl" />
            </div>
            <div>
              <span class="text-xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                Porichoy<span class="text-indigo-600">ID</span>
              </span>
              <span class="hidden sm:block text-[10px] font-semibold text-gray-500 uppercase tracking-widest -mt-1">
                Badge Studio
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink
            to="/#features"
            class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Features
          </NuxtLink>
          <NuxtLink
            to="/#templates"
            class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Templates
          </NuxtLink>
          <NuxtLink
            to="/#how-it-works"
            class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            How it works
          </NuxtLink>
          <NuxtLink
            to="/#pricing"
            class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Pricing
          </NuxtLink>
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/my-badge"
            class="text-sm font-medium text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            My Badges
          </NuxtLink>
        </nav>

        <!-- Right Side CTA / Auth -->
        <div class="flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/my-badge"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <Icon name="mdi:view-dashboard-outline" class="text-lg" />
              <span>Studio</span>
            </NuxtLink>

            <div class="relative group">
              <button
                class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {{ authStore.user?.name ? authStore.user.name.charAt(0) : "U" }}
                </div>
                <span class="hidden lg:inline text-sm font-medium text-gray-800">
                  {{ authStore.user?.name || "User" }}
                </span>
              </button>
            </div>

            <button
              @click="authStore.logout"
              title="Logout"
              class="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Icon name="mdi:logout" class="text-xl" />
            </button>
          </template>

          <template v-else>
            <NuxtLink
              to="/login"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-300 hover:shadow-md transition-all"
            >
              Start Free
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
</script>
