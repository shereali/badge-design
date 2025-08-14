<template>
  <div class="w-1/5 bg-slate-50 p-4 overflow-y-auto">
    <div class="flex mb-4">
      <button
        class="flex-1 p-2"
        :class="{ 'bg-blue-500 text-white': activeTab === 'design' }"
        @click="activeTab = 'design'"
      >
        Design
      </button>
      <button
        class="flex-1 p-2"
        :class="{ 'bg-blue-500 text-white': activeTab === 'properties' }"
        @click="activeTab = 'properties'"
      >
        Properties
      </button>
      <button
        class="flex-1 p-2"
        :class="{ 'bg-blue-500 text-white': activeTab === 'layers' }"
        @click="activeTab = 'layers'"
      >
        Layers
      </button>
    </div>

    <!-- Design Tab -->
    <div v-if="activeTab === 'design'" class="space-y-1">
      <div class="p-2 flex">
        <Icon name="quill:paper" class="text-2xl text-blue-600" />
        <span
          >{{ pageStore.badgeSize }}({{ pageStore.presetWidth.toFixed(2) }}mmX{{
            pageStore.presetHeight.toFixed(2)
          }}mm) </span
        ><a
          href="#"
          class="text-blue-600 font-semibold"
          @click="pageStore.toggleModal"
        >
          &nbsp;Change</a
        >
      </div>
      <div
        v-for="group in designGroups"
        :key="group.type"
        class="bg-white rounded"
      >
        <div
          @click="toggleGroup(group.type)"
          class="flex items-center p-2 cursor-pointer hover:bg-gray-50"
        >
          <Icon
            :name="group.icon"
            class="text-2xl mr-2 bg-blue-600"
            aria-hidden="true"
          />
          <span>{{ group.label }}</span>
          <Icon
            name="mdi:chevron-down"
            class="ml-auto text-2xl"
            :class="{ 'transform rotate-180': openGroups[group.type] }"
            aria-hidden="true"
          />
        </div>
        <div v-if="openGroups[group.type]" class="pl-6 space-y-2">
          <div
            v-for="item in group.items"
            :key="item.type"
            draggable="true"
            @dragstart="(e) => startSidebarDrag(e, item)"
            @dragend="(e) => emitDragEnd(e, item)"
            class="draggable-item flex items-center p-2 bg-white rounded cursor-move hover:bg-gray-50"
            :data-type="item.type"
          >
            <Icon :name="item.icon" class="w-5 h-5 mr-2" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Properties Tab -->
    <div v-if="activeTab === 'properties'" class="space-y-4">
      <div v-if="!selectedElement">
        <p class="text-gray-500">
          Select an element to view and edit its properties.
        </p>
      </div>
      <template v-else>
        <div class="space-y-4">
          <!-- Geometry Section -->
          <div class="bg-white p-3">
            <div class="grid grid-cols-6 mb-5">
              <Icon
                @click="store.alignHorizontal('left')"
                name="solar:align-left-broken"
                class="text-2xl p-2 m-1 hover:text-blue-600 cursor-pointer"
                :class="{
                  'text-blue-700': store.currentProperties.textAlign === 'left',
                }"
                aria-hidden="true"
              />
              <Icon
                @click="store.alignHorizontal('center')"
                name="streamline-ultimate:align-center"
                class="text-2xl p-2 m-1 hover:text-blue-600 cursor-pointer"
                :class="{
                  'text-blue-700':
                    store.currentProperties.textAlign === 'center',
                }"
                aria-hidden="true"
              />
              <Icon
                @click="store.alignHorizontal('right')"
                name="solar:align-right-broken"
                class="text-2xl p-2 m-1 hover:text-blue-600 cursor-pointer"
                :class="{
                  'text-blue-700':
                    store.currentProperties.textAlign === 'right',
                }"
                aria-hidden="true"
              />
              <Icon
                @click="store.alignVertical('top')"
                name="mdi:format-align-top"
                class="text-2xl p-2 m-1 hover:text-blue-600 cursor-pointer"
                :class="{
                  'text-blue-700':
                    store.currentProperties.verticalAlign === 'top',
                }"
                aria-hidden="true"
              />
              <Icon
                @click="store.alignVertical('middle')"
                name="mdi:format-align-middle"
                class="text-2xl p-2 m-1 hover:text-blue-600 cursor-pointer"
                :class="{
                  'text-blue-700':
                    store.currentProperties.verticalAlign === 'middle',
                }"
                aria-hidden="true"
              />
              <Icon
                @click="store.alignVertical('bottom')"
                name="mdi:format-align-bottom"
                class="text-2xl p-2 m-1 hover:text-blue-600 cursor-pointer"
                :class="{
                  'text-blue-700':
                    store.currentProperties.verticalAlign === 'bottom',
                }"
                aria-hidden="true"
              />
            </div>
            <div class="flex items-center mb-2">
              <Icon
                name="tabler:geometry"
                class="text-2xl p-2 m-1 hover:text-blue-600 cursor-pointer mr-2 text-gray-600"
                aria-hidden="true"
              />
              <span class="font-semibold">Geometry</span>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-1">
              <div class="flex items-center border border-gray-300 rounded-md">
                <span class="px-3 py-2 bg-gray-300 text-gray-700">X</span>
                <input
                  type="number"
                  v-model.number="store.currentProperties.x"
                  class="w-full p-2 focus:outline-none"
                  @input="store.updateProperties(store.currentProperties)"
                />
              </div>
              <div class="flex items-center border border-gray-300 rounded-md">
                <span class="px-3 py-2 bg-gray-300 text-gray-700">Y</span>
                <input
                  type="number"
                  v-model.number="store.currentProperties.y"
                  class="w-full p-2 focus:outline-none"
                  @input="store.updateProperties(store.currentProperties)"
                />
              </div>
              <div class="flex items-center border border-gray-300 rounded-md">
                <span class="px-3 py-2 bg-gray-300 text-gray-700">W</span>
                <input
                  type="number"
                  v-model.number="store.currentProperties.size.width"
                  class="w-full p-2 focus:outline-none"
                  @input="store.updateProperties(store.currentProperties)"
                />
              </div>
              <div class="flex items-center border border-gray-300 rounded-md">
                <span class="px-3 py-2 bg-gray-300 text-gray-700">H</span>
                <input
                  type="number"
                  v-model.number="store.currentProperties.size.height"
                  class="w-full p-2 focus:outline-none"
                  @input="store.updateProperties(store.currentProperties)"
                />
              </div>
              <div class="flex items-center border border-gray-300 rounded-md">
                <span class="px-3 py-2 bg-gray-300 text-gray-700">
                  <Icon name="ph:angle-bold" />
                </span>
                <input
                  type="number"
                  v-model.number="store.currentProperties.rotation"
                  class="w-full p-2 focus:outline-none"
                  @input="store.updateProperties(store.currentProperties)"
                />
              </div>
            </div>
          </div>

          <!-- Text Specific Properties -->
          <template
            v-if="selectedElementType === 'h1' || selectedElementType === 'p'"
          >
            <!-- Font Section -->
            <div class="w-full bg-white p-4">
              <!-- Header -->
              <div class="flex items-center mb-4">
                <Icon
                  name="mdi:format-font"
                  class="w-5 h-5 mr-2 text-gray-600"
                  aria-hidden="true"
                />
                <span class="font-semibold text-gray-700 text-lg"
                  >Font Settings</span
                >
              </div>

              <!-- Font Selector Dropdown -->
              <div class="relative mb-4">
                <label class="block mb-1 font-medium text-gray-600">Font</label>
                <div
                  @click="toggleDropdown"
                  class="border rounded p-2 w-full cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-blue-300"
                >
                  <span :style="{ fontFamily: store.currentProperties.font }">
                    {{ getFontName(store.currentProperties.font) }}
                  </span>
                  <svg
                    :class="{ 'transform rotate-180': dropdownOpen }"
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

                <!-- Dropdown list -->
                <div
                  v-show="dropdownOpen"
                  class="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto"
                >
                  <!-- Search input sticky -->
                  <div class="sticky top-0 bg-white z-10 border-b">
                    <input
                      type="text"
                      v-model="fontSearch"
                      placeholder="Search font..."
                      class="p-2 w-full focus:outline-none"
                    />
                  </div>

                  <!-- Font options -->
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
                <label class="block mb-1 font-medium text-gray-600"
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

            <!-- Fill Section -->
            <div class="bg-white p-4 w-full">
              <!-- Header -->
              <div class="flex items-center mb-2">
                <Icon
                  name="mdi:palette"
                  class="w-5 h-5 mr-2 text-gray-600"
                  aria-hidden="true"
                />
                <span class="font-semibold text-gray-700 text-lg"
                  >Fill Color</span
                >
              </div>
              <div class="flex items-center space-x-5">
                <!-- Color Picker -->
                <div class="flex items-center border overflow-hidden">
                  <input
                    type="color"
                    v-model="store.currentProperties.fillColor"
                    class="w-12 h-10 p-0 border-none cursor-pointer"
                    @input="updateFillColor"
                  />
                  <input
                    type="text"
                    v-model="store.currentProperties.fillColor"
                    class="py-1 border-l text-gray-700 focus:outline-none"
                    placeholder="#000000"
                  />
                </div>

                <!-- Transparent Button -->
                <button
                  class="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition-all duration-200"
                  @click="store.makeTransparent"
                >
                  <Icon
                    name="streamline-plump:transparent"
                    class="w-6 h-6 text-gray-600"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <!-- Text Style Section -->
            <div class="bg-white p-4 space-y-4">
              <!-- Header -->
              <div class="flex items-center border-b pb-2">
                <Icon
                  name="mdi:text"
                  class="w-6 h-6 mr-2 text-gray-600"
                  aria-hidden="true"
                />
                <span class="font-semibold text-lg">Text Style</span>
              </div>

              <!-- Bold / Italic / Underline -->
              <div class="flex space-x-2">
                <button
                  @click="store.toggleTextStyle('bold')"
                  :class="
                    store.currentProperties.fontWeight === 'bold'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-2 rounded-lg transition-colors"
                >
                  <Icon name="mdi:format-bold" class="w-5 h-5" />
                </button>
                <button
                  @click="store.toggleTextStyle('italic')"
                  :class="
                    store.currentProperties.fontStyle === 'italic'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-2 rounded-lg transition-colors"
                >
                  <Icon name="mdi:format-italic" class="w-5 h-5" />
                </button>
                <button
                  @click="store.toggleTextStyle('underline')"
                  :class="
                    store.currentProperties.textDecoration === 'underline'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-2 rounded-lg transition-colors"
                >
                  <Icon name="mdi:format-underline" class="w-5 h-5" />
                </button>
              </div>

              <!-- Text Color -->
              <div>
                <span class="text-sm font-medium text-gray-700"
                  >Text Color</span
                >
                <div
                  class="flex items-center mt-1 border focus:outline-none overflow-hidden"
                >
                  <input
                    type="color"
                    v-model="store.currentProperties.color"
                    class="w-12 h-10 border-none cursor-pointer"
                    @input="store.updateProperties(store.currentProperties)"
                  />
                  <input
                    type="text"
                    v-model="store.currentProperties.color"
                    class="flex-1 px-2 text-gray-700 focus:outline-none"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <!-- Text Input -->
              <div>
                <span class="text-sm font-medium text-gray-700">Text</span>
                <input
                  v-model="store.currentProperties.text"
                  class="mt-1 border px-3 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  @input="store.updateProperties(store.currentProperties)"
                />
              </div>

              <!-- Display Option -->
              <div>
                <span class="text-sm font-medium text-gray-700">Display</span>
                <div class="flex flex-wrap gap-4 mt-1">
                  <label class="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      value="both sides"
                      v-model="store.currentProperties.displayOption"
                      @change="store.updateProperties(store.currentProperties)"
                    />
                    <span>Both sides</span>
                  </label>
                  <label class="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      value="left side only"
                      v-model="store.currentProperties.displayOption"
                      @change="store.updateProperties(store.currentProperties)"
                    />
                    <span>Left side only</span>
                  </label>
                  <label class="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      value="right side only"
                      v-model="store.currentProperties.displayOption"
                      @change="store.updateProperties(store.currentProperties)"
                    />
                    <span>Right side only</span>
                  </label>
                </div>
              </div>

              <!-- Text Direction -->
              <div>
                <span class="text-sm font-medium text-gray-700">Direction</span>
                <select
                  v-model="store.currentProperties.direction"
                  class="mt-1 border px-3 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  @change="updateTextDirection"
                >
                  <option value="ltr">Left to Right</option>
                  <option value="rtl">Right to Left</option>
                </select>
              </div>
            </div>

            <!-- Text Alignment -->
            <div class="bg-white p-4 rounded-xl shadow-md space-y-3">
              <div class="flex items-center border-b pb-2">
                <Icon
                  name="mdi:format-align-left"
                  class="w-6 h-6 mr-2 text-gray-600"
                />
                <span class="font-semibold text-lg">Text Alignment</span>
              </div>
              <div class="flex gap-3">
                <div
                  @click="store.applyTextAlign('left')"
                  :class="
                    store.currentProperties.textAlign === 'left'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon name="mdi:format-align-left" class="text-xl" />
                </div>
                <div
                  @click="store.applyTextAlign('center')"
                  :class="
                    store.currentProperties.textAlign === 'center'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon name="mdi:format-align-center" class="text-xl" />
                </div>
                <div
                  @click="store.applyTextAlign('right')"
                  :class="
                    store.currentProperties.textAlign === 'right'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon name="mdi:format-align-right" class="text-xl" />
                </div>
              </div>
            </div>

            <!-- Text Area Alignment -->
            <div class="bg-white p-4 rounded-xl shadow-md space-y-3 mt-4">
              <div class="flex items-center border-b pb-2">
                <Icon
                  name="mdi:format-align-top"
                  class="w-6 h-6 mr-2 text-gray-600"
                />
                <span class="font-semibold text-lg">Text Area Alignment</span>
              </div>
              <div class="flex gap-3">
                <div
                  @click="store.applyVerticalAlign('top')"
                  :class="
                    store.currentProperties.verticalAlign === 'top'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon name="mdi:format-align-top" class="text-xl" />
                </div>
                <div
                  @click="store.applyVerticalAlign('middle')"
                  :class="
                    store.currentProperties.verticalAlign === 'middle'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon name="mdi:format-align-middle" class="text-xl" />
                </div>
                <div
                  @click="store.applyVerticalAlign('bottom')"
                  :class="
                    store.currentProperties.verticalAlign === 'bottom'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon name="mdi:format-align-bottom" class="text-xl" />
                </div>
              </div>
            </div>

            <!-- Text Transform -->
            <div class="bg-white p-4 rounded-xl shadow-md space-y-3">
              <div class="flex items-center border-b pb-2">
                <Icon
                  name="mdi:format-letter-case-upper"
                  class="w-6 h-6 mr-2 text-gray-600"
                />
                <span class="font-semibold text-lg">Text Transform</span>
              </div>
              <div class="flex gap-3">
                <!-- Uppercase -->
                <div
                  @click="store.applyTextTransform('uppercase')"
                  :class="
                    store.currentProperties.textTransform === 'uppercase'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon name="mdi:format-letter-case-upper" class="text-xl" />
                </div>

                <!-- Lowercase -->
                <div
                  @click="store.applyTextTransform('lowercase')"
                  :class="
                    store.currentProperties.textTransform === 'lowercase'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon name="mdi:format-letter-case-lower" class="text-xl" />
                </div>

                <!-- Capitalize -->
                <div
                  @click="store.applyTextTransform('capitalize')"
                  :class="
                    store.currentProperties.textTransform === 'capitalize'
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                  class="p-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Icon name="mdi:format-letter-case" class="text-xl" />
                </div>
              </div>
            </div>
          </template>

          <!-- Image Specific Properties -->
          <template v-if="selectedElementType === 'img'">
            <!-- Associated Data Section -->
            <div class="bg-white p-2 rounded shadow">
              <div class="flex items-center mb-2">
                <Icon
                  name="mdi:database"
                  class="w-5 h-5 mr-2 text-gray-600"
                  aria-hidden="true"
                />
                <span class="font-semibold">Associated Data</span>
              </div>
              <label class="block">
                Data:
                <select
                  v-model="store.currentProperties.associatedData"
                  class="border p-1 w-full rounded"
                  @change="store.updateProperties(store.currentProperties)"
                >
                  <option>User ID</option>
                </select>
              </label>
            </div>

            <!-- Stroke Section -->
            <div class="bg-white p-2 rounded shadow">
              <div class="flex items-center mb-2">
                <Icon
                  name="mdi:brush"
                  class="w-5 h-5 mr-2 text-gray-600"
                  aria-hidden="true"
                />
                <span class="font-semibold">Stroke</span>
              </div>
              <div class="flex space-x-2">
                <label class="block flex-1">
                  Color:
                  <input
                    v-model="store.currentProperties.strokeColor"
                    type="color"
                    class="border p-1 w-full rounded mt-1"
                    @input="store.updateProperties(store.currentProperties)"
                  />
                </label>
                <label class="block flex-1">
                  Width:
                  <input
                    v-model.number="store.currentProperties.strokeWidth"
                    type="number"
                    class="border p-1 w-full rounded mt-1"
                    @input="store.updateProperties(store.currentProperties)"
                  />
                </label>
              </div>
            </div>
          </template>

          <!-- QR Code Specific Properties -->
          <template v-if="selectedElementType === 'qrcode'">
            <!-- Content Section -->
            <div class="bg-white p-2 rounded shadow">
              <div class="flex items-center mb-2">
                <Icon
                  name="mdi:qrcode"
                  class="w-5 h-5 mr-2 text-gray-600"
                  aria-hidden="true"
                />
                <span class="font-semibold">Content</span>
              </div>
              <label class="block">
                Content:
                <input
                  v-model="store.currentProperties.content"
                  class="border p-1 w-full rounded"
                  @input="store.updateProperties(store.currentProperties)"
                />
              </label>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!-- Layers Tab -->
    <div v-if="activeTab === 'layers'" class="space-y-2">
      <ul>
        <li
          v-for="layer in layers"
          :key="layer.id"
          @click="store.selectLayer(layer.id)"
          class="p-2 rounded cursor-pointer hover:bg-gray-200"
          :class="{ 'bg-blue-200': selectedLayer === layer.id }"
        >
          <div class="flex items-center justify-between">
            <span>{{ layer.name }} ({{ layer.type }})</span>
            <button
              @click.stop="store.toggleLayerVisibility(layer.id)"
              class="text-blue-500"
            >
              <Icon
                :name="layer.visible ? 'mdi:eye' : 'mdi:eye-off'"
                class="w-5 h-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useCanvasStore } from "@/stores/useCanvasStore";
