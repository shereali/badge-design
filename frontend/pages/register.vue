<template>
  <div class="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 mb-4">
          <Icon name="mdi:sparkles" class="text-3xl" />
        </NuxtLink>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Create Your Studio Account
        </h2>
        <p class="mt-2 text-sm text-slate-500">
          Start designing professional badges and IDs for free in seconds
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

      <form class="mt-8 space-y-5" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name / Organization
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Shere Ali"
              class="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
            />
          </div>

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
            <label for="password" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="8"
              placeholder="At least 8 characters"
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
              Creating account...
            </span>
            <span v-else>Register & Launch Studio</span>
          </button>
        </div>

        <div class="text-center text-sm text-slate-500">
          Already have an account?
          <NuxtLink to="/login" class="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
            Sign in
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

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.replace("/my-badge");
  }
});

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref("");

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = "";
  const result = await authStore.register(form.name, form.email, form.password);
  loading.value = false;

  if (result.success) {
    router.push("/my-badge");
  } else {
    errorMessage.value = result.error || "Registration failed.";
  }
};
</script>

