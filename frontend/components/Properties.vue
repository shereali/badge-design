<template>
  <div class="space-y-2">
    <div v-if="!store.selectedElement" class="p-3.5 space-y-3.5">
      <!-- Empty State Card -->
      <div class="bg-gradient-to-b from-indigo-50/60 to-slate-50 border border-indigo-100 rounded-2xl p-5 text-center shadow-sm">
        <div class="relative w-12 h-12 mx-auto mb-3 flex items-center justify-center">
          <div class="absolute inset-0 bg-indigo-500/10 rounded-2xl rotate-6 transition-transform"></div>
          <div class="relative w-11 h-11 bg-white rounded-xl shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Icon name="mdi:cursor-default-click-outline" class="text-2xl" />
          </div>
        </div>
        <h4 class="text-sm font-bold text-slate-800 mb-1">No Element Selected</h4>
        <p class="text-xs text-slate-500 leading-relaxed max-w-[220px] mx-auto">
          Click any element on the badge canvas to customize its typography, colors, size, and alignment.
        </p>
      </div>

      <!-- Quick Canvas Element Selector (if badge has elements) -->
      <div v-if="store.boxes && store.boxes.length > 0" class="space-y-2">
        <div class="flex items-center justify-between px-1">
          <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Current Side Elements
          </span>
          <span class="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            {{ store.boxes.length }} items
          </span>
        </div>
        <div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            v-for="box in store.boxes"
            :key="box.id"
            type="button"
            @click="selectElementFromEmptyState(box.id)"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 shadow-sm transition group cursor-pointer"
          >
            <div class="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center flex-shrink-0 transition">
              <Icon :name="getElementBadgeIcon(box.type)" class="text-sm" />
            </div>
            <div class="flex-1 truncate">
              <div class="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 truncate transition">
                {{ getElementShortLabel(box) }}
              </div>
              <div class="text-[10px] text-slate-400 capitalize">
                {{ box.type === 'avatar' ? 'Photo' : box.type === 'qrcode' ? 'QR Code' : 'Text' }} &bull; (x: {{ Math.round(box.position?.left || 0) }}, y: {{ Math.round(box.position?.top || 0) }})
              </div>
            </div>
            <Icon name="mdi:chevron-right" class="text-slate-300 group-hover:text-indigo-500 transition text-sm" />
          </button>
        </div>
      </div>

      <!-- Pro Tips & Keyboard Shortcuts -->
      <div class="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
        <div class="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Icon name="mdi:lightbulb-on-outline" class="text-amber-500 text-sm" />
          <span>Quick Canvas Tips</span>
        </div>
        <ul class="text-[11px] text-slate-500 space-y-1.5">
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
            <span><strong class="text-slate-700">Double click</strong> text to edit inline on canvas</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
            <span><kbd class="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700 font-mono">Ctrl+Z</kbd> Undo / <kbd class="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700 font-mono">Ctrl+Y</kbd> Redo</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
            <span>Drag element handles to resize or rotate</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
            <span>Center snap guidelines appear during drag</span>
          </li>
        </ul>
      </div>
    </div>

    <template v-else>
      <!-- Alignment Section -->
      <div class="bg-white p-3 border-b border-gray-200">
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Canvas Alignment</div>
        <div class="grid grid-cols-6 gap-1">
          <!-- Align Left -->
          <button
            type="button"
            @click="store.alignHorizontal('left')"
            class="flex items-center justify-center p-2 rounded hover:bg-slate-100 transition"
            :class="{
              'bg-indigo-100 text-indigo-700 font-bold': store.currentProperties.textAlign === 'left' || store.currentProperties.horizontalAlign === 'left',
              'text-slate-600': store.currentProperties.textAlign !== 'left' && store.currentProperties.horizontalAlign !== 'left',
            }"
            title="Align Left (Canvas)"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h2v16H4V4zm7 4v3h10v2H11v3l-4-4 4-4z" />
            </svg>
          </button>

          <!-- Align Center -->
          <button
            type="button"
            @click="store.alignHorizontal('center')"
            class="flex items-center justify-center p-2 rounded hover:bg-slate-100 transition"
            :class="{
              'bg-indigo-100 text-indigo-700 font-bold': store.currentProperties.textAlign === 'center' || store.currentProperties.horizontalAlign === 'center',
              'text-slate-600': store.currentProperties.textAlign !== 'center' && store.currentProperties.horizontalAlign !== 'center',
            }"
            title="Align Center (Canvas)"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 16v-3h4v-2h-4V8l-4 4 4 4zM5 8v3H1v2h4v3l4-4-4-4zm6 12h2V4h-2v16z" />
            </svg>
          </button>

          <!-- Align Right -->
          <button
            type="button"
            @click="store.alignHorizontal('right')"
            class="flex items-center justify-center p-2 rounded hover:bg-slate-100 transition"
            :class="{
              'bg-indigo-100 text-indigo-700 font-bold': store.currentProperties.textAlign === 'right' || store.currentProperties.horizontalAlign === 'right',
              'text-slate-600': store.currentProperties.textAlign !== 'right' && store.currentProperties.horizontalAlign !== 'right',
            }"
            title="Align Right (Canvas)"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 8v3H3v2h10v3l4-4-4-4zm5-4h2v16h-2V4z" />
            </svg>
          </button>

          <!-- Align Top -->
          <button
            type="button"
            @click="store.alignVertical('top')"
            class="flex items-center justify-center p-2 rounded hover:bg-slate-100 transition"
            :class="{
              'bg-indigo-100 text-indigo-700 font-bold': store.currentProperties.verticalAlign === 'top',
              'text-slate-600': store.currentProperties.verticalAlign !== 'top',
            }"
            title="Align Top (Canvas)"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z" />
            </svg>
          </button>

          <!-- Align Middle -->
          <button
            type="button"
            @click="store.alignVertical('middle')"
            class="flex items-center justify-center p-2 rounded hover:bg-slate-100 transition"
            :class="{
              'bg-indigo-100 text-indigo-700 font-bold': store.currentProperties.verticalAlign === 'middle',
              'text-slate-600': store.currentProperties.verticalAlign !== 'middle',
            }"
            title="Align Middle (Canvas)"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 19h3v4h2v-4h3l-4-4-4 4zm8-14h-3V1h-2v4H8l4 4 4-4zM4 11v2h16v-2H4z" />
            </svg>
          </button>

          <!-- Align Bottom -->
          <button
            type="button"
            @click="store.alignVertical('bottom')"
            class="flex items-center justify-center p-2 rounded hover:bg-slate-100 transition"
            :class="{
              'bg-indigo-100 text-indigo-700 font-bold': store.currentProperties.verticalAlign === 'bottom',
              'text-slate-600': store.currentProperties.verticalAlign !== 'bottom',
            }"
            title="Align Bottom (Canvas)"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Geometry Section -->
      <div class="bg-white p-3 border-b border-gray-200 shadow-sm">
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleSection('geometry')"
        >
          <div class="flex items-center">
            <Icon name="mdi:vector-square" class="text-xl p-1 text-gray-600" />
            <span class="font-semibold text-gray-700">Geometry</span>
          </div>
          <Icon
            :name="
              openSections.geometry ? 'mdi:chevron-up' : 'mdi:chevron-down'
            "
            class="text-gray-600"
          />
        </div>

        <div v-show="openSections.geometry" class="mt-3 grid grid-cols-2 gap-3">
          <!-- X -->
          <div class="border rounded flex items-center">
            <span class="p-1 bg-gray-200 text-gray-700 w-8 text-center">X</span>
            <input
              type="number"
              v-model.number="store.currentProperties.x"
              class="w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-r"
              @input="store.updateProperties(store.currentProperties)"
            />
          </div>
          <!-- Y -->
          <div class="border rounded flex items-center">
            <span class="p-1 bg-gray-200 text-gray-700 w-8 text-center">Y</span>
            <input
              type="number"
              v-model.number="store.currentProperties.y"
              class="w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-r"
              @input="store.updateProperties(store.currentProperties)"
            />
          </div>
          <!-- W -->
          <div class="border rounded flex items-center">
            <span class="p-1 bg-gray-200 text-gray-700 w-8 text-center">W</span>
            <input
              type="number"
              v-model.number="store.currentProperties.size.width"
              class="w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-r"
              @input="store.updateProperties(store.currentProperties)"
            />
          </div>
          <!-- H -->
          <div class="border rounded flex items-center">
            <span class="p-1 bg-gray-200 text-gray-700 w-8 text-center">H</span>
            <input
              type="number"
              v-model.number="store.currentProperties.size.height"
              class="w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-r"
              @input="store.updateProperties(store.currentProperties)"
            />
          </div>
          <!-- Rotation -->
          <div class="border rounded flex items-center">
            <span class="p-1 bg-gray-200 text-gray-700 w-8 text-center flex items-center justify-center font-bold text-xs" title="Rotation Angle">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
            </span>
            <input
              type="number"
              v-model.number="store.currentProperties.rotation"
              class="w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-r"
              @input="store.updateProperties(store.currentProperties)"
            />
          </div>
        </div>
      </div>

      <!-- Avatar Section -->
      <div
        v-if="store.selectedElementType === 'avatar'"
        class="bg-white p-3 border-b border-gray-200 shadow-sm"
      >
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleSection('avatar')"
        >
          <div class="flex items-center">
            <Icon name="mdi:account-circle-outline" class="text-xl p-1 text-gray-600" />
            <span class="font-semibold text-gray-700">Photo / Avatar</span>
          </div>
          <Icon
            :name="openSections.avatar ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            class="text-gray-600"
          />
        </div>

        <div v-show="openSections.avatar" class="mt-3 space-y-3">
          <!-- Photo Upload & Preview -->
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-full border border-slate-300 overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center shadow-inner">
                <img
                  v-if="store.currentProperties.avatar?.avatar_src"
                  :src="store.currentProperties.avatar.avatar_src"
                  class="w-full h-full object-cover"
                />
                <Icon v-else name="mdi:account" class="text-3xl text-slate-400" />
              </div>

              <div class="flex-1 space-y-1">
                <input
                  type="file"
                  ref="avatarFileInput"
                  class="hidden"
                  accept="image/*"
                  @change="handleAvatarFileUpload"
                />
                <button
                  type="button"
                  @click="avatarFileInput?.click()"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                >
                  <Icon name="mdi:cloud-upload-outline" class="text-sm" />
                  <span>Upload Photo</span>
                </button>
                <p class="text-[10px] text-slate-500">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>

            <!-- Avatar URL direct input -->
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Image URL</label>
              <input
                type="text"
                :value="store.currentProperties.avatar?.avatar_src"
                @input="store.setAvatarImage($event.target.value)"
                placeholder="https://example.com/avatar.jpg"
                class="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <!-- Quick Preset Avatars -->
            <div>
              <span class="block text-[10px] font-semibold text-slate-500 uppercase mb-1">Sample Avatars</span>
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  v-for="(src, idx) in presetAvatars"
                  :key="idx"
                  type="button"
                  @click="store.setAvatarImage(src)"
                  class="w-7 h-7 rounded-full border border-slate-300 overflow-hidden hover:scale-110 transition flex-shrink-0"
                >
                  <img :src="src" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>
          </div>

          <!-- Size Control -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-slate-700">Size (px)</label>
              <div class="flex items-center border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50">
                <input
                  type="number"
                  min="30"
                  max="400"
                  v-model.number="store.avatarSize"
                  class="w-12 text-xs font-semibold text-right bg-transparent focus:outline-none"
                  @input="store.syncAvatarToCurrent"
                />
                <span class="text-[10px] text-slate-400 ml-1">px</span>
              </div>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              v-model.number="store.avatarSize"
              class="w-full accent-indigo-600 cursor-pointer"
              @input="store.syncAvatarToCurrent"
            />
          </div>

          <!-- Border Radius (Point 6 Redesigned) -->
          <div
            class="p-3 bg-white border border-slate-200 rounded-xl space-y-2"
            v-if="
              store.avatarShape === 'rounded' ||
              store.avatarShape === 'squircle' ||
              store.avatarShape === 'custom'
            "
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <Icon name="mdi:rounded-corner" class="text-indigo-600 text-base" />
                <label class="text-xs font-semibold text-slate-700">Border Radius</label>
              </div>
              <div class="flex items-center border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50">
                <input
                  type="number"
                  min="0"
                  max="150"
                  v-model.number="store.avatarRadius"
                  class="w-10 text-xs font-semibold text-right bg-transparent focus:outline-none"
                  @input="store.syncAvatarToCurrent"
                />
                <span class="text-[10px] text-slate-400 ml-1">px</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              v-model.number="store.avatarRadius"
              class="w-full accent-indigo-600 cursor-pointer"
              @input="store.syncAvatarToCurrent"
            />
            <div class="flex items-center gap-1 pt-1">
              <button
                type="button"
                @click="store.avatarRadius = 0; store.syncAvatarToCurrent()"
                class="flex-1 py-1 text-[10px] font-semibold rounded border border-slate-200 hover:bg-slate-100 transition"
              >
                0px (Square)
              </button>
              <button
                type="button"
                @click="store.avatarRadius = 12; store.syncAvatarToCurrent()"
                class="flex-1 py-1 text-[10px] font-semibold rounded border border-slate-200 hover:bg-slate-100 transition"
              >
                12px
              </button>
              <button
                type="button"
                @click="store.avatarRadius = 24; store.syncAvatarToCurrent()"
                class="flex-1 py-1 text-[10px] font-semibold rounded border border-slate-200 hover:bg-slate-100 transition"
              >
                24px
              </button>
              <button
                type="button"
                @click="store.avatarRadius = 9999; store.syncAvatarToCurrent()"
                class="flex-1 py-1 text-[10px] font-semibold rounded border border-slate-200 hover:bg-slate-100 transition"
              >
                Pill
              </button>
            </div>
          </div>

          <!-- Shape Selection -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
            <label class="block text-xs font-semibold text-slate-700">Shape</label>
            <select
              v-model="store.avatarShape"
              class="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              @change="store.syncAvatarToCurrent"
            >
              <option value="circle">Circle (Round)</option>
              <option value="rounded">Rounded Square</option>
              <option value="squircle">Squircle</option>
              <option value="diamond">Diamond</option>
              <option value="hex">Hexagon</option>
              <option value="triangle">Triangle</option>
              <option value="blob">Organic Blob</option>
              <option value="custom">Custom (clip-path)</option>
            </select>

            <div v-if="store.avatarShape === 'custom'" class="mt-2">
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">CSS clip-path</label>
              <input
                v-model="store.avatarCustomClipPath"
                placeholder="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
                class="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs focus:outline-none"
                @input="store.syncAvatarToCurrent"
              />
            </div>
          </div>

          <!-- Border & Ring Toggles -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl grid grid-cols-2 gap-3 items-center">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                v-model="store.avatarShowBorder"
                class="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                @change="store.syncAvatarToCurrent"
              />
              <span>Outer Border</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                v-model="store.avatarShowRing"
                class="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                @change="store.syncAvatarToCurrent"
              />
              <span>Accent Ring</span>
            </label>
          </div>
        </div>
      </div>
      <!-- QR Code Section -->
      <div
        v-if="store.selectedElementType === 'qrcode'"
        class="bg-white p-3 border shadow-sm"
      >
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleSection('qrcode')"
        >
          <div class="flex items-center">
            <Icon name="mdi:qrcode" class="text-xl p-1 text-gray-600" />
            <span class="font-semibold text-gray-700">QR Code</span>
          </div>
          <Icon
            :name="openSections.qrcode ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            class="text-gray-600"
          />
        </div>

        <div v-show="openSections.qrcode" class="mt-3 space-y-4">
          <!-- QR Code Content / Value (Point 4 Fix) -->
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-semibold text-slate-700">QR Value / Target</label>
              <span class="text-[10px] text-indigo-600 font-mono">Live Sync</span>
            </div>
            <textarea
              v-model="store.currentProperties.qrcode.value"
              rows="3"
              class="w-full text-xs font-mono p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white"
              placeholder="e.g. https://porichoyid.softcredible.com or Attendee ID"
              @input="store.updateProperties(store.currentProperties)"
            ></textarea>
            <div class="flex flex-wrap gap-1">
              <button
                type="button"
                @click="store.currentProperties.qrcode.value = 'https://porichoyid.softcredible.com'; store.updateProperties(store.currentProperties)"
                class="text-[10px] bg-white hover:bg-indigo-50 hover:text-indigo-600 px-2 py-0.5 rounded border border-slate-200 font-medium transition"
              >
                Website URL
              </button>
              <button
                type="button"
                @click="store.currentProperties.qrcode.value = 'PID-' + Math.floor(100000 + Math.random() * 900000); store.updateProperties(store.currentProperties)"
                class="text-[10px] bg-white hover:bg-indigo-50 hover:text-indigo-600 px-2 py-0.5 rounded border border-slate-200 font-medium transition"
              >
                ID Code
              </button>
              <button
                type="button"
                @click="store.currentProperties.qrcode.value = 'MECARD:N:John Doe;ORG:SoftCredible;TEL:+8801700000000;;'; store.updateProperties(store.currentProperties)"
                class="text-[10px] bg-white hover:bg-indigo-50 hover:text-indigo-600 px-2 py-0.5 rounded border border-slate-200 font-medium transition"
              >
                vCard Contact
              </button>
            </div>
          </div>

          <!-- Variant Dropdown -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
            <label class="block text-xs font-semibold text-slate-700">Style Pattern</label>
            <select
              v-model="store.currentProperties.qrcode.variant"
              class="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              @change="store.updateProperties(store.currentProperties)"
            >
              <option value="pixelated">Pixelated (Crisp Modern)</option>
              <option value="circle">Circles</option>
              <option value="dots">Dots</option>
              <option value="rounded">Rounded</option>
              <option value="default">Default</option>
            </select>
          </div>

          <!-- QR Colors -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl space-y-3">
            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-1">QR Modules Color</span>
              <div class="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                <input
                  type="color"
                  v-model="store.currentProperties.qrcode.blackColor"
                  class="w-8 h-8 p-0 border-none cursor-pointer"
                  @input="store.updateProperties(store.currentProperties)"
                />
                <input
                  type="text"
                  v-model="store.currentProperties.qrcode.blackColor"
                  class="w-full px-2 py-1 text-xs border-l border-slate-200 bg-white font-mono focus:outline-none"
                  placeholder="#000000"
                  @input="store.updateProperties(store.currentProperties)"
                />
              </div>
            </div>

            <div>
              <span class="block text-xs font-semibold text-slate-700 mb-1">Background Color</span>
              <div class="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                <input
                  type="color"
                  v-model="store.currentProperties.qrcode.whiteColor"
                  class="w-8 h-8 p-0 border-none cursor-pointer"
                  @input="store.updateProperties(store.currentProperties)"
                />
                <input
                  type="text"
                  v-model="store.currentProperties.qrcode.whiteColor"
                  class="w-full px-2 py-1 text-xs border-l border-slate-200 bg-white font-mono focus:outline-none"
                  placeholder="transparent or #ffffff"
                  @input="store.updateProperties(store.currentProperties)"
                />
                <button
                  type="button"
                  class="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border-l border-slate-200 flex items-center gap-1"
                  @click="store.currentProperties.qrcode.whiteColor = 'transparent'; store.updateProperties(store.currentProperties)"
                  title="Make Background Transparent"
                >
                  <Icon name="mdi:circle-off-outline" class="text-sm" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Border Radius (Point 6 Redesigned) -->
          <div class="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <Icon name="mdi:rounded-corner" class="text-indigo-600 text-base" />
                <label class="text-xs font-semibold text-slate-700">QR Corner Radius</label>
              </div>
              <div class="flex items-center border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50">
                <input
                  type="number"
                  min="0"
                  max="10"
                  v-model.number="store.currentProperties.qrcode.radius"
                  class="w-8 text-xs font-semibold text-right bg-transparent focus:outline-none"
                  @input="store.updateProperties(store.currentProperties)"
                />
                <span class="text-[10px] text-slate-400 ml-1">px</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              v-model.number="store.currentProperties.qrcode.radius"
              class="w-full accent-indigo-600 cursor-pointer"
              @input="store.updateProperties(store.currentProperties)"
            />
          </div>
        </div>
      </div>

      <!-- Image Section: object position imagePosition -->
      <div
        v-if="
          store.selectedElementType === 'background' ||
          store.selectedElementType === 'img'
        "
        class="bg-white p-3 border-b border-gray-200 shadow-sm"
      >
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleSection('objectPosition')"
        >
          <div class="flex items-center">
            <Icon
              name="fluent-mdl2:picture-position"
              class="text-xl p-1 text-gray-600"
            />
            <span class="font-semibold text-gray-700">Object Position</span>
          </div>
          <Icon
            :name="
              openSections.objectPosition
                ? 'mdi:chevron-up'
                : 'mdi:chevron-down'
            "
            class="text-gray-600"
          />
        </div>
        <div v-show="openSections.objectPosition" class="mt-3">
          <!-- 3x3 Grid of Icons -->
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="position in positions"
              :key="position"
              @click="
                store.currentProperties.imagePosition = position;
                store.updateProperties(store.currentProperties);
              "
              :class="[
                'p-2 rounded flex items-center justify-center transition-all duration-200',
                store.currentProperties.imagePosition === position
                  ? 'bg-blue-200 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
              :title="formatPositionName(position)"
            >
              <Icon
                v-if="position !== 'center'"
                :name="`mdi:arrow-${position}`"
                class="text-lg"
              />
              <Icon v-else name="line-md:arrow-align-center" class="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <!-- Object Fit -->
      <div
        v-if="
          store.selectedElementType === 'background' ||
          store.selectedElementType === 'img'
        "
        class="bg-white p-3 border-b border-gray-200 shadow-sm"
      >
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleSection('objectFitPosition')"
        >
          <div class="flex items-center">
            <Icon
              name="carbon:fit-to-screen"
              class="text-xl p-1 text-gray-600"
            />
            <span class="font-semibold text-gray-700">Object Fit</span>
          </div>
          <Icon
            :name="
              openSections.objectFitPosition
                ? 'mdi:chevron-up'
                : 'mdi:chevron-down'
            "
            class="text-gray-600"
          />
        </div>
        <div v-show="openSections.objectFitPosition" class="mt-3">
          <!-- 1x5 Grid of Icons -->
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="fit in fits"
              :key="fit"
              @click="
                store.currentProperties.objectFit = fit;
                store.updateProperties(store.currentProperties);
              "
              :class="[
                'p-2 rounded flex items-center justify-center transition-all duration-200',
                store.currentProperties.objectFit === fit
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
              :title="formatFitName(fit)"
            >
              <Icon :name="fitIconName(fit)" class="text-lg" />
            </button>
          </div>
        </div>
      </div>
      <!-- Text Specific Properties -->

      <template
        v-if="
          store.selectedElementType === 'h1' ||
          store.selectedElementType === 'p' ||
          store.selectedElementType === 'rectangle'
        "
      >
        <!-- Font Section -->
        <div
          v-if="store.selectedElementType !== 'rectangle'"
          class="bg-white p-3 border-b border-gray-200"
        >
          <div
            class="flex items-center justify-between cursor-pointer"
            @click="toggleSection('font')"
          >
            <div class="flex items-center">
              <Icon
                name="mdi:format-font"
                class="text-xl p-1 text-gray-600"
                aria-hidden="true"
              />
              <span class="font-semibold text-gray-700">Font Settings</span>
            </div>
            <Icon
              :name="openSections.font ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="text-gray-600"
            />
          </div>

          <div v-show="openSections.font" class="mt-2">
            <!-- Font Selector Dropdown -->
            <div class="relative mb-3">
              <label class="block mb-1 text-sm font-medium text-gray-600"
                >Font</label
              >
              <div
                @click="toggleDropdown"
                class="border rounded p-2 cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-blue-300"
              >
                <span :style="{ fontFamily: store.currentProperties.font }">
                  {{ getFontName(store.currentProperties.font) }}
                </span>
                <svg
                  :class="{ 'transform rotate-180': store.dropdownOpen }"
                  class="w-4 h-4 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div
                v-show="store.dropdownOpen"
                class="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto"
              >
                <div class="sticky top-0 bg-white z-10 border-b">
                  <input
                    type="text"
                    v-model="fontSearch"
                    placeholder="Search font..."
                    class="p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <ul>
                  <li
                    v-for="font in filteredFonts"
                    :key="font.value"
                    @click="selectFont(font.value)"
                    class="p-2 cursor-pointer hover:bg-blue-100"
                    :style="{ fontFamily: font.value }"
                  >
                    {{ font.name }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Font Size Selector -->
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-600"
                >Font Size</label
              >
              <select
                v-model="store.currentProperties.fontSize"
                @change="store.updateProperties(store.currentProperties)"
                class="border p-2 w-full rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                <option value="auto">Auto</option>
                <option v-for="size in fontSizes" :key="size" :value="size">
                  {{ size }} px
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Color Section -->
        <div class="bg-white p-3 border-b border-gray-200">
          <div
            class="flex items-center justify-between cursor-pointer"
            @click="toggleSection('color')"
          >
            <div class="flex items-center">
              <Icon
                name="mdi:palette"
                class="text-xl p-1 text-gray-600"
                aria-hidden="true"
              />
              <span class="font-semibold text-gray-700">Color</span>
            </div>
            <Icon
              :name="openSections.color ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="text-gray-600"
            />
          </div>

          <div v-show="openSections.color" class="mt-2 space-y-2">
            <!-- Fill Color -->
            <div class="flex items-center gap-3">
              <div class="w-full">
                <span class="block text-sm font-medium text-gray-600"
                  >Fill Color</span
                >
                <div class="flex items-center border rounded overflow-hidden">
                  <input
                    type="color"
                    v-model="store.currentProperties.fillColor"
                    class="w-8 h-8 p-0 border-none cursor-pointer"
                    @input="updateFillColor"
                  />
                  <input
                    type="text"
                    v-model="store.currentProperties.fillColor"
                    class="w-full px-2 py-1 border-l text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="#000000"
                  />
                  <button
                    class="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    @click="store.makeTransparent('fillColor')"
                  >
                    <Icon
                      name="streamline-plump:transparent"
                      class="text-xl text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- Text Color -->
            <div
              v-if="store.selectedElementType !== 'rectangle'"
              class="flex items-center gap-3"
            >
              <div class="w-full">
                <span class="block text-sm font-medium text-gray-600"
                  >Text Color</span
                >
                <div class="flex items-center border rounded overflow-hidden">
                  <input
                    type="color"
                    v-model="store.currentProperties.color"
                    class="w-8 h-8 p-0 border-none cursor-pointer"
                    @input="store.updateProperties(store.currentProperties)"
                  />
                  <input
                    type="text"
                    v-model="store.currentProperties.color"
                    class="w-full px-2 py-1 border-l text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="#000000"
                  />
                  <button
                    class="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    @click="store.makeTransparent('color')"
                  >
                    <Icon
                      name="streamline-plump:transparent"
                      class="text-xl text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Text Alignment Section -->
        <div
          v-if="store.selectedElementType !== 'rectangle'"
          class="bg-white p-3 border-b border-gray-200"
        >
          <div
            class="flex items-center justify-between cursor-pointer"
            @click="toggleSection('textAlignment')"
          >
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/>
              </svg>
              <span class="font-semibold text-gray-700">Text Alignment</span>
            </div>
            <svg
              class="w-4 h-4 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': openSections.textAlignment }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          <div v-show="openSections.textAlignment" class="mt-3">
            <div class="grid grid-cols-6 gap-1.5">
              <!-- Text Align Left -->
              <button
                type="button"
                @click="store.applyTextAlign('left')"
                title="Align Text Left"
                class="flex items-center justify-center p-2 rounded border transition"
                :class="
                  store.currentProperties.textAlign === 'left'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 15h18v-2H3v2zm0 4h12v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"/>
                </svg>
              </button>

              <!-- Text Align Center -->
              <button
                type="button"
                @click="store.applyTextAlign('center')"
                title="Align Text Center"
                class="flex items-center justify-center p-2 rounded border transition"
                :class="
                  store.currentProperties.textAlign === 'center'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/>
                </svg>
              </button>

              <!-- Text Align Right -->
              <button
                type="button"
                @click="store.applyTextAlign('right')"
                title="Align Text Right"
                class="flex items-center justify-center p-2 rounded border transition"
                :class="
                  store.currentProperties.textAlign === 'right'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>
                </svg>
              </button>

              <!-- Text Vertical Align Top -->
              <button
                type="button"
                @click="store.applyVerticalAlign('top')"
                title="Align Text Top"
                class="flex items-center justify-center p-2 rounded border transition"
                :class="
                  store.currentProperties.verticalAlign === 'top'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z"/>
                </svg>
              </button>

              <!-- Text Vertical Align Middle -->
              <button
                type="button"
                @click="store.applyVerticalAlign('middle')"
                title="Align Text Middle"
                class="flex items-center justify-center p-2 rounded border transition"
                :class="
                  store.currentProperties.verticalAlign === 'middle'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 19h3v4h2v-4h3l-4-4-4 4zm8-14h-3V1h-2v4H8l4 4 4-4zM4 11v2h16v-2H4z"/>
                </svg>
              </button>

              <!-- Text Vertical Align Bottom -->
              <button
                type="button"
                @click="store.applyVerticalAlign('bottom')"
                title="Align Text Bottom"
                class="flex items-center justify-center p-2 rounded border transition"
                :class="
                  store.currentProperties.verticalAlign === 'bottom'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Text Transform Section (Point 2 Fix) -->
        <div
          v-if="store.selectedElementType !== 'rectangle'"
          class="bg-white p-3 border-b border-gray-200"
        >
          <div
            class="flex items-center justify-between cursor-pointer"
            @click="toggleSection('textTransform')"
          >
            <div class="flex items-center">
              <Icon
                name="mdi:format-letter-case"
                class="text-xl p-1 text-gray-600"
              />
              <span class="font-semibold text-gray-700">Text Casing</span>
            </div>
            <Icon
              :name="
                openSections.textTransform
                  ? 'mdi:chevron-up'
                  : 'mdi:chevron-down'
              "
              class="text-gray-600"
            />
          </div>

          <div v-show="openSections.textTransform" class="mt-2 grid grid-cols-4 gap-1.5">
            <button
              type="button"
              @click="store.applyTextTransform('none')"
              class="flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition"
              :class="
                !store.currentProperties.textTransform || store.currentProperties.textTransform === 'none'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              "
              title="Normal / Original casing"
            >
              <span class="text-sm font-bold leading-none mb-0.5">Aa</span>
              <span class="text-[10px]">Normal</span>
            </button>
            <button
              type="button"
              @click="store.applyTextTransform('capitalize')"
              class="flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition"
              :class="
                store.currentProperties.textTransform === 'capitalize'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              "
              title="Capitalize Each Word"
            >
              <span class="text-sm font-bold leading-none mb-0.5">Ab</span>
              <span class="text-[10px]">Title</span>
            </button>
            <button
              type="button"
              @click="store.applyTextTransform('uppercase')"
              class="flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition"
              :class="
                store.currentProperties.textTransform === 'uppercase'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              "
              title="ALL UPPERCASE"
            >
              <span class="text-sm font-bold uppercase leading-none mb-0.5">AA</span>
              <span class="text-[10px]">UPPER</span>
            </button>
            <button
              type="button"
              @click="store.applyTextTransform('lowercase')"
              class="flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition"
              :class="
                store.currentProperties.textTransform === 'lowercase'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              "
              title="all lowercase"
            >
              <span class="text-sm font-bold lowercase leading-none mb-0.5">aa</span>
              <span class="text-[10px]">lower</span>
            </button>
          </div>
        </div>

        <!-- Text Style Section -->
        <div
          v-if="store.selectedElementType !== 'rectangle'"
          class="bg-white p-3 border-b border-gray-200"
        >
          <div
            class="flex items-center justify-between cursor-pointer"
            @click="toggleSection('textStyle')"
          >
            <div class="flex items-center">
              <Icon
                name="mdi:text"
                class="text-xl p-1 text-gray-600"
                aria-hidden="true"
              />
              <span class="font-semibold text-gray-700">Text Style</span>
            </div>
            <Icon
              :name="
                openSections.textStyle ? 'mdi:chevron-up' : 'mdi:chevron-down'
              "
              class="text-gray-600"
            />
          </div>

          <div v-show="openSections.textStyle" class="mt-2 space-y-2">
            <div class="flex gap-2">
              <button
                type="button"
                @click="store.toggleTextStyle('bold')"
                title="Bold"
                class="w-8 h-8 flex items-center justify-center rounded border transition"
                :class="
                  store.currentProperties.fontWeight === 'bold'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
                </svg>
              </button>

              <button
                type="button"
                @click="store.toggleTextStyle('italic')"
                title="Italic"
                class="w-8 h-8 flex items-center justify-center rounded border transition"
                :class="
                  store.currentProperties.fontStyle === 'italic'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
                </svg>
              </button>

              <button
                type="button"
                @click="store.toggleTextStyle('underline')"
                title="Underline"
                class="w-8 h-8 flex items-center justify-center rounded border transition"
                :class="
                  store.currentProperties.textDecoration === 'underline'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                "
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
                </svg>
              </button>
            </div>

            <div>
              <span class="block text-sm font-medium text-gray-600">Text</span>
              <input
                v-model="store.currentProperties.text"
                class="mt-1 border px-2 py-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                @input="store.updateProperties(store.currentProperties)"
              />
            </div>

            <div>
              <span class="block text-sm font-medium text-gray-600"
                >Display</span
              >
              <div class="flex flex-wrap gap-4 mt-1">
                <label class="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    value="both sides"
                    v-model="store.currentProperties.displayOption"
                    @change="store.updateProperties(store.currentProperties)"
                  />
                  <span class="text-sm text-gray-700">Both sides</span>
                </label>
                <label class="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    value="left side only"
                    v-model="store.currentProperties.displayOption"
                    @change="store.updateProperties(store.currentProperties)"
                  />
                  <span class="text-sm text-gray-700">Left side only</span>
                </label>
                <label class="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    value="right side only"
                    v-model="store.currentProperties.displayOption"
                    @change="store.updateProperties(store.currentProperties)"
                  />
                  <span class="text-sm text-gray-700">Right side only</span>
                </label>
              </div>
            </div>

            <div>
              <span class="block text-sm font-medium text-gray-600"
                >Direction</span
              >
              <select
                v-model="store.currentProperties.direction"
                class="mt-1 border px-2 py-1 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                @change="updateTextDirection"
              >
                <option value="ltr">Left to Right</option>
                <option value="rtl">Right to Left</option>
              </select>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCanvasStore } from "@/stores/useCanvasStore";

