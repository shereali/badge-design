<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-800">
    <!-- Clean, Focused Left Sidebar (No extra bloated event menus) -->
    <aside class="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between hidden md:flex">
      <div>
        <!-- Studio Logo -->
        <div class="p-6 border-b border-slate-100 flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Icon name="mdi:badge-account-outline" class="text-xl" />
          </div>
          <div>
            <h1 class="text-base font-bold text-slate-900 leading-tight">PorichoyID</h1>
            <span class="text-[11px] text-slate-400 font-medium">Badge & ID Studio</span>
          </div>
        </div>

        <!-- Clean Navigation Menu -->
        <nav class="p-4 space-y-1">
          <button
            @click="activeNav = 'badges'"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition"
            :class="activeNav === 'badges' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
          >
            <Icon name="mdi:cards-outline" class="text-lg" />
            <span>My Badges</span>
            <span class="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" :class="activeNav === 'badges' ? 'bg-indigo-200/60 text-indigo-800' : 'bg-slate-100 text-slate-500'">
              {{ badges.length }}
            </span>
          </button>

          <NuxtLink
            to="/profile"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Icon name="mdi:account-cog-outline" class="text-lg text-indigo-500" />
            <span>Profile & Plan</span>
            <span class="ml-auto text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {{ authStore.user?.plan || 'Plan' }}
            </span>
          </NuxtLink>

          <NuxtLink
            v-if="authStore.isSuperAdmin"
            to="/admin"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-purple-700 bg-purple-50/60 hover:bg-purple-100 transition border border-purple-100"
          >
            <Icon name="mdi:shield-crown-outline" class="text-lg text-purple-600" />
            <span>Super Admin</span>
          </NuxtLink>

          <NuxtLink
            to="/#templates"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Icon name="mdi:view-grid-plus-outline" class="text-lg" />
            <span>Templates</span>
          </NuxtLink>

          <NuxtLink
            to="/"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Icon name="mdi:home-outline" class="text-lg" />
            <span>Back to Home</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- User Account & Logout in Sidebar Footer -->
      <div class="p-4 border-t border-slate-100 bg-slate-50/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center uppercase flex-shrink-0">
              {{ authStore.user?.name ? authStore.user.name.charAt(0) : "U" }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-800 truncate leading-tight">
                {{ authStore.user?.name || "User" }}
              </p>
              <p class="text-[10px] text-slate-400 truncate">
                {{ authStore.user?.email || "" }}
              </p>
            </div>
          </div>
          <button
            @click="authStore.logout"
            title="Logout"
            class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <Icon name="mdi:logout" class="text-lg" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <!-- Top Action Bar -->
      <header class="bg-white border-b border-slate-200/80 px-6 py-5 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-20">
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Badges
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your saved designs, print passes, or create new cards.
          </p>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <!-- Mobile Profile & Logout -->
          <NuxtLink
            to="/profile"
            class="md:hidden inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
          >
            <Icon name="mdi:account-cog-outline" class="text-base text-indigo-600" />
            <span>Profile</span>
          </NuxtLink>

          <NuxtLink
            v-if="authStore.isSuperAdmin"
            to="/admin"
            class="md:hidden inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
          >
            <Icon name="mdi:shield-crown-outline" class="text-base" />
            <span>Admin</span>
          </NuxtLink>

          <button
            @click="authStore.logout"
            class="md:hidden inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition"
          >
            <Icon name="mdi:logout" class="text-base" />
            <span>Logout</span>
          </button>

          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-300 hover:shadow transition-all"
          >
            <Icon name="mdi:plus" class="text-lg" />
            <span>Create New Badge</span>
          </button>
        </div>
      </header>

      <!-- Badges List Section -->
      <div class="p-6 sm:p-8 flex-1">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="h-64 rounded-2xl bg-white border border-slate-200 p-4 animate-pulse">
            <div class="w-full h-36 bg-slate-200 rounded-xl mb-4"></div>
            <div class="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!badges.length"
          class="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-2xl border-2 border-dashed border-slate-200"
        >
          <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-4">
            <Icon name="mdi:badge-account-horizontal-outline" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">
            No badges created yet
          </h3>
          <p class="text-sm text-slate-500 max-w-sm mb-6">
            Get started by creating your first event pass, conference badge, or corporate employee identity card.
          </p>
          <button
            @click="openCreateModal"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition"
          >
            <Icon name="mdi:plus" class="text-lg" />
            <span>Create Your First Badge</span>
          </button>
        </div>

        <!-- Badges Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="badge in badges"
            :key="badge.id"
            class="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between overflow-hidden group"
          >
            <!-- Badge Card Visual Mockup -->
            <div class="p-5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-center min-h-[170px]">
              <div
                class="bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex flex-col justify-between transition-transform group-hover:scale-105"
                :class="badge.orientation === 'landscape' ? 'w-44 h-28' : 'w-28 h-40'"
              >
                <!-- Punch Hole -->
                <div class="w-5 h-1 bg-slate-300 rounded-full mx-auto"></div>

                <!-- Center Icon / Badge Info -->
                <div class="text-center my-auto">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-indigo-600 block truncate">
                    {{ badge.badge_type || "Attendee" }}
                  </span>
                  <span class="text-xs font-bold text-slate-800 line-clamp-1">
                    {{ badge.title }}
                  </span>
                </div>

                <!-- Bottom QR Icon -->
                <div class="flex justify-between items-center text-slate-400 text-[10px]">
                  <span>{{ badge.size_preset || "A6" }}</span>
                  <Icon name="mdi:qrcode" class="text-base text-slate-700" />
                </div>
              </div>
            </div>

            <!-- Badge Details -->
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <h4 class="font-bold text-slate-900 text-sm truncate" :title="badge.title">
                    {{ badge.title }}
                  </h4>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 flex-shrink-0">
                    {{ badge.badge_type || "Pass" }}
                  </span>
                </div>
                <p class="text-xs text-slate-400">
                  Size: {{ badge.size_preset }} ({{ badge.width }}×{{ badge.height }}{{ badge.unit || 'mm' }})
                </p>
                <p class="text-[11px] text-slate-400 mt-1">
                  Updated: {{ formatDate(badge.updated_at) }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <NuxtLink
                  :to="`/my-badge/page-builder?id=${badge.id}`"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
                >
                  <Icon name="mdi:draw" class="text-base" />
                  <span>Design Badge</span>
                </NuxtLink>

                <div class="flex items-center gap-1">
                  <button
                    @click="duplicateBadge(badge.id)"
                    title="Duplicate Badge"
                    class="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                  >
                    <Icon name="mdi:content-copy" class="text-base" />
                  </button>
                  <button
                    @click="confirmDeleteBadge(badge)"
                    title="Delete Badge"
                    class="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    <Icon name="mdi:trash-can-outline" class="text-base" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Badge Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Create New Badge</h3>
            <p class="text-xs text-slate-500">Configure layout and launch the designer</p>
          </div>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <Icon name="mdi:close" class="text-xl" />
          </button>
        </div>

        <form @submit.prevent="createAndDesignBadge" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Badge Title</label>
            <input
              v-model="createForm.title"
              type="text"
              required
              placeholder="e.g. Annual Summit Delegate Pass"
              class="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Badge Category</label>
              <select
                v-model="createForm.badge_type"
                class="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Attendee">Attendee</option>
                <option value="VIP Pass">VIP Pass</option>
                <option value="Speaker">Speaker</option>
                <option value="Staff">Staff</option>
                <option value="Exhibitor">Exhibitor</option>
                <option value="Student ID">Student ID</option>
                <option value="Employee">Employee ID</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Access Level</label>
              <select
                v-model="createForm.access_level"
                class="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="General">General</option>
                <option value="All Access">All Access</option>
                <option value="VIP Access">VIP Access</option>
                <option value="Backstage">Backstage</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Size Preset</label>
              <select
                v-model="createForm.size_preset"
                class="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="A6">A6 Standard (105×148 mm)</option>
                <option value="A7">A7 Compact (74×105 mm)</option>
                <option value="A4">A4 Full Sheet (210×297 mm)</option>
                <option value="CR80">CR80 Card (85.6×54 mm)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Orientation</label>
              <select
                v-model="createForm.orientation"
                class="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="portrait">Portrait (Vertical)</option>
                <option value="landscape">Landscape (Horizontal)</option>
              </select>
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition disabled:opacity-60"
            >
              <Icon v-if="submitting" name="mdi:loading" class="animate-spin text-base" />
              <span>Create & Open Designer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/useAuthStore";

const authStore = useAuthStore();
const router = useRouter();
const config = useRuntimeConfig();
const apiBase = config.public.apiBase || "/api";
const toast = useToast();

const activeNav = ref("badges");
const badges = ref([]);
const loading = ref(true);
const showModal = ref(false);
const submitting = ref(false);

const createForm = reactive({
  title: "",
  badge_type: "Attendee",
  access_level: "General",
  size_preset: "A6",
  orientation: "portrait",
});

// Route protection check
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.replace("/login");
    return;
  }
  fetchBadges();
});

