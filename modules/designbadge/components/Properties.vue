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
            <Icon name="tabler:qrcode" class="text-xl p-1 text-gray-600" />
            <span class="font-semibold text-gray-700">QR Code</span>
          </div>
          <Icon
            :name="openSections.qrcode ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            class="text-gray-600"
          />
        </div>

        <div v-show="openSections.qrcode" class="mt-3 space-y-6">
          <!-- Variant Dropdown -->
          <div>
            <label class="block text-sm font-medium mb-2">Variant</label>
            <select
              v-model="store.currentProperties.qrcode.variant"
              class="w-full outline-none border rounded-lg p-1 focus:ring focus:ring-blue-300"
            >
              <option value="defualt">Default</option>
              <option value="circle">Circle</option>
              <option value="dots">Dots</option>
              <option value="rounded">Rounded</option>
              <option value="pixelated">Pixelated</option>
            </select>
          </div>

          <!-- Background Color Picker -->
          <div>
            <label class="block text-sm font-medium mb-2"
              >Background Color</label
            >
            <input
              type="color"
              v-model="store.currentProperties.qrcode.blackColor"
              class="w-full h-10 p-1 border rounded-lg cursor-pointer"
            />
          </div>

          <!-- Foreground Color Picker -->
          <div>
            <label class="block text-sm font-medium mb-2"
              >Foreground Color</label
            >
            <input
              type="color"
              v-model="store.currentProperties.qrcode.whiteColor"
              class="w-full h-10 p-1 border rounded-lg cursor-pointer"
            />
          </div>

          <!-- Border Radius -->
          <div>
            <label class="block text-sm font-medium mb-2"
              >Border Radius (1–10)</label
            >
            <input
              type="range"
              min="1"
              max="10"
              v-model="store.currentProperties.qrcode.radius"
              class="w-full"
            />
            <p class="text-sm text-gray-500 mt-1">
              {{ store.currentProperties.qrcode.radius }}px
            </p>
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
            <div class="flex items-center">
              <Icon
                name="streamline:interface-text-formatting-paragraph-alignment-paragraph-formatting-text"
                class="text-xl p-1 text-gray-600"
              />
              <span class="font-semibold text-gray-700">Text Alignment</span>
            </div>
            <Icon
              :name="
                openSections.textAlignment
                  ? 'mdi:chevron-up'
                  : 'mdi:chevron-down'
              "
              class="text-gray-600"
            />
          </div>

          <div v-show="openSections.textAlignment" class="mt-2 flex gap-2">
            <Icon
              name="mdi:format-align-left"
              class="p-1 text-xl cursor-pointer transition-colors"
              @click="store.applyTextAlign('left')"
              :class="
                store.currentProperties.textAlign === 'left'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              "
            />
            <Icon
              name="mdi:format-align-center"
              class="p-1 text-xl cursor-pointer transition-colors"
              @click="store.applyTextAlign('center')"
              :class="
                store.currentProperties.textAlign === 'center'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              "
            />
            <Icon
              name="mdi:format-align-right"
              class="p-1 text-xl cursor-pointer transition-colors"
              @click="store.applyTextAlign('right')"
              :class="
                store.currentProperties.textAlign === 'right'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              "
            />
            <Icon
              name="mdi:format-align-top"
              class="p-1 text-xl cursor-pointer transition-colors"
              @click="store.applyVerticalAlign('top')"
              :class="
                store.currentProperties.verticalAlign === 'top'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              "
            />
            <Icon
              name="mdi:format-align-middle"
              class="p-1 text-xl cursor-pointer transition-colors"
              @click="store.applyVerticalAlign('middle')"
              :class="
                store.currentProperties.verticalAlign === 'middle'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              "
            />
            <Icon
              name="mdi:format-align-bottom"
              class="p-1 text-xl cursor-pointer transition-colors"
              @click="store.applyVerticalAlign('bottom')"
              :class="
                store.currentProperties.verticalAlign === 'bottom'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              "
            />
          </div>
        </div>

        <!-- Text Transform Section -->
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
                name="mdi:format-letter-case-upper"
                class="text-xl p-1 text-gray-600"
              />
              <span class="font-semibold text-gray-700">Text Transform</span>
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

          <div v-show="openSections.textTransform" class="mt-2 flex gap-2">
            <Icon
              name="mdi:format-letter-case-upper"
              class="p-1 text-xl cursor-pointer transition-colors"
              @click="store.applyTextTransform('uppercase')"
              :class="
                store.currentProperties.textTransform === 'uppercase'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              "
            />
            <Icon
              name="mdi:format-letter-case-lower"
              class="p-1 text-xl cursor-pointer transition-colors"
              @click="store.applyTextTransform('lowercase')"
              :class="
                store.currentProperties.textTransform === 'lowercase'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              "
            />
            <Icon
              name="mdi:format-letter-case"
              class="p-1 text-xl cursor-pointer transition-colors"
              @click="store.applyTextTransform('capitalize')"
              :class="
                store.currentProperties.textTransform === 'capitalize'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              "
            />
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
              <Icon
                name="mdi:format-bold"
                class="p-1 text-xl cursor-pointer transition-colors"
                @click="store.toggleTextStyle('bold')"
                :class="
                  store.currentProperties.fontWeight === 'bold'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                "
              />
              <Icon
                name="mdi:format-italic"
                class="p-1 text-xl cursor-pointer transition-colors"
                @click="store.toggleTextStyle('italic')"
                :class="
                  store.currentProperties.fontStyle === 'italic'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                "
              />
              <Icon
                name="mdi:format-underline"
                class="p-1 text-xl cursor-pointer transition-colors"
                @click="store.toggleTextStyle('underline')"
                :class="
                  store.currentProperties.textDecoration === 'underline'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                "
              />
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
import { useCanvasStore } from "@/stores/useCanvasStore";

const store = useCanvasStore();

const variant = ref("solid");
const backgroundColor = ref("#3b82f6"); // default blue
const foregroundColor = ref("#ffffff"); // default white
const radius = ref(5);

const openSections = ref({
  geometry: false, // Geometry starts open
  objectPosition: false, // Object Position starts open
  objectFitPosition: false, // Object Position starts open
  qrcode: false, // Geometry starts open
  font: false,
  color: false,
  textAlignment: false,
  textTransform: false,
  textStyle: false,
  associatedData: false,
  stroke: false,
  content: false,
});

const toggleSection = (section) => {
  openSections.value[section] = !openSections.value[section];
};

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
      return "ix:align-object-dimensions";
    case "contain":
      return "tabler:container";
    case "fill":
      return "icon-park-outline:fill";
    case "none":
      return "radix-icons:view-none";
    case "scale-down":
      return "mage:scale-down";
  }
};

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
</script>