const store = useCanvasStore();

const openSections = ref({
  geometry: true,
  avatar: true,
  textAlignment: true,
  textTransform: true,
  textStyle: true,
  qrcode: true,
});

function toggleSection(section) {
  openSections.value[section] = !openSections.value[section];
}

// Select font and update store
function selectFont(value) {
  store.currentProperties.font = value;
  store.updateProperties(store.currentProperties);
  store.dropdownOpen = false;
}

// Get font display name
function getFontName(value) {
  const font = fonts.find((f) => f.value === value);
  return font ? font.name : "Select Font";
}

function updateFillColor() {
  store.currentProperties.fillTransparency = false;
  store.updateProperties(store.currentProperties);
}

function updateTextDirection() {
  if (store.selectedElement) {
    store.setTextDirection(
      store.selectedElement,
      store.currentProperties.direction
    );
  }
}

const fontSearch = ref("");

const fonts = [
  { name: "Cairo", value: '"Cairo", sans-serif' },
  { name: "Roboto", value: '"Roboto", sans-serif' },
  { name: "Open Sans", value: '"Open Sans", sans-serif' },
  { name: "Lato", value: '"Lato", sans-serif' },
  { name: "Montserrat", value: '"Montserrat", sans-serif' },
  { name: "Oswald", value: '"Oswald", sans-serif' },
  { name: "Source Sans Pro", value: '"Source Sans Pro", sans-serif' },
  { name: "Raleway", value: '"Raleway", sans-serif' },
  { name: "Poppins", value: '"Poppins", sans-serif' },
  { name: "Noto Sans", value: '"Noto Sans", sans-serif' },
  { name: "Ubuntu", value: '"Ubuntu", sans-serif' },
  { name: "Merriweather", value: '"Merriweather", serif' },
  { name: "PT Sans", value: '"PT Sans", sans-serif' },
  { name: "Roboto Condensed", value: '"Roboto Condensed", sans-serif' },
  { name: "Playfair Display", value: '"Playfair Display", serif' },
  { name: "Nunito", value: '"Nunito", sans-serif' },
  { name: "Mukta", value: '"Mukta", sans-serif' },
  { name: "Inconsolata", value: '"Inconsolata", monospace' },
  { name: "Quicksand", value: '"Quicksand", sans-serif' },
  { name: "Fira Sans", value: '"Fira Sans", sans-serif' },
  { name: "Assistant", value: '"Assistant", sans-serif' },
];