import { usePageStore } from "@/stores/usePageStore";
const pageStore = usePageStore();

defineProps({
  selectedElement: [String, Number, null],
  selectedElementType: String,
  layers: Array,
  selectedLayer: [Number, null],
  currentProperties: Object,
  displayOption: String,
});

const emit = defineEmits(["drag-start", "drag-end"]);

const store = useCanvasStore();

const dropdownOpen = ref(false);
const fontSearch = ref("");

const fonts = [
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
  dropdownOpen.value = !dropdownOpen.value;
}

// Select font and update store
function selectFont(value) {
  store.currentProperties.font = value;
  store.updateProperties(store.currentProperties);
  dropdownOpen.value = false;
}

// Get font display name
function getFontName(value) {
  const font = fonts.find((f) => f.value === value);
  return font ? font.name : "Select Font";
}

function startSidebarDrag(event, item) {
  emit("drag-start", item);
}

function emitDragEnd(event, item) {
  const x = event.clientX;
  const y = event.clientY;
  emit("drag-end", { item, x, y });
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

const activeTab = ref("design");
const openGroups = ref({
  user_info: false,
  event_info: false,
  qr_code: false,
  background: false,
  static_field: false,
  punching_area: false,
});

const designGroups = [
  {
    type: "user_info",
    label: "User Info",
    icon: "mdi:account",
    items: [
      {
        type: "h1",
        label: "LAST NAME",
        icon: "streamline-flex-color:copy-2-flat",
      },
      {
        type: "h1",
        label: "FIRST NAME",
        icon: "streamline-flex-color:copy-2-flat",
      },
      {
        type: "h1",
        label: "Full Name",
        icon: "streamline-flex-color:copy-2-flat",
      },
      { type: "p", label: "EMAIL", icon: "streamline-flex-color:copy-2-flat" },
      {
        type: "p",
        label: "COMPANY NAME",
        icon: "streamline-flex-color:copy-2-flat",
      },
      {
        type: "p",
        label: "DESIGNATION",
        icon: "streamline-flex-color:copy-2-flat",
      },
      { type: "p", label: "ROLE", icon: "streamline-flex-color:copy-2-flat" },
      {
        type: "p",
        label: "USER ID",
        icon: "streamline-flex-color:copy-2-flat",
      },
      {
        type: "eventlogo",
        label: "AVATAR",
        icon: "streamline-flex-color:copy-2-flat",
      },
    ],
  },
  {
    type: "event_info",
    label: "Event Info",
    icon: "mdi:calendar",
    items: [
      {
        type: "h1",
        label: "Event Name",
        icon: "streamline-flex-color:copy-2-flat",
      },
      { type: "p", label: "Venue", icon: "streamline-flex-color:copy-2-flat" },
      { type: "p", label: "Date", icon: "streamline-flex-color:copy-2-flat" },
      {
        type: "p",
        label: "ZIP Code",
        icon: "streamline-flex-color:copy-2-flat",
      },
      { type: "p", label: "City", icon: "streamline-flex-color:copy-2-flat" },
      {
        type: "img",
        label: "Event Logo",
        icon: "streamline-flex-color:copy-2-flat",
      },
    ],
  },
  {
    type: "qr_code",
    label: "QR Code",
    icon: "mdi:qrcode",
    items: [{ type: "p", label: "QR Code", icon: "mdi:qrcode" }],
  },
  {
    type: "background",
    label: "Background",
    icon: "mdi:image",
    items: [
      { type: "img", label: "Image", icon: "mdi:image" },
      { type: "background", label: "Gradient", icon: "mdi:gradient" },
      { type: "background", label: "Color", icon: "mdi:palette" },
      { type: "background", label: "None", icon: "mdi:close" },
    ],
  },
  {
    type: "static_field",
    label: "Static Fields",
    icon: "mdi:shape",
    items: [
      { type: "p", label: "Text", icon: "mdi:text" },
      { type: "img", label: "Image", icon: "mdi:image" },
      { type: "line", label: "Rectangle", icon: "mdi:rectangle" },
    ],
  },
  {
    type: "punching_area",
    label: "Punching Area Reference",
    icon: "mdi:gesture-tap",
    items: [
      { type: "punching_area", label: "None", icon: "mdi:close" },
      { type: "punching_area", label: "Top", icon: "mdi:arrow-up" },
      { type: "punching_area", label: "Bottom", icon: "mdi:arrow-down" },
    ],
  },
];

const toggleGroup = (groupType) => {
  openGroups.value[groupType] = !openGroups.value[groupType];
};
</script>

<style scoped>
.transparent {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.transparent span {
  margin-left: 5px;
}
</style>
