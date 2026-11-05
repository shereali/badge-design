<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/my-badge"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition"
          >
            <Icon name="mdi:arrow-left" class="text-base" />
            <span>Studio</span>
          </NuxtLink>
          <div>
            <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Account & Subscription</h1>
            <p class="text-xs text-slate-500">Manage your subscription plan, renewal, refunds, and profile settings.</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            v-if="authStore.isSuperAdmin"
            to="/admin"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
          >
            <Icon name="mdi:shield-crown-outline" class="text-base text-purple-600" />
            <span>Admin Panel</span>
          </NuxtLink>

          <button
            @click="authStore.logout"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition"
          >
            <Icon name="mdi:logout" class="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <Icon name="mdi:loading" class="text-3xl text-indigo-600 animate-spin mx-auto mb-2" />
        <p class="text-xs text-slate-500 font-semibold">Loading subscription details...</p>
      </div>

      <template v-else>
        <!-- Subscription Plan Banner & Countdown Card -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Plan Card -->
          <div class="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 backdrop-blur-md">
                  <span class="w-2 h-2 rounded-full" :class="subData?.is_expired ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'"></span>
                  {{ subData?.subscription_status || 'Active' }}
                </span>
                <span class="text-xs text-indigo-200 font-medium">Billing: {{ subData?.billing_cycle || 'monthly' }}</span>
              </div>

              <div class="mb-6">
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {{ subData?.plan_name || 'Starter Plan' }}
                </h2>
                <p class="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
                  Full access to professional badge creator, high-resolution exports, custom avatars, and QR codes.
                </p>
              </div>

              <!-- Days Remaining / Expiration Alert -->
              <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span class="text-[10px] text-indigo-300 uppercase font-bold tracking-wider block">Valid Until</span>
                  <span class="text-sm font-bold text-white">
                    {{ formatDate(subData?.subscription_ends_at) }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] text-indigo-300 uppercase font-bold tracking-wider block">Time Remaining</span>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <Icon name="mdi:clock-outline" class="text-base text-yellow-300" />
                    <span class="text-sm font-extrabold" :class="subData?.days_remaining <= 5 ? 'text-red-300' : 'text-yellow-300'">
                      {{ subData?.days_remaining }} Days Left
                    </span>
                  </div>
                </div>
                <div>
                  <span class="text-[10px] text-indigo-300 uppercase font-bold tracking-wider block">Badges Quota</span>
                  <span class="text-sm font-bold text-white">
                    {{ subData?.badge_count || 0 }} / {{ subData?.badge_limit || 25 }} Created
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons: Renew, Upgrade, Refund -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                @click="isRenewModalOpen = true"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-500 hover:bg-indigo-400 text-white shadow-md transition"
              >
                <Icon name="mdi:autorenew" class="text-base" />
                <span>Renew Subscription</span>
              </button>

              <button
                type="button"
                @click="isUpgradeModalOpen = true"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-indigo-900 hover:bg-indigo-50 shadow-md transition"
              >
                <Icon name="mdi:arrow-up-bold-circle-outline" class="text-base text-indigo-600" />
                <span>Upgrade Plan</span>
              </button>

              <button
                type="button"
                @click="isRefundModalOpen = true"
                class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-indigo-100 border border-white/20 transition ml-auto"
              >
                <Icon name="mdi:cash-refund" class="text-base" />
                <span>Request Refund</span>
              </button>
            </div>
          </div>

          <!-- Quick User Summary Card -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-extrabold text-2xl uppercase mb-4 shadow-md shadow-indigo-200">
                {{ authStore.user?.name ? authStore.user.name.charAt(0) : "U" }}
              </div>
              <h3 class="text-lg font-bold text-slate-900 leading-tight">
                {{ authStore.user?.name || "User" }}
              </h3>
              <p class="text-xs text-slate-500 mb-4">{{ authStore.user?.email || "" }}</p>

              <div class="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Account Role</span>
                  <span class="font-bold text-slate-800 uppercase px-2 py-0.5 rounded bg-slate-100">
                    {{ authStore.user?.role || 'user' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Member Since</span>
                  <span class="font-medium text-slate-700">
                    {{ formatDate(authStore.user?.created_at) }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">Money Back Guarantee</span>
                  <span class="font-bold text-emerald-600">7 Days Risk-Free</span>
                </div>
              </div>
            </div>

            <div class="pt-6 border-t border-slate-100 mt-4">
              <button
                type="button"
                @click="activeTab = 'profile'"
                class="w-full py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition text-center"
              >
                Edit Name & Password
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="flex border-b border-slate-200 bg-white px-4 rounded-2xl shadow-sm">
          <button
            type="button"
            @click="activeTab = 'overview'"
            class="py-3 px-4 text-xs font-bold border-b-2 transition"
            :class="activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            Available Plans & Compare
          </button>
          <button
            type="button"
            @click="activeTab = 'history'"
            class="py-3 px-4 text-xs font-bold border-b-2 transition"
            :class="activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            Billing & Invoices ({{ subData?.history?.length || 0 }})
          </button>
          <button
            type="button"
            @click="activeTab = 'refunds'"
            class="py-3 px-4 text-xs font-bold border-b-2 transition"
            :class="activeTab === 'refunds' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            Refund Requests ({{ subData?.refund_requests?.length || 0 }})
          </button>
          <button
            type="button"
            @click="activeTab = 'profile'"
            class="py-3 px-4 text-xs font-bold border-b-2 transition"
            :class="activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
          >
            Account Security
          </button>
        </div>

        <!-- Tab 1: Available Plans -->
        <div v-if="activeTab === 'overview'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="p in subData?.available_plans"
              :key="p.id"
              class="bg-white rounded-3xl p-6 border transition shadow-sm flex flex-col justify-between"
              :class="subData?.plan === p.id ? 'border-2 border-indigo-600 shadow-indigo-100 ring-2 ring-indigo-600/20' : 'border-slate-200 hover:border-slate-300'"
            >
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-bold text-slate-900">{{ p.name }}</h3>
                  <span v-if="subData?.plan === p.id" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase">
                    Current Plan
                  </span>
                </div>

                <div class="mb-4">
                  <span class="text-3xl font-extrabold text-slate-900">${{ p.price_monthly }}</span>
                  <span class="text-xs text-slate-400"> / month</span>
                  <div class="text-[11px] text-slate-500">or ${{ p.price_yearly }} / year (Save 20%)</div>
                </div>

                <ul class="space-y-2 text-xs text-slate-600 mb-6">
                  <li v-for="(feat, idx) in p.features" :key="idx" class="flex items-start gap-2">
                    <Icon name="mdi:check-circle" class="text-emerald-500 text-base flex-shrink-0 mt-0.5" />
                    <span>{{ feat }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <button
                  v-if="subData?.plan === p.id"
                  type="button"
                  @click="isRenewModalOpen = true"
                  class="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Renew Active Plan
                </button>
                <button
                  v-else
                  type="button"
                  @click="selectUpgradePlan(p.id)"
                  class="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-indigo-600 transition"
                >
                  Switch to {{ p.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Billing & Invoices History -->
        <div v-if="activeTab === 'history'" class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 class="text-base font-bold text-slate-900 mb-4">Subscription & Payment History</h3>
          <div v-if="!subData?.history?.length" class="py-8 text-center text-xs text-slate-400">
            No previous billing invoices recorded yet.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th class="p-3">Transaction ID</th>
                  <th class="p-3">Plan Name</th>
                  <th class="p-3">Cycle</th>
                  <th class="p-3">Amount</th>
                  <th class="p-3">Payment Method</th>
                  <th class="p-3">Date</th>
                  <th class="p-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="item in subData.history" :key="item.id" class="hover:bg-slate-50 transition">
                  <td class="p-3 font-mono font-bold text-slate-700">{{ item.transaction_id || item.id.substring(0, 8) }}</td>
                  <td class="p-3 font-semibold text-slate-900">{{ item.plan_name }}</td>
                  <td class="p-3 capitalize text-slate-600">{{ item.billing_cycle }}</td>
                  <td class="p-3 font-bold text-slate-900">${{ Number(item.price).toFixed(2) }}</td>
                  <td class="p-3 text-slate-600">{{ item.payment_method || 'Online Card / Mobile' }}</td>
                  <td class="p-3 text-slate-500">{{ formatDate(item.created_at) }}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="item.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'">
                      {{ item.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 3: Refund Requests History -->
        <div v-if="activeTab === 'refunds'" class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-slate-900">Refund Requests</h3>
              <p class="text-xs text-slate-500">All submitted refund tickets are reviewed within 24-48 business hours.</p>
            </div>
            <button
              type="button"
              @click="isRefundModalOpen = true"
              class="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Submit New Refund
            </button>
          </div>

          <div v-if="!subData?.refund_requests?.length" class="py-12 text-center text-xs text-slate-400">
            No refund requests submitted.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="ref in subData.refund_requests"
              :key="ref.id"
              class="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold text-slate-900">Requested Amount: ${{ Number(ref.amount).toFixed(2) }}</span>
                  <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-amber-100 text-amber-800': ref.status === 'pending',
                      'bg-emerald-100 text-emerald-800': ref.status === 'approved',
                      'bg-red-100 text-red-800': ref.status === 'rejected',
                    }"
                  >
                    {{ ref.status }}
                  </span>
                </div>
                <p class="text-xs text-slate-600">{{ ref.reason }}</p>
                <div v-if="ref.admin_notes" class="mt-2 text-xs text-indigo-700 bg-indigo-50 p-2 rounded-lg">
                  <span class="font-bold">Admin Response:</span> {{ ref.admin_notes }}
                </div>
              </div>
              <div class="text-[11px] text-slate-400 sm:text-right flex-shrink-0">
                Submitted on {{ formatDate(ref.created_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 4: Account Security Form -->
        <div v-if="activeTab === 'profile'" class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm max-w-2xl">
          <h3 class="text-base font-bold text-slate-900 mb-1">Edit Account Profile</h3>
          <p class="text-xs text-slate-500 mb-6">Update your display name, contact email, or security password.</p>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                v-model="profileForm.name"
                type="text"
                required
                class="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                v-model="profileForm.email"
                type="email"
                required
                class="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">New Password (leave empty to keep current)</label>
              <input
                v-model="profileForm.password"
                type="password"
                placeholder="••••••••"
                class="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <div v-if="profileForm.password">
              <label class="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
              <input
                v-model="profileForm.password_confirmation"
                type="password"
                placeholder="••••••••"
                class="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <div v-if="profileMessage" class="p-3 text-xs rounded-xl font-semibold" :class="profileSuccess ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'">
              {{ profileMessage }}
            </div>

            <button
              type="submit"
              :disabled="savingProfile"
              class="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-60"
            >
              <Icon v-if="savingProfile" name="mdi:loading" class="animate-spin text-sm mr-1" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      </template>
    </div>

    <!-- Renew Modal -->
    <div v-if="isRenewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-slate-900">Renew {{ subData?.plan_name }}</h3>
          <button @click="isRenewModalOpen = false" class="text-slate-400 hover:text-slate-600"><Icon name="mdi:close" class="text-xl" /></button>
        </div>

        <p class="text-xs text-slate-500 mb-4">
          Choose your renewal duration. Your expiration date will be extended from your current valid date.
        </p>

        <div class="space-y-3 mb-6">
          <label class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition" :class="renewCycle === 'monthly' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'">
            <div class="flex items-center gap-2">
              <input type="radio" value="monthly" v-model="renewCycle" class="text-indigo-600 focus:ring-indigo-500" />
              <div>
                <div class="text-xs font-bold text-slate-900">1 Month Extension</div>
                <div class="text-[11px] text-slate-500">+30 days validity</div>
              </div>
            </div>
            <span class="text-sm font-extrabold text-indigo-700">$19.00</span>
          </label>

          <label class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition" :class="renewCycle === 'yearly' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'">
            <div class="flex items-center gap-2">
              <input type="radio" value="yearly" v-model="renewCycle" class="text-indigo-600 focus:ring-indigo-500" />
              <div>
                <div class="text-xs font-bold text-slate-900">1 Year Extension (Best Value)</div>
                <div class="text-[11px] text-emerald-600 font-bold">+365 days validity (Save 20%)</div>
              </div>
            </div>
            <span class="text-sm font-extrabold text-indigo-700">$190.00</span>
          </label>
        </div>

        <button
          type="button"
          @click="confirmRenew"
          :disabled="actionLoading"
          class="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition disabled:opacity-60"
        >
          <Icon v-if="actionLoading" name="mdi:loading" class="animate-spin text-base mr-1" />
          <span>Confirm & Renew Plan</span>
        </button>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <div v-if="isUpgradeModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-slate-900">Upgrade Subscription Plan</h3>
          <button @click="isUpgradeModalOpen = false" class="text-slate-400 hover:text-slate-600"><Icon name="mdi:close" class="text-xl" /></button>
        </div>

        <p class="text-xs text-slate-500 mb-4">
          Select a higher tier to increase badge limits, unlock vector print PDF export, and priority themes.
        </p>

        <div class="space-y-3 mb-6">
          <label
            v-for="p in subData?.available_plans"
            :key="p.id"
            class="flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition"
            :class="selectedUpgradePlanId === p.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200'"
          >
            <div class="flex items-center gap-2.5">
              <input type="radio" :value="p.id" v-model="selectedUpgradePlanId" class="text-indigo-600 focus:ring-indigo-500" />
              <div>
                <div class="text-xs font-bold text-slate-900">{{ p.name }}</div>
                <div class="text-[11px] text-slate-500">{{ p.badge_limit }} badges quota • All themes</div>
              </div>
            </div>
            <span class="text-sm font-extrabold text-indigo-700">${{ p.price_monthly }}/mo</span>
          </label>
        </div>

        <button
          type="button"
          @click="confirmUpgrade"
          :disabled="actionLoading"
          class="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition disabled:opacity-60"
        >
          <Icon v-if="actionLoading" name="mdi:loading" class="animate-spin text-base mr-1" />
          <span>Confirm Plan Upgrade</span>
        </button>
      </div>
    </div>

    <!-- Refund Request Modal -->
    <div v-if="isRefundModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-slate-900">Request a Refund</h3>
          <button @click="isRefundModalOpen = false" class="text-slate-400 hover:text-slate-600"><Icon name="mdi:close" class="text-xl" /></button>
        </div>

        <div class="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 mb-4">
          <span class="font-bold">Refund Policy:</span> 100% money-back guarantee within 7 days of purchase. Please explain why you would like a refund.
        </div>

        <div class="space-y-3 mb-6">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Reason for Refund</label>
            <textarea
              v-model="refundReason"
              rows="4"
              placeholder="Please describe the issue or why you are requesting a refund..."
              class="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            ></textarea>
          </div>
        </div>

        <button
          type="button"
          @click="submitRefund"
          :disabled="actionLoading || !refundReason || refundReason.length < 10"
          class="w-full py-3 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-md transition disabled:opacity-50"
        >
          <Icon v-if="actionLoading" name="mdi:loading" class="animate-spin text-base mr-1" />
          <span>Submit Refund Ticket</span>
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

const loading = ref(true);
const subData = ref(null);
const activeTab = ref("overview");

// Modals
const isRenewModalOpen = ref(false);
const renewCycle = ref("monthly");
const isUpgradeModalOpen = ref(false);
const selectedUpgradePlanId = ref("pro");
const isRefundModalOpen = ref(false);
const refundReason = ref("");
const actionLoading = ref(false);

// Profile form
const savingProfile = ref(false);
const profileMessage = ref("");
const profileSuccess = ref(false);
const profileForm = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const fetchSubscription = async () => {
  loading.value = true;
  try {
    const data = await $fetch(`${apiBase}/subscription`, {
      headers: authStore.getAuthHeaders(),
    });
    subData.value = data;
    profileForm.name = data.user?.name || authStore.user?.name || "";
    profileForm.email = data.user?.email || authStore.user?.email || "";
  } catch (err) {
    console.error("Failed to load subscription:", err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Never / Ongoing";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const selectUpgradePlan = (planId) => {
  selectedUpgradePlanId.value = planId;
  isUpgradeModalOpen.value = true;
};

const confirmRenew = async () => {
  actionLoading.value = true;
  try {
    const res = await $fetch(`${apiBase}/subscription/renew`, {
      method: "POST",
      body: { billing_cycle: renewCycle.value },
      headers: authStore.getAuthHeaders(),
    });
    alert(res.message || "Subscription renewed successfully!");
    isRenewModalOpen.value = false;
    await fetchSubscription();
    await authStore.fetchUser();
  } catch (err) {
    alert(err?.data?.message || "Failed to renew subscription.");
  } finally {
    actionLoading.value = false;
  }
};

const confirmUpgrade = async () => {
  actionLoading.value = true;
  try {
    const res = await $fetch(`${apiBase}/subscription/upgrade`, {
      method: "POST",
      body: { plan: selectedUpgradePlanId.value },
      headers: authStore.getAuthHeaders(),
    });
    alert(res.message || "Plan upgraded successfully!");
    isUpgradeModalOpen.value = false;
    await fetchSubscription();
    await authStore.fetchUser();
  } catch (err) {
    alert(err?.data?.message || "Failed to upgrade plan.");
  } finally {
    actionLoading.value = false;
  }
};

const submitRefund = async () => {
  actionLoading.value = true;
  try {
    const res = await $fetch(`${apiBase}/subscription/refund`, {
      method: "POST",
      body: { reason: refundReason.value },
      headers: authStore.getAuthHeaders(),
    });
    alert(res.message || "Refund request submitted!");
    isRefundModalOpen.value = false;
    refundReason.value = "";
    activeTab.value = "refunds";
    await fetchSubscription();
  } catch (err) {
    alert(err?.data?.message || "Failed to submit refund request.");
  } finally {
    actionLoading.value = false;
  }
};

const updateProfile = async () => {
  savingProfile.value = true;
  profileMessage.value = "";
  try {
    const payload = {
      name: profileForm.name,
      email: profileForm.email,
    };
    if (profileForm.password) {
      if (profileForm.password !== profileForm.password_confirmation) {
        profileMessage.value = "Passwords do not match.";
        profileSuccess.value = false;
        savingProfile.value = false;
        return;
      }
      payload.password = profileForm.password;
      payload.password_confirmation = profileForm.password_confirmation;
    }

    const res = await $fetch(`${apiBase}/user`, {
      method: "PUT",
      body: payload,
      headers: authStore.getAuthHeaders(),
    });
    profileMessage.value = res.message || "Profile updated successfully!";
    profileSuccess.value = true;
    profileForm.password = "";
    profileForm.password_confirmation = "";
    await authStore.fetchUser();
  } catch (err) {
    profileMessage.value = err?.data?.message || "Failed to update profile.";
    profileSuccess.value = false;
  } finally {
    savingProfile.value = false;
  }
};

onMounted(() => {
  fetchSubscription();
});
</script>

