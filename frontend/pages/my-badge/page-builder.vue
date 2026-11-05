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

          <!-- Export Dropdown -->
          <div class="relative" ref="exportDropdownRef">
            <button
              type="button"
              @click="isExportMenuOpen = !isExportMenuOpen"
              :disabled="isExporting"
              class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg shadow-sm transition focus:outline-none disabled:opacity-60"
            >
              <Icon v-if="isExporting" name="mdi:loading" class="animate-spin text-base text-indigo-600" />
              <Icon v-else name="mdi:download-outline" class="text-base text-indigo-600" />
              <span>Export</span>
              <Icon name="mdi:chevron-down" class="text-sm text-slate-400" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isExportMenuOpen"
              class="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1"
            >
              <div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Download Badge
              </div>
              <button
                type="button"
                @click="exportAs('pdf')"
                class="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition text-left"
              >
                <Icon name="mdi:file-pdf-box" class="text-lg text-red-500" />
                <div>
                  <div class="font-bold">PDF Document (.pdf)</div>
                  <div class="text-[10px] text-slate-400">Print-ready standard</div>
                </div>
              </button>
              <button
                type="button"
                @click="exportAs('png')"
                class="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition text-left"
              >
                <Icon name="mdi:file-image" class="text-lg text-blue-500" />
                <div>
                  <div class="font-bold">PNG Image (.png)</div>
                  <div class="text-[10px] text-slate-400">High-resolution lossless</div>
                </div>
              </button>
              <button
                type="button"
                @click="exportAs('jpg')"
                class="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition text-left"
              >
                <Icon name="mdi:file-jpg-box" class="text-lg text-emerald-500" />
                <div>
                  <div class="font-bold">JPG / JPEG Image (.jpg)</div>
                  <div class="text-[10px] text-slate-400">Standard web image</div>
                </div>
              </button>
            </div>
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

          <!-- Sidebar Collapse/Expand Toggle Button (Header) -->
          <button
            type="button"
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            class="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 transition"
            :title="isSidebarCollapsed ? 'Open Sidebar' : 'Collapse Sidebar'"
          >
            <Icon :name="isSidebarCollapsed ? 'mdi:page-layout-sidebar-right' : 'mdi:chevron-right'" class="text-lg" />
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

    <!-- Right Sidebar Container with Persistent Caret Button -->
    <div
      class="relative flex-shrink-0 transition-all duration-300 ease-in-out order-1 md:order-2 flex"
      :class="isSidebarCollapsed ? 'w-0' : 'w-full md:w-80'"
    >
      <!-- Always Visible Caret Toggle Button at the top-left of the sidebar -->
      <button
        type="button"
        @click="isSidebarCollapsed = !isSidebarCollapsed"
        class="absolute top-4 -left-3.5 z-40 w-7 h-7 bg-white text-slate-700 hover:text-indigo-600 border border-slate-300 rounded-full shadow-md flex items-center justify-center transition hover:scale-110 active:scale-95 focus:outline-none"
        :title="isSidebarCollapsed ? 'Open Sidebar (Expand)' : 'Collapse Sidebar'"
      >
        <Icon
          :name="isSidebarCollapsed ? 'mdi:chevron-left' : 'mdi:chevron-right'"
          class="text-lg"
        />
      </button>

      <!-- Sidebar Body -->
      <div
        class="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 overflow-y-auto flex flex-col h-full"
        :class="{ 'hidden md:hidden': isSidebarCollapsed }"
      >
        <!-- Top bar with explicit caret and label -->
        <div class="flex items-center justify-between px-3 pt-2.5 pb-1 border-b border-slate-100">
          <button
            type="button"
            @click="isSidebarCollapsed = true"
            class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 p-1 rounded hover:bg-slate-100 transition"
            title="Collapse Sidebar"
          >
            <Icon name="mdi:chevron-right" class="text-base" />
            <span>Collapse</span>
          </button>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Properties & Tools</span>
        </div>

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

const isSidebarCollapsed = ref(false);
const isExporting = ref(false);
const isExportMenuOpen = ref(false);
const exportDropdownRef = ref(null);

// Close export dropdown when clicking outside
if (process.client) {
  onMounted(() => {
    const handleOutsideClick = (e) => {
      if (
        exportDropdownRef.value &&
        !exportDropdownRef.value.contains(e.target)
      ) {
        isExportMenuOpen.value = false;
      }
    };
    window.addEventListener("click", handleOutsideClick);
    onUnmounted(() => {
      window.removeEventListener("click", handleOutsideClick);
    });
  });
}

const captureCanvas = async (side = store.activeSide) => {
  const { $html2canvas } = useNuxtApp();
  const html2canvasFn = $html2canvas || (await import("html2canvas")).default;
  const canvasEl = dropzone.value?.querySelector(".card") || dropzone.value;
  if (!canvasEl) return null;

  // Temporarily reset zoom transform on dropzone for clean 1:1 capture
  const originalTransform = dropzone.value.style.transform;
  dropzone.value.style.transform = "none";

  // Deselect element so handles and snap guides don't get exported
  store.selectedElement = null;

  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 80));

  try {
    const renderedCanvas = await html2canvasFn(canvasEl, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });
    return renderedCanvas;
  } finally {
    dropzone.value.style.transform = originalTransform;
  }
};

const exportAs = async (format) => {
  isExportMenuOpen.value = false;
  if (isExporting.value) return;
  isExporting.value = true;

  try {
    const title = (badgeTitle.value || "badge-design")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-");
    const canvas = await captureCanvas(store.activeSide);
    if (!canvas) {
      alert("Unable to capture badge canvas.");
      return;
    }

    if (format === "png") {
      const link = document.createElement("a");
      link.download = `${title}-${store.activeSide}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } else if (format === "jpg" || format === "jpeg") {
      const jpgCanvas = document.createElement("canvas");
      jpgCanvas.width = canvas.width;
      jpgCanvas.height = canvas.height;
      const ctx = jpgCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
      ctx.drawImage(canvas, 0, 0);

      const link = document.createElement("a");
      link.download = `${title}-${store.activeSide}.jpg`;
      link.href = jpgCanvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } else if (format === "pdf") {
      const { $jsPDF } = useNuxtApp();
      const jsPDFFn = $jsPDF || (await import("jspdf")).default;

      const widthMM = pageStore.presetWidth || 105;
      const heightMM = pageStore.presetHeight || 148;
      const orientation = widthMM > heightMM ? "landscape" : "portrait";

      const pdf = new jsPDFFn({
        orientation,
        unit: "mm",
        format: [widthMM, heightMM],
        compress: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      pdf.addImage(imgData, "JPEG", 0, 0, widthMM, heightMM);

      // If back side has content, capture and add page 2
      if (store.backBoxes && store.backBoxes.length > 0) {
        const prevSide = store.activeSide;
        store.activeSide = "back";
        await nextTick();
        const backCanvas = await captureCanvas("back");
        store.activeSide = prevSide;

        if (backCanvas) {
          pdf.addPage([widthMM, heightMM], orientation);
          const backImgData = backCanvas.toDataURL("image/jpeg", 0.98);
          pdf.addImage(backImgData, "JPEG", 0, 0, widthMM, heightMM);
        }
      }

      pdf.save(`${title}.pdf`);
    }
  } catch (err) {
    console.error("Export failed:", err);
    alert("Export failed: " + (err.message || err));
  } finally {
    isExporting.value = false;
  }
};
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
