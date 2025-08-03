<template>
  <transition name="flip">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b pb-2">
          <h3 class="text-lg font-semibold text-gray-900">Badge Options</h3>
          <button
            @click="emit('close')"
            class="text-gray-500 hover:text-gray-700"
          >
            <span class="text-xl">×</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="grid grid-cols-[1.5fr_1fr] gap-6 mt-4">
          <!-- Options Panel -->
          <div>
            <!-- Badge Size -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700"
                >Badge Size</label
              >
              <div class="mt-2 space-y-2">
                <!-- Preset/Custom Radio Inline -->
                <div class="flex items-center gap-6">
                  <label class="flex items-center">
                    <input
                      v-model="localBadgeSizePreset"
                      type="radio"
                      value="preset"
                      class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                    />
                    <span class="ml-2 text-sm text-gray-700">Preset</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="localBadgeSizePreset"
                      type="radio"
                      value="custom"
                      class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                    />
                    <span class="ml-2 text-sm text-gray-700">Custom</span>
                  </label>
                </div>

                <!-- Preset Options -->
                <select
                  v-if="localBadgeSizePreset === 'preset'"
                  v-model="localBadgeSize"
                  class="mt-2 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-600 focus:border-indigo-600"
                >
                  <option value="A4">A4 (210×297mm)</option>
                  <option value="A6">A6 (105×148mm)</option>
                  <option value="A7">A7 (74×105mm)</option>
                </select>

                <!-- Custom Inputs -->
                <div
                  v-if="localBadgeSizePreset === 'custom'"
                  class="mt-2 space-y-2"
                >
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >Width (mm)</label
                    >
                    <input
                      v-model.number="localCustomWidth"
                      type="number"
                      min="50"
                      max="300"
                      class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700"
                      >Height (mm)</label
                    >
                    <input
                      v-model.number="localCustomHeight"
                      type="number"
                      min="50"
                      max="300"
                      class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Orientation Inline -->
            <div v-if="localBadgeSizePreset === 'preset'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700"
                >Orientation</label
              >
              <div class="flex items-center gap-6 mt-2">
                <label class="flex items-center">
                  <input
                    v-model="localBadgeOrientation"
                    type="radio"
                    value="portrait"
                    class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                  />
                  <span class="ml-2 text-sm text-gray-700">Portrait</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="localBadgeOrientation"
                    type="radio"
                    value="landscape"
                    class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                  />
                  <span class="ml-2 text-sm text-gray-700">Landscape</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Preview Panel -->
          <div class="border-l pl-6 flex flex-col items-center">
            <h4 class="text-sm font-medium text-gray-700 mb-1">Preview</h4>
            <div class="text-sm text-gray-500 mb-2">
              Badge Size - {{ localBadgeSize }}
            </div>

            <!-- Transition Wrapper -->
            <transition name="fade-scale" mode="out-in">
              <div
                :key="localBadgeOrientation"
                class="relative transition-all duration-300"
              >
                <!-- Badge Box -->
                <div
                  class="rounded-md border border-gray-300 relative bg-white"
                  style="width: 150px; height: 210px"
                  v-if="localBadgeOrientation === 'portrait'"
                >
                  <div class="flex flex-col justify-between h-full p-4">
                    <!-- Top Icon -->
                    <div class="flex justify-center">
                      <Icon name="mdi:city" class="text-gray-400 text-2xl" />
                    </div>

                    <!-- Middle Lines -->
                    <div class="flex flex-col items-center space-y-2">
                      <div class="w-28 h-2 bg-gray-400 rounded"></div>
                      <div class="w-20 h-1.5 bg-gray-400 rounded"></div>
                      <div class="w-32 h-2 bg-gray-400 rounded"></div>
                      <div class="w-16 h-1.5 bg-gray-400 rounded"></div>
                    </div>

                    <!-- Bottom Row -->
                    <div class="flex justify-center items-end mt-auto">
                      <div
                        class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center"
                      >
                        <Icon name="mdi:qrcode" class="text-gray-500 text-xl" />
                      </div>
                    </div>
                  </div>

                  <!-- Dimensions Labels -->
                  <div
                    class="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500"
                  >
                    {{
                      localBadgeSizePreset === "custom"
                        ? `${localCustomWidth}.0mm`
                        : getWidthLabel()
                    }}
                  </div>
                  <div
                    class="absolute -right-6 top-0 bottom-0 flex items-center text-xs text-gray-500 writing-mode-vertical-rl"
                  >
                    {{
                      localBadgeSizePreset === "custom"
                        ? `${localCustomHeight}.0mm`
                        : getHeightLabel()
                    }}
                  </div>
                </div>
                <div
                  class="rounded-md border border-gray-300 relative bg-white"
                  style="width: 210px; height: 150px"
                  v-if="localBadgeOrientation === 'landscape'"
                >
                  <div class="flex flex-col justify-between h-full p-4">
                    <!-- Top Icon -->
                    <div class="flex justify-center">
                      <Icon name="mdi:city" class="text-gray-400 text-2xl" />
                    </div>

                    <!-- Middle Lines -->
                    <div class="flex flex-col items-center space-y-2">
                      <div class="w-28 h-2 bg-gray-400 rounded"></div>
                      <div class="w-20 h-1.5 bg-gray-400 rounded"></div>
                      <div class="w-32 h-2 bg-gray-400 rounded"></div>
                      <div class="w-16 h-1.5 bg-gray-400 rounded"></div>
                    </div>

                    <!-- Bottom Row -->
                    <div class="flex justify-end items-end mt-auto">
                      <div
                        class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center"
                      >
                        <Icon name="mdi:qrcode" class="text-gray-500 text-xl" />
                      </div>
                    </div>
                  </div>

                  <!-- Dimensions Labels -->
                  <div
                    class="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500"
                  >
                    {{
                      localBadgeSizePreset === "custom"
                        ? `${localCustomHeight}.0mm`
                        : getHeightLabel()
                    }}
                  </div>
                  <div
                    class="absolute -right-6 top-0 bottom-0 flex items-center text-xs text-gray-500 writing-mode-vertical-rl"
                  >
                    {{
                      localBadgeSizePreset === "custom"
                        ? `${localCustomWidth}.0mm`
                        : getWidthLabel()
                    }}
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="mt-6 flex justify-end space-x-3 border-t pt-4">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="save"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  badgeSizePreset: String,
  badgeSize: String,
  badgeOrientation: String,
  customWidth: Number,
  customHeight: Number,
});

