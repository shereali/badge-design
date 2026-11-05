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

          <NuxtLink
            to="/profile"
            class="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition"
            title="My Profile & Subscription Plan"
          >
            <Icon name="mdi:account-cog-outline" class="text-sm text-indigo-600" />
            <span>Profile</span>
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

        <!-- Right Controls: Undo/Redo, Zoom, Grid & Save -->
        <div class="flex items-center gap-2">
          <!-- Undo / Redo Controls -->
          <div class="flex items-center space-x-0.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              class="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              @click="store.undo()"
              :disabled="!store.canUndo"
              title="Undo (Ctrl+Z)"
            >
              <Icon name="mdi:undo" class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              @click="store.redo()"
              :disabled="!store.canRedo"
              title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
            >
              <Icon name="mdi:redo" class="w-4 h-4" />
            </button>
          </div>

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

          <!-- Auto-Save Status Badge -->
          <div class="hidden sm:flex items-center text-xs">
            <span
              v-if="autoSaveStatus === 'saving'"
              class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1.5 rounded-lg shadow-sm"
            >
              <Icon name="mdi:cloud-sync-outline" class="animate-spin text-sm" />
              <span>Auto-saving...</span>
            </span>
            <span
              v-else-if="autoSaveStatus === 'saved'"
              class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg shadow-sm"
            >
              <Icon name="mdi:cloud-check-outline" class="text-sm text-emerald-600" />
              <span>All changes saved</span>
            </span>
            <span
              v-else-if="autoSaveStatus === 'pending'"
              class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg shadow-sm"
            >
              <Icon name="mdi:cloud-upload-outline" class="text-sm text-amber-600" />
              <span>Unsaved changes</span>
            </span>
          </div>

          <!-- Save Button -->
          <button
            @click="sendData(false)"
            :disabled="loading"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-300 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
          >
            <Icon v-if="loading" name="mdi:loading" class="animate-spin text-base" />
            <Icon v-else name="mdi:content-save-outline" class="text-base" />
            <span>Save</span>
          </button>

          <!-- Direct Builder Logout Button -->
          <button
            type="button"
            @click="handleBuilderLogout"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 hover:border-red-300 text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Log Out"
          >
            <Icon name="mdi:logout" class="text-base" />
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

    <!-- Right Sidebar Container with Single Perfectly-Positioned Collapse Toggle -->
    <div
      class="relative flex-shrink-0 transition-all duration-300 ease-in-out order-1 md:order-2 flex h-full"
      :class="isSidebarCollapsed ? 'w-0' : 'w-full md:w-80'"
    >
      <!-- Perfectly Positioned Caret Button Attached to Sidebar Left Border -->
      <button
        type="button"
        @click="isSidebarCollapsed = !isSidebarCollapsed"
        class="absolute top-5 -left-3.5 z-40 w-7 h-7 bg-white text-slate-700 hover:text-indigo-600 border border-slate-300 rounded-full shadow-md flex items-center justify-center transition hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
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
import { useAuthStore } from "@/stores/useAuthStore";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { usePageStore } from "@/stores/usePageStore";

const authStore = useAuthStore();
const handleBuilderLogout = () => authStore.logout();

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
  autoSaveStatus,
  lastSavedAt,

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

