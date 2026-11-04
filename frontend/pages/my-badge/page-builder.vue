<template>
  <div class="flex flex-col md:flex-row h-screen bg-slate-100 overflow-hidden">
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col items-center p-3 sm:p-4 order-2 md:order-1 overflow-hidden">
      <!-- Top Controls Bar -->
      <header class="w-full bg-white rounded-xl shadow-sm border border-slate-200/80 p-2.5 sm:px-4 flex flex-wrap items-center justify-between gap-3">
        <!-- Left: Back Button & Title -->
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/my-badge"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition"
          >
            <Icon name="mdi:arrow-left" class="text-base" />
            <span>Badges</span>
          </NuxtLink>

          <div class="flex items-center gap-2">
            <input
              v-model="badgeTitle"
              type="text"
              placeholder="Badge Title..."
              class="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none px-1 py-0.5 max-w-[200px] sm:max-w-[280px]"
            />
          </div>
        </div>

        <!-- Center: Front / Back Side Switcher -->
        <div class="flex border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-slate-50">
          <button
            class="px-4 py-1.5 text-xs font-bold transition-colors"
            :class="{
              'bg-indigo-600 text-white shadow-sm': store.activeSide === 'front',
              'text-slate-600 hover:bg-slate-200': store.activeSide !== 'front',
            }"
            @click="switchSideTab('front')"
            :disabled="isFlipping"
          >
            Front Side
          </button>
          <button
            class="px-4 py-1.5 text-xs font-bold transition-colors"
            :class="{
              'bg-indigo-600 text-white shadow-sm': store.activeSide === 'back',
              'text-slate-600 hover:bg-slate-200': store.activeSide !== 'back',
            }"
            @click="switchSideTab('back')"
            :disabled="isFlipping"
          >
            Back Side
          </button>
        </div>

        <!-- Right Controls: Zoom, Grid & Save -->
        <div class="flex items-center gap-2">
          <!-- Zoom & Grid Controls -->
          <div class="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button
              class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded transition"
              @click="zoom(-10)"
              title="Zoom Out"
            >
              <Icon name="mdi:minus" class="w-4 h-4" />
            </button>
            <span class="w-10 text-center text-xs font-bold text-slate-700">
              {{ zoomLevel }}%
            </span>
            <button
              class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded transition"
              @click="zoom(10)"
              title="Zoom In"
            >
              <Icon name="mdi:plus" class="w-4 h-4" />
            </button>
            <button
              class="w-7 h-7 flex items-center justify-center rounded transition"
              :class="showGrid ? 'text-indigo-600 bg-white shadow-sm font-bold' : 'text-slate-500 hover:bg-white'"
              @click="toggleGrid"
              title="Toggle Grid Alignment"
            >
              <Icon name="mdi:grid" class="w-4 h-4" />
            </button>
          </div>

          <!-- Save Button -->
          <button
            @click="sendData"
            :disabled="loading"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-300 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
          >
            <Icon v-if="loading" name="mdi:loading" class="animate-spin text-base" />
            <Icon v-else name="mdi:content-save-outline" class="text-base" />
            <span>Save</span>
          </button>
        </div>
      </header>

      <!-- Design Canvas Dropzone Container -->
      <div class="flex-1 w-full flex justify-center items-start overflow-auto p-4 mt-2">
        <div
          ref="dropzone"
          class="design-page bg-white shadow-xl rounded-lg"
          :style="{
            width: `${pageStore.presetWidth}mm`,
            height: `${pageStore.presetHeight}mm`,
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
          <div class="card w-full h-full relative">
            <div class="front w-full h-full absolute top-0 left-0">
              <Canvas
                v-if="store.activeSide === 'front'"
                :modelValue="store.frontBoxes"
              />
            </div>
            <div class="back w-full h-full absolute top-0 left-0">
              <Canvas
                v-if="store.activeSide === 'back'"
                :modelValue="store.backBoxes"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar for Elements & Layers -->
    <div class="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 order-1 md:order-2 overflow-y-auto flex flex-col">
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
    </div>

    <!-- Modals -->
    <ImageUploadModal
      v-if="store.showImageModal"
      :side="store.pendingImageSide"
      @uploaded="handleImageUploaded"
      @close="store.showImageModal = false"
    />
    <GradientPickerModal
      v-if="store.showGradientModal"
      :show="store.showGradientModal"
      :side="store.activeSide"
      @selected="(gradient) => store.applyGradient(gradient, store.activeSide)"
      @close="store.showGradientModal = false"
    />
    <ColorPickerModal
      v-if="store.showColorModal"
      :show="store.showColorModal"
      :side="store.activeSide"
      @selected="(color) => store.applyColor(color, store.activeSide)"
      @close="store.showColorModal = false"
    />
    <BadgeOptionsModal />
    <QRCodeModal />
  </div>
</template>

<script setup>
import { useBadgeEditor } from "@/composables/useBadgeEditor";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { usePageStore } from "@/stores/usePageStore";

const {
  dropzone,
  zoomLevel,
  showGrid,
  isFlipping,
  zoomScale,
  selectedLayer,
  layers,
  displayOption,
  selectedElementType,
  badgeTitle,
  loading,

  sendData,
  switchSideTab,
  zoom,
  toggleGrid,
  onDragStart,
  onDragEnd,
  handleDrop,
  handleImageUploaded,
} = useBadgeEditor();

const store = useCanvasStore();
const pageStore = usePageStore();
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