const fetchBadges = async () => {
  loading.value = true;
  try {
    const response = await $fetch(`${apiBase}/badges`, {
      headers: authStore.getAuthHeaders(),
    });
    if (response && response.data) {
      badges.value = response.data;
    }
  } catch (err) {
    console.error("Failed to load badges:", err);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  createForm.title = "";
  createForm.badge_type = "Attendee";
  createForm.access_level = "General";
  createForm.size_preset = "A6";
  createForm.orientation = "portrait";
  showModal.value = true;
};

// Create badge in Laravel backend and navigate to designer
const createAndDesignBadge = async () => {
  submitting.value = true;
  try {
    let width = 105;
    let height = 148;
    if (createForm.size_preset === "A7") {
      width = 74;
      height = 105;
    } else if (createForm.size_preset === "A4") {
      width = 210;
      height = 297;
    } else if (createForm.size_preset === "CR80") {
      width = 85.6;
      height = 54;
    }

    if (createForm.orientation === "landscape") {
      const temp = width;
      width = height;
      height = temp;
    }

    const payload = {
      title: createForm.title || `${createForm.badge_type} Badge`,
      badge_type: createForm.badge_type,
      access_level: createForm.access_level,
      size_preset: createForm.size_preset,
      orientation: createForm.orientation,
      width: width,
      height: height,
      page_config: {
        badgeSizePreset: createForm.size_preset,
        badgeSize: createForm.size_preset,
        badgeOrientation: createForm.orientation,
        customWidth: width,
        customHeight: height,
      },
    };

    const response = await $fetch(`${apiBase}/badges`, {
      method: "POST",
      headers: authStore.getAuthHeaders(),
      body: payload,
    });

    showModal.value = false;
    toast.success({
      title: "Badge Created",
      message: "Launching designer...",
      position: "topRight",
    });

    if (response && response.data && response.data.id) {
      router.push(`/my-badge/page-builder?id=${response.data.id}`);
    }
  } catch (err) {
    console.error("Failed to create badge:", err);
    toast.error({
      title: "Error",
      message: "Could not create badge. Try again.",
      position: "topRight",
    });
  } finally {
    submitting.value = false;
  }
};

const duplicateBadge = async (badgeId) => {
  try {
    await $fetch(`${apiBase}/badges/${badgeId}/duplicate`, {
      method: "POST",
      headers: authStore.getAuthHeaders(),
    });
    toast.success({
      title: "Duplicated",
      message: "Badge duplicated successfully.",
      position: "topRight",
    });
    fetchBadges();
  } catch (err) {
    toast.error({
      title: "Error",
      message: "Failed to duplicate badge.",
      position: "topRight",
    });
  }
};

const confirmDeleteBadge = async (badge) => {
  if (confirm(`Are you sure you want to delete "${badge.title}"?`)) {
    try {
      await $fetch(`${apiBase}/badges/${badge.id}`, {
        method: "DELETE",
        headers: authStore.getAuthHeaders(),
      });
      badges.value = badges.value.filter((b) => b.id !== badge.id);
      toast.success({
        title: "Deleted",
        message: "Badge removed.",
        position: "topRight",
      });
    } catch (err) {
      toast.error({
        title: "Error",
        message: "Could not delete badge.",
        position: "topRight",
      });
    }
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>