// Keyboard shortcuts (Undo: Ctrl+Z / Cmd+Z, Redo: Ctrl+Y / Ctrl+Shift+Z / Cmd+Shift+Z)
if (process.client) {
  onMounted(() => {
    const handleKeydown = (e) => {
      const target = e.target;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      const isMac =
        typeof navigator !== "undefined" &&
        /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && !e.altKey) {
        // Redo: Ctrl+Y or Ctrl+Shift+Z (Cmd+Shift+Z on Mac)
        if (
          (e.key.toLowerCase() === "y" && !e.shiftKey) ||
          (e.key.toLowerCase() === "z" && e.shiftKey)
        ) {
          if (!isInput && store.canRedo) {
            e.preventDefault();
            store.redo();
          }
        }
        // Undo: Ctrl+Z (Cmd+Z on Mac)
        else if (e.key.toLowerCase() === "z" && !e.shiftKey) {
          if (!isInput && store.canUndo) {
            e.preventDefault();
            store.undo();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    onUnmounted(() => {
      window.removeEventListener("keydown", handleKeydown);
    });
  });
}

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
  if (!dropzone.value) return null;

  // 1. Ensure all fonts are completely loaded before capturing
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch (_) {}
  }

  // 2. Deselect element so handles and snap guides don't get exported
  store.selectedElement = null;

  const cardEl = dropzone.value.querySelector(".card");
  const backEl = dropzone.value.querySelector(".back");

  // Temporarily reset zoom transform & transitions on dropzone and card for clean 1:1 capture
  const originalDropzoneTransform = dropzone.value.style.transform;
  const originalDropzoneTransition = dropzone.value.style.transition;
  const originalCardTransform = cardEl ? cardEl.style.transform : "";
  const originalCardTransition = cardEl ? cardEl.style.transition : "";
  const originalBackTransform = backEl ? backEl.style.transform : "";

  dropzone.value.style.transition = "none";
  dropzone.value.style.transform = "none";
  if (cardEl) {
    cardEl.style.transition = "none";
    cardEl.style.transform = "none";
  }

  // If capturing back side, temporarily reset .back 3D rotation so it renders flat
  if (side === "back" && backEl) {
    backEl.style.transform = "none";
  }

  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 120));

  // Ensure all images are loaded before rasterizing
  const imgs = Array.from(dropzone.value.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((res) => {
        img.onload = res;
        img.onerror = res;
        setTimeout(res, 500);
      });
    })
  );

  try {
    const widthMM = pageStore.presetWidth || 105;
    const heightMM = pageStore.presetHeight || 148;
    // Standard 96 DPI CSS conversion: 1mm = 96 / 25.4 px ≈ 3.779528px
    const targetW = Math.round(widthMM * 3.779528);
    const targetH = Math.round(heightMM * 3.779528);

    const renderedCanvas = await html2canvasFn(dropzone.value, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      width: targetW,
      height: targetH,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      windowWidth: targetW,
      windowHeight: targetH,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedDropzone = clonedDoc.querySelector(".design-page");
        if (!clonedDropzone) return;

        // Reset all parent containers so clonedDropzone is completely unconstrained at (0, 0)
        let parent = clonedDropzone.parentElement;
        while (parent && parent !== clonedDoc.body) {
          parent.style.padding = "0";
          parent.style.margin = "0";
          parent.style.width = "auto";
          parent.style.minWidth = "0";
          parent.style.maxWidth = "none";
          parent.style.display = "block";
          parent.style.overflow = "visible";
          parent.style.position = "static";
          parent = parent.parentElement;
        }
        clonedDoc.body.style.padding = "0";
        clonedDoc.body.style.margin = "0";
        clonedDoc.body.style.width = `${targetW}px`;
        clonedDoc.body.style.height = `${targetH}px`;
        clonedDoc.body.style.overflow = "hidden";

        // Enforce exact 1:1 dimensions without any margins, shadows, or rounded corners on export
        clonedDropzone.style.position = "absolute";
        clonedDropzone.style.top = "0";
        clonedDropzone.style.left = "0";
        clonedDropzone.style.width = `${targetW}px`;
        clonedDropzone.style.height = `${targetH}px`;
        clonedDropzone.style.minWidth = `${targetW}px`;
        clonedDropzone.style.maxWidth = `${targetW}px`;
        clonedDropzone.style.minHeight = `${targetH}px`;
        clonedDropzone.style.maxHeight = `${targetH}px`;
        clonedDropzone.style.margin = "0";
        clonedDropzone.style.transform = "none";
        clonedDropzone.style.transition = "none";
        clonedDropzone.style.boxShadow = "none";
        clonedDropzone.classList.remove("grid-overlay", "flipped");

        const clonedCard = clonedDoc.querySelector(".card");
        if (clonedCard) {
          clonedCard.style.width = `${targetW}px`;
          clonedCard.style.height = `${targetH}px`;
          clonedCard.style.transform = "none";
          clonedCard.style.transition = "none";
        }

        const clonedFront = clonedDoc.querySelector(".front");
        if (clonedFront) {
          clonedFront.style.width = `${targetW}px`;
          clonedFront.style.height = `${targetH}px`;
          clonedFront.style.transform = "none";
        }

        const clonedBack = clonedDoc.querySelector(".back");
        if (clonedBack) {
          clonedBack.style.width = `${targetW}px`;
          clonedBack.style.height = `${targetH}px`;
          clonedBack.style.transform = "none";
        }

        // Hide grid overlay from export
        const grid = clonedDoc.querySelector(".grid-overlay");
        if (grid) grid.classList.remove("grid-overlay");

        // Ensure all text elements have strictly identical line-height and no UA margins
        const textElements = clonedDoc.querySelectorAll(
          "h1, h2, h3, h4, h6, p, span, a"
        );
        textElements.forEach((el) => {
          el.style.margin = "0";
          el.style.padding = "0";
          el.style.boxSizing = "border-box";
          if (!el.style.lineHeight || el.style.lineHeight === "normal") {
            el.style.lineHeight = "1.2";
          }
          el.style.outline = "none";
        });
      },
    });
    return renderedCanvas;
  } finally {
    dropzone.value.style.transform = originalDropzoneTransform;
    dropzone.value.style.transition = originalDropzoneTransition;
    if (cardEl) {
      cardEl.style.transform = originalCardTransform;
      cardEl.style.transition = originalCardTransition;
    }
    if (side === "back" && backEl) {
      backEl.style.transform = originalBackTransform;
    }
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
      link.href = jpgCanvas.toDataURL("image/jpeg", 0.98);
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

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, widthMM, heightMM, undefined, "SLOW");

      // If back side has content, capture and add page 2
      if (store.backBoxes && store.backBoxes.length > 0) {
        const prevSide = store.activeSide;
        store.activeSide = "back";
        await nextTick();
        const backCanvas = await captureCanvas("back");
        store.activeSide = prevSide;

        if (backCanvas) {
          pdf.addPage([widthMM, heightMM], orientation);
          const backImgData = backCanvas.toDataURL("image/png");
          pdf.addImage(backImgData, "PNG", 0, 0, widthMM, heightMM, undefined, "SLOW");
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
  box-sizing: border-box;
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
