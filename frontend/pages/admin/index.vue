<template>
  <div class="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Admin Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-200">
            <Icon name="mdi:shield-crown-outline" class="text-2xl" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Super Admin Console</h1>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700">Master Access</span>
            </div>
            <p class="text-xs text-slate-500">Manage all registered users, subscription plans, platform revenue, and refund tickets.</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/my-badge"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition"
          >
            <Icon name="mdi:cards-outline" class="text-base" />
            <span>Studio</span>
          </NuxtLink>

          <NuxtLink
            to="/profile"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition"
          >
            <Icon name="mdi:account-cog-outline" class="text-base" />
            <span>My Profile</span>
          </NuxtLink>

          <button
            @click="authStore.logout"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition"
          >
            <Icon name="mdi:logout" class="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <!-- KPI Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:account-group-outline" class="text-2xl" />
          </div>
          <div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
            <span class="text-2xl font-extrabold text-slate-900">{{ statsData?.stats?.total_users || 0 }}</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:check-decagram-outline" class="text-2xl" />
          </div>
          <div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Subscriptions</span>
            <span class="text-2xl font-extrabold text-slate-900">{{ statsData?.stats?.active_subscriptions || 0 }}</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:badge-account-outline" class="text-2xl" />
          </div>
          <div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Badges Created</span>
            <span class="text-2xl font-extrabold text-slate-900">{{ statsData?.stats?.total_badges || 0 }}</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Icon name="mdi:cash-multiple" class="text-2xl" />
          </div>
          <div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Platform Revenue</span>
            <span class="text-2xl font-extrabold text-slate-900">${{ Number(statsData?.stats?.total_revenue || 0).toFixed(2) }}</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :class="statsData?.stats?.pending_refunds > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'">
            <Icon name="mdi:cash-refund" class="text-2xl" />
          </div>
          <div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Refunds</span>
            <span class="text-2xl font-extrabold" :class="statsData?.stats?.pending_refunds > 0 ? 'text-red-600' : 'text-slate-900'">
              {{ statsData?.stats?.pending_refunds || 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-200 bg-white px-4 rounded-2xl shadow-sm overflow-x-auto">
        <button
          type="button"
          @click="adminTab = 'users'"
          class="py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap"
          :class="adminTab === 'users' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Icon name="mdi:account-multiple" class="text-base" />
          <span>Users & Subscriptions</span>
        </button>

        <button
          type="button"
          @click="adminTab = 'refunds'"
          class="py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap"
          :class="adminTab === 'refunds' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Icon name="mdi:cash-refund" class="text-base" />
          <span>Refund Requests</span>
          <span v-if="statsData?.stats?.pending_refunds > 0" class="w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <button
          type="button"
          @click="adminTab = 'subscriptions'"
          class="py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap"
          :class="adminTab === 'subscriptions' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Icon name="mdi:receipt-text-outline" class="text-base" />
          <span>Subscription Logs</span>
        </button>

        <button
          type="button"
          @click="adminTab = 'badges'"
          class="py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap"
          :class="adminTab === 'badges' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Icon name="mdi:cards-outline" class="text-base" />
          <span>All Platform Badges</span>
        </button>
      </div>

      <!-- Tab 1: Users & Subscriptions Management -->
      <div v-if="adminTab === 'users'" class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-slate-900">User Management</h2>
            <p class="text-xs text-slate-500">Manage user accounts, roles, subscription limits, and expiration.</p>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="searchQuery"
              @input="fetchUsers"
              type="text"
              placeholder="Search user by name or email..."
              class="text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-400 w-64"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th class="p-3">User</th>
                <th class="p-3">Role</th>
                <th class="p-3">Current Plan</th>
                <th class="p-3">Status</th>
                <th class="p-3">Valid Until</th>
                <th class="p-3">Badges Created</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="u in usersList" :key="u.id" class="hover:bg-slate-50 transition">
                <td class="p-3">
                  <div class="font-bold text-slate-900">{{ u.name }}</div>
                  <div class="text-[11px] text-slate-400">{{ u.email }}</div>
                </td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                    :class="u.role === 'super_admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ u.role || 'user' }}
                  </span>
                </td>
                <td class="p-3">
                  <span class="font-bold text-slate-800">{{ u.plan_name || 'Starter Plan' }}</span>
                  <div class="text-[10px] text-slate-400">Limit: {{ u.badge_limit || 25 }}</div>
                </td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                    :class="u.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700'"
                  >
                    {{ u.subscription_status || 'active' }}
                  </span>
                </td>
                <td class="p-3 text-slate-600">
                  {{ formatDate(u.subscription_ends_at) }}
                </td>
                <td class="p-3 font-bold text-slate-800">
                  {{ u.badges_count || 0 }} / {{ u.badge_limit || 25 }}
                </td>
                <td class="p-3 text-right space-x-1.5 whitespace-nowrap">
                  <button
                    type="button"
                    @click="openEditUser(u)"
                    class="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                  >
                    Manage
                  </button>
                  <button
                    v-if="u.id !== authStore.user?.id"
                    type="button"
                    @click="deleteUser(u.id)"
                    class="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                    title="Delete user"
                  >
                    <Icon name="mdi:delete-outline" class="text-base" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 2: Refund Requests Management -->
      <div v-if="adminTab === 'refunds'" class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h2 class="text-base font-bold text-slate-900">Refund Requests</h2>
          <p class="text-xs text-slate-500">Review refund tickets submitted by subscribers.</p>
        </div>

        <div v-if="!refundsList.length" class="py-12 text-center text-xs text-slate-400">
          No refund requests pending review.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="r in refundsList"
            :key="r.id"
            class="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-slate-900">{{ r.user?.name }} ({{ r.user?.email }})</span>
                <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  :class="{
                    'bg-amber-100 text-amber-800': r.status === 'pending',
                    'bg-emerald-100 text-emerald-800': r.status === 'approved',
                    'bg-red-100 text-red-800': r.status === 'rejected',
                  }"
                >
                  {{ r.status }}
                </span>
                <span class="text-xs font-extrabold text-slate-900 ml-2">Amount: ${{ Number(r.amount).toFixed(2) }}</span>
              </div>
              <p class="text-xs text-slate-600 italic">"{{ r.reason }}"</p>
              <div v-if="r.admin_notes" class="mt-2 text-xs text-slate-500">
                <span class="font-bold">Admin Notes:</span> {{ r.admin_notes }}
              </div>
            </div>

            <div v-if="r.status === 'pending'" class="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                @click="updateRefund(r.id, 'approved')"
                class="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              >
                Approve Refund
              </button>
              <button
                type="button"
                @click="updateRefund(r.id, 'rejected')"
                class="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Subscriptions Logs -->
      <div v-if="adminTab === 'subscriptions'" class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h2 class="text-base font-bold text-slate-900">Platform Subscription Logs</h2>
          <p class="text-xs text-slate-500">Audit trail of all upgrades, renewals, and payments.</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th class="p-3">Transaction ID</th>
                <th class="p-3">User</th>
                <th class="p-3">Plan</th>
                <th class="p-3">Cycle</th>
                <th class="p-3">Price</th>
                <th class="p-3">Method</th>
                <th class="p-3">Date</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="s in subscriptionsList" :key="s.id" class="hover:bg-slate-50 transition">
                <td class="p-3 font-mono font-bold text-slate-700">{{ s.transaction_id || s.id.substring(0, 8) }}</td>
                <td class="p-3 font-semibold text-slate-900">{{ s.user?.name || s.user?.email || 'User' }}</td>
                <td class="p-3 font-bold text-slate-800">{{ s.plan_name }}</td>
                <td class="p-3 capitalize text-slate-600">{{ s.billing_cycle }}</td>
                <td class="p-3 font-bold text-slate-900">${{ Number(s.price).toFixed(2) }}</td>
                <td class="p-3 text-slate-600">{{ s.payment_method }}</td>
                <td class="p-3 text-slate-500">{{ formatDate(s.created_at) }}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                    {{ s.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 4: All Platform Badges -->
      <div v-if="adminTab === 'badges'" class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h2 class="text-base font-bold text-slate-900">All Created Badges</h2>
          <p class="text-xs text-slate-500">Monitor all designs and cards generated by platform users.</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th class="p-3">Badge Title</th>
                <th class="p-3">Created By</th>
                <th class="p-3">Size / Orientation</th>
                <th class="p-3">Elements Count</th>
                <th class="p-3">Created Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="b in badgesList" :key="b.id" class="hover:bg-slate-50 transition">
                <td class="p-3 font-bold text-slate-900">{{ b.title || 'Untitled Badge' }}</td>
                <td class="p-3 text-slate-600">{{ b.user?.name || b.user?.email || 'User' }}</td>
                <td class="p-3 capitalize text-slate-600">{{ b.orientation || 'portrait' }} ({{ b.size || 'A6' }})</td>
                <td class="p-3 font-semibold text-slate-700">{{ (b.front_elements?.length || 0) + (b.back_elements?.length || 0) }} Elements</td>
                <td class="p-3 text-slate-500">{{ formatDate(b.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="isEditUserModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-slate-900">Manage {{ editingUser?.name }}</h3>
          <button @click="isEditUserModalOpen = false" class="text-slate-400 hover:text-slate-600"><Icon name="mdi:close" class="text-xl" /></button>
        </div>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">User Role</label>
            <select v-model="editUserForm.role" class="w-full text-xs p-2.5 rounded-xl border border-slate-300">
              <option value="user">Regular User</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Subscription Plan</label>
            <select v-model="editUserForm.plan" class="w-full text-xs p-2.5 rounded-xl border border-slate-300">
              <option value="starter">Starter Plan (25 badges)</option>
              <option value="pro">Professional Pass (100 badges)</option>
              <option value="enterprise">Enterprise Studio (500 badges)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Subscription Status</label>
            <select v-model="editUserForm.subscription_status" class="w-full text-xs p-2.5 rounded-xl border border-slate-300">
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Extend Validity (Days)</label>
            <input
              v-model.number="editUserForm.days_to_add"
              type="number"
              placeholder="e.g. 30, 90, 365"
              class="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Badge Creation Limit</label>
            <input
              v-model.number="editUserForm.badge_limit"
              type="number"
              class="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <button
          type="button"
          @click="saveUserChanges"
          class="w-full py-3 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-md transition"
        >
          Save User Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/useAuthStore";
import { onMounted, reactive, ref } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBase || "/api";
const authStore = useAuthStore();

const adminTab = ref("users");
const statsData = ref(null);
const usersList = ref([]);
const subscriptionsList = ref([]);
const refundsList = ref([]);
const badgesList = ref([]);
const searchQuery = ref("");

// User Edit Modal
const isEditUserModalOpen = ref(false);
const editingUser = ref(null);
const editUserForm = reactive({
  role: "user",
  plan: "starter",
  subscription_status: "active",
  badge_limit: 25,
  days_to_add: 0,
});

const formatDate = (dateString) => {
  if (!dateString) return "None";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const fetchStats = async () => {
  try {
    statsData.value = await $fetch(`${apiBase}/admin/stats`, {
      headers: authStore.getAuthHeaders(),
    });
  } catch (err) {
    if (err?.status === 403) {
      alert("Access Denied: Super Admin only.");
      navigateTo("/my-badge");
    }
  }
};

const fetchUsers = async () => {
  try {
    const res = await $fetch(`${apiBase}/admin/users?search=${encodeURIComponent(searchQuery.value)}`, {
      headers: authStore.getAuthHeaders(),
    });
    usersList.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
};

const fetchRefunds = async () => {
  try {
    const res = await $fetch(`${apiBase}/admin/refunds`, {
      headers: authStore.getAuthHeaders(),
    });
    refundsList.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
};

const fetchSubscriptions = async () => {
  try {
    const res = await $fetch(`${apiBase}/admin/subscriptions`, {
      headers: authStore.getAuthHeaders(),
    });
    subscriptionsList.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
};

const fetchBadges = async () => {
  try {
    const res = await $fetch(`${apiBase}/admin/badges`, {
      headers: authStore.getAuthHeaders(),
    });
    badgesList.value = res.data || [];
  } catch (err) {
    console.error(err);
  }
};

const openEditUser = (user) => {
  editingUser.value = user;
  editUserForm.role = user.role || "user";
  editUserForm.plan = user.plan || "starter";
  editUserForm.subscription_status = user.subscription_status || "active";
  editUserForm.badge_limit = user.badge_limit || 25;
  editUserForm.days_to_add = 0;
  isEditUserModalOpen.value = true;
};

const saveUserChanges = async () => {
  if (!editingUser.value) return;
  try {
    await $fetch(`${apiBase}/admin/users/${editingUser.value.id}`, {
      method: "PUT",
      body: editUserForm,
      headers: authStore.getAuthHeaders(),
    });
    alert("User updated successfully!");
    isEditUserModalOpen.value = false;
    await fetchUsers();
    await fetchStats();
  } catch (err) {
    alert(err?.data?.message || "Failed to update user.");
  }
};

const deleteUser = async (userId) => {
  if (!confirm("Are you sure you want to permanently delete this user?")) return;
  try {
    await $fetch(`${apiBase}/admin/users/${userId}`, {
      method: "DELETE",
      headers: authStore.getAuthHeaders(),
    });
    alert("User deleted!");
    await fetchUsers();
    await fetchStats();
  } catch (err) {
    alert(err?.data?.message || "Failed to delete user.");
  }
};

const updateRefund = async (refundId, status) => {
  const notes = prompt(`Enter optional admin notes for marking as ${status}:`, "");
  try {
    await $fetch(`${apiBase}/admin/refunds/${refundId}/status`, {
      method: "POST",
      body: { status, admin_notes: notes },
      headers: authStore.getAuthHeaders(),
    });
    alert(`Refund marked as ${status}`);
    await fetchRefunds();
    await fetchStats();
  } catch (err) {
    alert(err?.data?.message || "Failed to update refund.");
  }
};

onMounted(async () => {
  if (!authStore.isSuperAdmin) {
    alert("Unauthorized: Super Admin access required.");
    navigateTo("/my-badge");
    return;
  }
  await fetchStats();
  await fetchUsers();
  await fetchRefunds();
  await fetchSubscriptions();
  await fetchBadges();
});
</script>
