<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <!-- Brand Logo -->
        <div class="flex items-center space-x-3">
          <NuxtLink to="/">
            <Logo size="md" />
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
        <div class="flex items-center space-x-2 sm:space-x-3">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/my-badge"
              class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <Icon name="mdi:view-dashboard-outline" class="text-base" />
              <span>Studio</span>
            </NuxtLink>

            <!-- User Profile & Subscription Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button
                @click="isUserMenuOpen = !isUserMenuOpen"
                type="button"
                class="flex items-center space-x-2 p-1.5 sm:px-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition border border-transparent hover:border-slate-200"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {{ authStore.user?.name ? authStore.user.name.charAt(0) : "U" }}
                </div>
                <div class="hidden md:flex flex-col text-left">
                  <span class="text-xs font-bold text-slate-900 leading-tight">
                    {{ authStore.user?.name || "User" }}
                  </span>
                  <span class="text-[10px] text-indigo-600 font-semibold uppercase">
                    {{ authStore.user?.plan_name || "Starter Plan" }}
                  </span>
                </div>
                <Icon name="mdi:chevron-down" class="text-sm text-slate-400" />
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1"
              >
                <div class="p-2.5 bg-slate-50 rounded-xl mb-1">
                  <p class="text-xs font-bold text-slate-900 truncate">
                    {{ authStore.user?.name || "User" }}
                  </p>
                  <p class="text-[11px] text-slate-500 truncate mb-1">
                    {{ authStore.user?.email || "" }}
                  </p>
                  <div class="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span class="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md uppercase">
                      {{ authStore.user?.plan_name || "Starter Plan" }}
                    </span>
                    <span class="text-[10px] text-slate-400 font-medium capitalize">
                      {{ authStore.user?.subscription_status || "Active" }}
                    </span>
                  </div>
                </div>

                <NuxtLink
                  to="/profile"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                >
                  <Icon name="mdi:account-cog-outline" class="text-lg text-indigo-500" />
                  <div>
                    <div class="leading-tight">Profile & Subscription</div>
                    <span class="text-[10px] text-slate-400 font-normal">Plan expiry, renew & refund</span>
                  </div>
                </NuxtLink>

                <NuxtLink
                  to="/my-badge"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                >
                  <Icon name="mdi:cards-outline" class="text-lg text-blue-500" />
                  <div>
                    <div class="leading-tight">My Badges</div>
                    <span class="text-[10px] text-slate-400 font-normal">Manage saved designs</span>
                  </div>
                </NuxtLink>

                <!-- Super Admin Menu Link -->
                <NuxtLink
                  v-if="authStore.isSuperAdmin"
                  to="/admin"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 rounded-xl transition border border-purple-100"
                >
                  <Icon name="mdi:shield-crown-outline" class="text-lg text-purple-600" />
                  <div>
                    <div class="leading-tight">Super Admin Panel</div>
                    <span class="text-[10px] text-purple-500 font-normal">Manage all users & subscriptions</span>
                  </div>
                </NuxtLink>

                <div class="border-t border-slate-100 my-1"></div>

                <button
                  type="button"
                  @click="handleLogout"
                  class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition text-left"
                >
                  <Icon name="mdi:logout" class="text-lg" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            <!-- Direct 1-Click Logout Button -->
            <button
              @click="handleLogout"
              title="Logout"
              class="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition border border-slate-200 hover:border-red-200"
            >
              <Icon name="mdi:logout" class="text-base" />
              <span>Logout</span>
            </button>
          </template>

          <template v-else>
            <NuxtLink
              to="/login"
              class="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-300 hover:shadow transition"
            >
              Start Free
            </NuxtLink>
          </template>

          <!-- Mobile Hamburger Toggle -->
          <button
            @click="isMobileNavOpen = !isMobileNavOpen"
            type="button"
            class="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            <Icon :name="isMobileNavOpen ? 'mdi:close' : 'mdi:menu'" class="text-2xl" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Slide-Down Menu -->
    <div
      v-if="isMobileNavOpen"
      class="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg"
    >
      <NuxtLink
        to="/#features"
        @click="isMobileNavOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Features
      </NuxtLink>
      <NuxtLink
        to="/#templates"
        @click="isMobileNavOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Templates
      </NuxtLink>
      <NuxtLink
        to="/#pricing"
        @click="isMobileNavOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Pricing
      </NuxtLink>

      <template v-if="authStore.isAuthenticated">
        <NuxtLink
          to="/my-badge"
          @click="isMobileNavOpen = false"
          class="block px-3 py-2 rounded-lg text-sm font-bold text-indigo-600 bg-indigo-50"
        >
          My Badges Studio
        </NuxtLink>
        <NuxtLink
          to="/profile"
          @click="isMobileNavOpen = false"
          class="block px-3 py-2 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-100"
        >
          Profile & Subscription
        </NuxtLink>
        <NuxtLink
          v-if="authStore.isSuperAdmin"
          to="/admin"
          @click="isMobileNavOpen = false"
          class="block px-3 py-2 rounded-lg text-sm font-bold text-purple-700 bg-purple-50"
        >
          Super Admin Panel
        </NuxtLink>
        <button
          @click="handleLogout"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <Icon name="mdi:logout" class="text-lg" />
          <span>Log Out</span>
        </button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { onMounted, onUnmounted, ref } from "vue";

const authStore = useAuthStore();
const isUserMenuOpen = ref(false);
const isMobileNavOpen = ref(false);
const dropdownRef = ref(null);

const handleLogout = async () => {
  isUserMenuOpen.value = false;
  isMobileNavOpen.value = false;
  await authStore.logout();
};

if (process.client) {
  onMounted(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        isUserMenuOpen.value = false;
      }
    };
    window.addEventListener("click", handleClickOutside);
    onUnmounted(() => {
      window.removeEventListener("click", handleClickOutside);
    });
  });
}
</script>
