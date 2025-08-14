<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Design Area -->
    <div class="flex-1 flex flex-col items-center p-4">
      <!-- Top Controls -->
      <div class="flex flex-col items-center w-full">
        <!-- Side Tabs -->
        <div class="max-w-xs w-full">
          <div class="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              class="flex-1 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              :class="{
                'bg-blue-500 text-white': store.activeSide === 'front',
                'bg-gray-200 text-gray-700 hover:bg-gray-300':
                  store.activeSide !== 'front',
                'rounded-l-sm': true,
              }"
              @click="switchSideTab('front')"
              :disabled="isFlipping"
            >
              Front Side
            </button>
            <button
              class="flex-1 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              :class="{
                'bg-blue-500 text-white': store.activeSide === 'back',
                'bg-gray-200 text-gray-700 hover:bg-gray-300':
                  store.activeSide !== 'back',
                'rounded-r-sm': true,
              }"
              @click="switchSideTab('back')"
              :disabled="isFlipping"
            >
              Back Side
            </button>
          </div>
        </div>
        <!-- Zoom and Grid Controls -->
        <div class="flex justify-end space-x-2 w-full">
          <button
            class="p-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            @click="zoom(-10)"
          >
            <Icon name="mdi:minus" class="w-4 h-4" />
          </button>
          <span class="px-2 py-1 bg-gray-200 rounded text-sm"
            >{{ zoomLevel }}%</span
          >
          <button
            class="p-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            @click="zoom(10)"
          >
            <Icon name="mdi:plus" class="w-4 h-4" />
          </button>
          <button
            class="p-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            :class="{ 'bg-blue-500 text-white': showGrid }"
            @click="toggleGrid"
          >
            <Icon name="mdi:grid" class="w-4 h-4" />
          </button>
        </div>
      </div>
      <!-- Design Page Wrapper -->
      <div class="flex-1 w-full flex justify-center items-start overflow-auto">
        <div
          ref="dropzone"
          class="design-page bg-white"
          :style="{
            width: '105mm',
            height: '148mm',
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center top',
          }"
          :class="{
            'grid-overlay': showGrid,
            flipped: store.activeSide === 'back',
          }"
          @dragover.prevent
          @drop="handleDrop"
        >
          <div class="card w-full h-full">
            <div
              class="front border border-gray-300 w-full h-full absolute top-0 left-0"
            >
              <Canvas
                v-if="store.activeSide === 'front'"
                :modelValue="store.frontBoxes"
              />
            </div>
            <div
              class="back border border-gray-300 w-full h-full absolute top-0 left-0"
            >
              <Canvas
                v-if="store.activeSide === 'back'"
                :modelValue="store.backBoxes"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Sidebar -->
    <Sidebar
      :selected-element="store.selectedElement"
      :selected-element-type="selectedElementType"
      :layers="layers"
      :selected-layer="selectedLayer"
      :current-properties="store.currentProperties"
      :display-option="displayOption"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
    />
    <ImageUploadModal
      v-if="store.showImageModal"
      :side="store.pendingImageSide"
      @uploaded="handleImageUploaded"
      @close="store.showImageModal = false"
    />
  </div>
</template>

<script setup>
import { useCanvasStore } from "@/stores/useCanvasStore";
import { usePageStore } from "@/stores/usePageStore";

const pageStore = usePageStore();
const store = useCanvasStore();
const dropzone = ref(null);
const zoomLevel = ref(100);
const showGrid = ref(false);
const isFlipping = ref(false);
const zoomScale = computed(() => zoomLevel.value / 100);
const selectedLayer = ref(null);
const layers = ref([]);
const displayOption = ref("both sides");
//pageStore.saveBadgeConfig();
console.log("show modal", pageStore.showModal);

onMounted(() => {
  store.dropzone = dropzone.value;
});

const switchSideTab = (side) => {
  if (isFlipping.value || store.activeSide === side) return;
  isFlipping.value = true;
  store.activeSide = side;
  setTimeout(() => (isFlipping.value = false), 600);
};

const zoom = (delta) => {
  zoomLevel.value = Math.max(50, Math.min(200, zoomLevel.value + delta));
};

const toggleGrid = () => (showGrid.value = !showGrid.value);

const onDragStart = (item) => {
  // Prepare for drag
};

const onDragEnd = ({ item, x, y }) => {
  const rect = dropzone.value.getBoundingClientRect();
  const dropXPos = x - rect.left;
  const dropYPos = y - rect.top;
  store.addElementFromDrag(item, { top: dropYPos, left: dropXPos });
};

const handleDrop = (event) => {
  event.preventDefault();
};

const handleImageUploaded = (dataUrl) => {
  store.handleImageUploaded(dataUrl);
  store.showImageModal = false;
};

const selectedElementType = computed(() => {
  const element = store.boxes.find((e) => e.id === store.selectedElement);
  return element ? element.type : null;
});

watch(
  [() => store.activeSide, () => store.frontBoxes, () => store.backBoxes],
  () => {
    layers.value = store.boxes.map((box) => ({
      id: box.id,
      name: box.label,
      type: box.type,
      visible: box.visible ?? true,
    }));
    selectedLayer.value = store.selectedElement;
  },
  { deep: true }
);
</script>

<style scoped>
.design-page {
  position: relative;
  width: 794px;
  height: 1123px;
}
.card {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
}

.design-page.flipped .card {
  transform: rotateY(180deg);
}

.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
}

.grid-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
      to right,
      rgba(156, 163, 175, 0.2) 0px,
      rgba(156, 163, 175, 0.2) 1px,
      transparent 1px,
      transparent 20px
    ),
    repeating-linear-gradient(
      to bottom,
      rgba(156, 163, 175, 0.2) 0px,
      rgba(156, 163, 175, 0.2) 1px,
      transparent 1px,
      transparent 20px
    ),
    repeating-linear-gradient(
      to right,
      rgba(100, 100, 100, 0.5) 0px,
      rgba(100, 100, 100, 0.5) 1px,
      transparent 1px,
      transparent 100px
    ),
    repeating-linear-gradient(
      to bottom,
      rgba(100, 100, 100, 0.5) 0px,
      rgba(100, 100, 100, 0.5) 1px,
      transparent 1px,
      transparent 100px
    );
  background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px;
  pointer-events: none;
  z-index: 10;
}
</style>
