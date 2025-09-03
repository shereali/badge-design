<template>
  <nav class="bg-gray-900 text-white shadow-lg w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <a href="/" class="flex items-center space-x-2">
            <img
              src="https://admin.expouse.com/bcknd/src/assets/img/EXPOUSE-LOGO2.svg"
              alt="Logo"
              class="object-cover"
            />
            <!-- <span class="text-xl font-semibold">Expouse - Badge</span> -->
          </a>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <!-- <a
            href="/design-badge"
            class="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >Home</a
          >
          <a
            href="/design-badge/page-builder"
            class="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >Page Builder</a
          >
          <a
            href="/schedule"
            class="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >Schedule</a
          >
          <a
            href="/design-page"
            class="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >Dashboard</a
          > -->
        </div>

        <!-- User Profile
        <div class="hidden md:flex items-center space-x-4">
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-2 focus:outline-none"
            >
              <img
                src="/assets/img/profile.jpg"
                alt="User Avatar"
                class="w-8 h-8 rounded-full border border-gray-600"
              />
              <span class="text-sm font-medium">User</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-xl z-10"
            >
              <a
                href="/profile"
                class="block px-4 py-2 hover:bg-gray-100 text-sm"
                >My Profile</a
              >
              <a
                href="/settings"
                class="block px-4 py-2 hover:bg-gray-100 text-sm"
                >Settings</a
              >
              <a
                href="/logout"
                class="block px-4 py-2 hover:bg-gray-100 text-sm"
                >Logout</a
              >
            </div>
          </div>
        </div> -->

        <!-- Mobile Menu Button -->
        <!-- <div class="md:hidden">
          <button @click="toggleMobileMenu" class="focus:outline-none p-2">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div> -->
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <!-- <div
      v-if="isMobileMenuOpen"
      class="md:hidden bg-gray-800 border-t border-gray-700"
    >
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a
          href="/home"
          class="block hover:bg-gray-600 px-3 py-2 rounded-md text-base font-medium"
          >Home</a
        >
        <a
          href="/events"
          class="block hover:bg-gray-600 px-3 py-2 rounded-md text-base font-medium"
          >Events</a
        >
        <a
          href="/schedule"
          class="block hover:bg-gray-600 px-3 py-2 rounded-md text-base font-medium"
          >Schedule</a
        >
        <a
          href="/dashboard"
          class="block hover:bg-gray-600 px-3 py-2 rounded-md text-base font-medium"
          >Dashboard</a
        >
        <a
          href="/profile"
          class="block hover:bg-gray-600 px-3 py-2 rounded-md text-base font-medium"
          >My Profile</a
        >
        <a
          href="/settings"
          class="block hover:bg-gray-600 px-3 py-2 rounded-md text-base font-medium"
          >Settings</a
        >
        <a
          href="/logout"
          class="block hover:bg-gray-600 px-3 py-2 rounded-md text-base font-medium"
          >Logout</a
        >
      </div>
    </div> -->
  </nav>
</template>

<script setup>
import { ref } from "vue";

const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) isDropdownOpen.value = false; // Close dropdown when mobile menu opens
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) isMobileMenuOpen.value = false; // Close mobile menu when dropdown opens
};
</script>

<style scoped>
/* Ensure dropdown closes when clicking outside */
button:focus {
  outline: none;
}
</style>