const emit = defineEmits([
  "update:badgeSizePreset",
  "update:badgeSize",
  "update:badgeOrientation",
  "update:customWidth",
  "update:customHeight",
  "close",
  "save",
]);

const localBadgeSizePreset = ref(props.badgeSizePreset);
const localBadgeSize = ref(props.badgeSize);
const localBadgeOrientation = ref(props.badgeOrientation);
const localCustomWidth = ref(props.customWidth);
const localCustomHeight = ref(props.customHeight);

const getWidthLabel = () => {
  if (localBadgeSizePreset.value === "preset") {
    switch (localBadgeSize.value) {
      case "A7":
        return localBadgeOrientation.value === "landscape"
          ? "105.0mm"
          : "74.0mm";
      case "A6":
        return localBadgeOrientation.value === "landscape"
          ? "148.0mm"
          : "105.0mm";
      case "A4":
      default:
        return localBadgeOrientation.value === "landscape"
          ? "297.0mm"
          : "210.0mm";
    }
  }
  return "0.0mm"; // Default case for custom
};

const getHeightLabel = () => {
  if (localBadgeSizePreset.value === "preset") {
    switch (localBadgeSize.value) {
      case "A7":
        return localBadgeOrientation.value === "landscape"
          ? "74.0mm"
          : "105.0mm";
      case "A6":
        return localBadgeOrientation.value === "landscape"
          ? "105.0mm"
          : "148.0mm";
      case "A4":
      default:
        return localBadgeOrientation.value === "landscape"
          ? "210.0mm"
          : "297.0mm";
    }
  }
  return "0.0mm"; // Default case for custom
};

watch(
  () => props.badgeSizePreset,
  (val) => (localBadgeSizePreset.value = val)
);
watch(
  () => props.badgeSize,
  (val) => (localBadgeSize.value = val)
);
watch(
  () => props.badgeOrientation,
  (val) => (localBadgeOrientation.value = val)
);
watch(
  () => props.customWidth,
  (val) => (localCustomWidth.value = val)
);
watch(
  () => props.customHeight,
  (val) => (localCustomHeight.value = val)
);

watch(localBadgeSizePreset, (val) => emit("update:badgeSizePreset", val));
watch(localBadgeSize, (val) => emit("update:badgeSize", val));
watch(localBadgeOrientation, (val) => emit("update:badgeOrientation", val));
watch(localCustomWidth, (val) => emit("update:customWidth", val));
watch(localCustomHeight, (val) => emit("update:customHeight", val));

const save = () => {
  emit("save");
};
</script>

<style scoped>
.flip-enter-active {
  transition: all 0.6s ease;
}
.flip-leave-active {
  transition: all 0.3s ease;
}
.flip-enter-from,
.flip-leave-to {
  opacity: 0;
}
.flip-enter-from .modal-content,
.flip-leave-to .modal-content {
  transform: rotateY(180deg);
}
.flip-enter-to .modal-content,
.flip-leave-from .modal-content {
  transform: rotateY(0deg);
}
.writing-mode-vertical-rl {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
</style>
