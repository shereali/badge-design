<template>
  <div class="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
      <div class="text-center">
        <NuxtLink to="/" class="inline-block mb-3">
          <Logo size="lg" />
        </NuxtLink>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Welcome back
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Sign in to your PorichoyID studio to manage and design your badges
        </p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="errorMessage"
        class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2"
      >
        <Icon name="mdi:alert-circle" class="text-xl flex-shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="you@company.com"
              class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="password" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-200 disabled:opacity-60 transition"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <Icon name="mdi:loading" class="animate-spin text-lg" />
              Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
        </div>

        <div class="text-center text-sm text-slate-500">
          Don't have an account yet?
          <NuxtLink to="/register" class="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
            Create account free
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const router = useRouter();

// If already logged in, redirect to studio
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.replace("/my-badge");
  }
});

const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = "";
  const result = await authStore.login(form.email, form.password);
  loading.value = false;

  if (result.success) {
    router.push("/my-badge");
  } else {
    errorMessage.value = result.error || "Login failed.";
  }
};
</script>

