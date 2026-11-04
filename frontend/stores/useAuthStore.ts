import { defineStore } from "pinia";

interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export const useAuthStore = defineStore(
  "auth",
  () => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || "/api";

    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    const isAuthenticated = computed(() => !!token.value);

    const getAuthHeaders = () => {
      const headers: Record<string, string> = {
        Accept: "application/json",
      };
      if (token.value) {
        headers["Authorization"] = `Bearer ${token.value}`;
      }
      return headers;
    };

    const login = async (email: string, password: string) => {
      loading.value = true;
      error.value = null;
      try {
        const response: any = await $fetch(`${apiBase}/auth/login`, {
          method: "POST",
          body: { email, password },
          headers: { Accept: "application/json" },
        });

        token.value = response.token;
        user.value = response.user;
        return { success: true };
      } catch (err: any) {
        const msg =
          err?.data?.message ||
          (err?.data?.errors
            ? Object.values(err.data.errors).flat().join(" ")
            : "Login failed. Check your credentials.");
        error.value = msg;
        return { success: false, error: msg };
      } finally {
        loading.value = false;
      }
    };

    const register = async (name: string, email: string, password: string) => {
      loading.value = true;
      error.value = null;
      try {
        const response: any = await $fetch(`${apiBase}/auth/register`, {
          method: "POST",
          body: { name, email, password },
          headers: { Accept: "application/json" },
        });

        token.value = response.token;
        user.value = response.user;
        return { success: true };
      } catch (err: any) {
        const msg =
          err?.data?.message ||
          (err?.data?.errors
            ? Object.values(err.data.errors).flat().join(" ")
            : "Registration failed.");
        error.value = msg;
        return { success: false, error: msg };
      } finally {
        loading.value = false;
      }
    };

    const fetchUser = async () => {
      if (!token.value) return null;
      try {
        const data: any = await $fetch(`${apiBase}/user`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        user.value = data;
        return data;
      } catch (err) {
        token.value = null;
        user.value = null;
        return null;
      }
    };

    const logout = async () => {
      if (token.value) {
        try {
          await $fetch(`${apiBase}/auth/logout`, {
            method: "POST",
            headers: getAuthHeaders(),
          });
        } catch (e) {
          // ignore
        }
      }
      token.value = null;
      user.value = null;
      navigateTo("/login");
    };

    return {
      user,
      token,
      loading,
      error,
      isAuthenticated,
      getAuthHeaders,
      login,
      register,
      fetchUser,
      logout,
    };
  },
  {
    persist: true,
  }
);
