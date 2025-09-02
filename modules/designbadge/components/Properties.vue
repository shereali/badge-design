<template>
  <div class="space-y-2">
    <div v-if="!store.selectedElement">
      <p class="text-gray-500">
        Select an element to view and edit its properties.
      </p>
    </div>

    <template v-else>
      <!-- Alignment Section -->
      <div class="bg-white p-3 border-b border-gray-200">
        <div class="grid grid-cols-6 gap-1">
          <Icon
            @click="store.alignHorizontal('left')"
            name="solar:align-left-linear"
            class="text-xl p-1 hover:text-blue-600 cursor-pointer"
            :class="{
              'text-blue-700': store.currentProperties.textAlign === 'left',
            }"
          />
          <Icon
            @click="store.alignHorizontal('center')"
            name="streamline-ultimate:align-center"
            class="text-xl p-1 hover:text-blue-600 cursor-pointer"
            :class="{
              'text-blue-700': store.currentProperties.textAlign === 'center',
            }"
          />
          <Icon
            @click="store.alignHorizontal('right')"
            name="solar:align-right-linear"
            class="text-xl p-1 hover:text-blue-600 cursor-pointer"
            :class="{
              'text-blue-700': store.currentProperties.textAlign === 'right',
            }"
          />
          <Icon
            @click="store.alignVertical('top')"
            name="solar:align-top-linear"
            class="text-xl p-1 hover:text-blue-600 cursor-pointer"
            :class="{
              'text-blue-700': store.currentProperties.verticalAlign === 'top',
            }"
          />
          <Icon
            @click="store.alignVertical('middle')"
            name="streamline-ultimate:align-middle"
            class="text-xl p-1 hover:text-blue-600 cursor-pointer"
            :class="{
              'text-blue-700':
                store.currentProperties.verticalAlign === 'middle',
            }"
          />
          <Icon
            @click="store.alignVertical('bottom')"
            name="solar:align-bottom-linear"
            class="text-xl p-1 hover:text-blue-600 cursor-pointer"
            :class="{
              'text-blue-700':
                store.currentProperties.verticalAlign === 'bottom',
            }"
          />
        </div>
      </div>

      <!-- Geometry Section -->
      <div class="bg-white p-3 border-b border-gray-200 shadow-sm">
        <div
          class="flex items-center justify-between cursor-pointer"
          @click="toggleSection('geometry')"
        >
          <div class="flex items-center">
            <Icon name="tabler:geometry" class="text-xl p-1 text-gray-600" />
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
            <span class="p-1 bg-gray-200 text-gray-700 w-8 text-center">
              <Icon name="ph:angle-bold" class="text-base" />
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
            <Icon name="tabler:avatar" class="text-xl p-1 text-gray-600" />
            <span class="font-semibold text-gray-700">Avatar</span>
          </div>
          <Icon
            :name="openSections.avatar ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            class="text-gray-600"
          />
        </div>

        <div v-show="openSections.avatar" class="mt-3 grid grid-cols-1 gap-2">
          <div class="p-4 bg-white rounded-2xl shadow">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Size (px)</label
            >
            <input
              type="range"
              min="40"
              max="800"
              v-model.number="store.avatarSize"
              class="w-full"
              @input="store.syncAvatarToCurrent"
            />
            <div class="mt-2 text-sm text-gray-500">
              {{ store.avatarSize }}px
            </div>
          </div>

          <div
            class="p-4 bg-white rounded-2xl shadow"
            v-if="
              store.avatarShape === 'rounded' ||
              store.avatarShape === 'squircle' ||
              store.avatarShape === 'custom'
            "
          >
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Border Radius (px)</label
            >
            <input
              type="range"
              min="0"
              max="400"
              v-model.number="store.avatarRadius"
              class="w-full"
              @input="store.syncAvatarToCurrent"
            />
            <div class="mt-2 text-sm text-gray-500">
              {{ store.avatarRadius }}px
            </div>
          </div>

          <div class="p-4 bg-white rounded-2xl shadow">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Shape</label
            >
            <select
              v-model="store.avatarShape"
              class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              @change="store.syncAvatarToCurrent"
            >
              <option value="circle">Circle</option>
              <option value="rounded">Rounded</option>
              <option value="squircle">Squircle</option>
              <option value="diamond">Diamond</option>
              <option value="hex">Hexagon</option>
              <option value="triangle">Triangle</option>
              <option value="blob">Blob</option>
              <option value="custom">Custom (clip-path)</option>
            </select>

            <div v-if="store.avatarShape === 'custom'" class="mt-3">
              <label class="block text-xs font-medium text-gray-600 mb-1"
                >CSS clip-path</label
              >
              <input
                v-model="store.avatarCustomClipPath"
                placeholder="e.g. polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
                class="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                @input="store.syncAvatarToCurrent"
              />
              <div class="mt-2 text-xs text-gray-500">
                Enter a valid <code>clip-path</code> value.
              </div>
            </div>
          </div>

          <div
            class="p-4 bg-white rounded-2xl shadow grid grid-cols-2 gap-3 items-center"
          >
            <label class="text-sm font-medium text-gray-700">Border</label>
            <input
              type="checkbox"
              v-model="store.avatarShowBorder"
              class="h-4 w-4"
              @change="store.syncAvatarToCurrent"
            />
            <label class="text-sm font-medium text-gray-700">Ring</label>
            <input
              type="checkbox"
              v-model="store.avatarShowRing"
              class="h-4 w-4"
              @change="store.syncAvatarToCurrent"
            />
          </div>
        </div>
      </div>
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
</script>