const positions = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
];

const formatPositionName = (position) => {
  return position
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const avatarFileInput = ref(null);

function handleAvatarFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      store.setAvatarImage(e.target.result);
    }
  };
  reader.readAsDataURL(file);
}

const presetAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
];

const fits = ["cover", "contain", "fill", "scale-down", "none"];

const formatFitName = (fit) => {
  return fit
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const fitIconName = (fit) => {
  switch (fit) {
    case "cover":
      return "mdi:arrow-expand-all";
    case "contain":
      return "mdi:arrow-collapse-all";
    case "fill":
      return "mdi:stretch-to-page-outline";
    case "none":
      return "mdi:close-circle-outline";
    case "scale-down":
      return "mdi:magnify-minus-outline";
    default:
      return "mdi:crop";
  }
};

// Extended professional font sizes
const fontSizes = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 26, 28,
  30, 32, 34, 36, 38, 40, 44, 48, 52, 56, 60, 64, 72, 80,
];

// Filtered fonts based on search
const filteredFonts = computed(() => {
  if (!fontSearch.value) return fonts;
  return fonts.filter((f) =>
    f.name.toLowerCase().includes(fontSearch.value.toLowerCase())
  );
});

// Toggle dropdown
function toggleDropdown() {
  store.dropdownOpen = !store.dropdownOpen;
}

function selectElementFromEmptyState(boxId) {
  store.selectedElement = boxId;
  const targetBox = store.boxes.find((b) => b.id === boxId);
  if (targetBox) {
    store.selectedElementType = targetBox.type;
  }
  store.updateProperties();
}

function getElementBadgeIcon(type) {
  if (type === "avatar") return "mdi:account-circle";
  if (type === "qrcode") return "mdi:qrcode";
  if (type === "img" || type === "background") return "mdi:image";
  return "mdi:format-text";
}

function getElementShortLabel(box) {
  if (box.label) return box.label;
  if (box.text) {
    const textStr = String(box.text).trim();
    if (textStr) return textStr.length > 22 ? textStr.slice(0, 20) + "..." : textStr;
  }
  if (box.type === "avatar") return "Profile Photo";
  if (box.type === "qrcode") return "QR Code";
  if (box.type === "img" || box.type === "background") return "Badge Image";
  return `Element (${box.type})`;
}
</script>
