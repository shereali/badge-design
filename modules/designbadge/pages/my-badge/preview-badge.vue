<template>
  <div
    class="flex flex-col md:flex-row h-screen bg-gray-100 sm:overflow-y-auto"
  >
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col items-center p-4 order-2 md:order-1">
      <!-- Top Controls -->
      <div class="w-full">
        <div
          class="flex flex-wrap items-center justify-center md:justify-between gap-3 w-full"
        >
          <button
            @click="downloadPDF"
            class="flex gap-1 border border-slate-300 px-5 py-2 text-sm bg-white text-red-500 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Icon name="tdesign:file-pdf" class="text-xl" />
            <span>Download</span>
          </button>

          <!-- Side Tabs -->
          <div
            class="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm ml-12"
          >
            <button
              class="px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              :class="{
                'bg-blue-500 text-white': store.activeSide === 'front',
                'bg-gray-200 text-gray-700 hover:bg-gray-300':
                  store.activeSide !== 'front',
              }"
              @click="switchSideTab('front')"
              :disabled="isFlipping"
            >
              Front
            </button>
            <button
              class="px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              :class="{
                'bg-blue-500 text-white': store.activeSide === 'back',
                'bg-gray-200 text-gray-700 hover:bg-gray-300':
                  store.activeSide !== 'back',
              }"
              @click="switchSideTab('back')"
              :disabled="isFlipping"
            >
              Back
            </button>
          </div>
          <!-- Zoom & Grid Controls -->
          <div
            class="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm"
          >
            <button
              class="w-9 h-9 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
              @click="zoom(-10)"
            >
              <Icon name="mdi:minus" class="w-4 h-4" />
            </button>
            <span
              class="w-12 h-9 flex items-center justify-center bg-gray-100 rounded text-sm font-medium"
            >
              {{ zoomLevel }}%
            </span>
            <button
              class="w-9 h-9 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
              @click="zoom(10)"
            >
              <Icon name="mdi:plus" class="w-4 h-4" />
            </button>
            <button
              class="w-9 h-9 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
              :class="{ 'text-blue-500 bg-white': showGrid }"
              @click="toggleGrid"
            >
              <Icon name="mdi:grid" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <!-- Design Page -->
      <div
        class="flex-1 w-full flex justify-center items-start overflow-auto mt-3 border-none"
      >
        <div
          ref="designPageRef"
          class="design-page bg-white shadow-md rounded-lg border-none"
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
        >
          <div class="card w-full h-full relative">
            <div
              ref="frontRef"
              class="front w-full h-full absolute top-0 left-0 border-none"
            >
              <PreviewCanvas
                v-if="store.activeSide === 'front'"
                :modelValue="store.frontBoxes"
              />
            </div>
            <div
              ref="backRef"
              class="back w-full h-full absolute top-0 left-0 border-none"
            >
              <PreviewCanvas
                v-if="store.activeSide === 'back'"
                :modelValue="store.backBoxes"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBadgeEditor } from "@/composables/useBadgeEditor";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { usePageStore } from "@/stores/usePageStore";
import { ref, nextTick } from "vue";

// Initialize composable and stores
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
const router = useRouter();
const route = useRoute();

// Refs for DOM elements
const designPageRef = ref(null);
const frontRef = ref(null);
const backRef = ref(null);

// Access plugin utilities with fallback
const { $html2canvas, $jsPDF } = useNuxtApp();

// Function to preload images to ensure they are loaded before PDF generation
const preloadImages = async (boxes) => {
  const imagePromises = boxes
    .filter((box) => box.type === "img" && box.properties.src?.url)
    .map((box) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = box.properties.src.url;
        // img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () =>
          reject(new Error(`Failed to load image: ${box.properties.src.url}`));
      });
    });
  try {
    await Promise.all(imagePromises);
  } catch (error) {
    console.error("Image preload error:", error);
  }
};

// Function to download the design as PDF
const downloadPDF = async () => {
  try {
    if (!$html2canvas || !$jsPDF) {
      throw new Error(
        "PDF utilities not available. Ensure the PDF plugin is loaded."
      );
    }

    const pdf = new $jsPDF({
      // orientation:
      //   pageStore.presetWidth > pageStore.presetHeight
      //     ? "landscape"
      //     : "portrait",
      // unit: "mm",
      // format: [pageStore.presetWidth || 85.6, pageStore.presetHeight || 54],

      orientation:
        pageStore.presetWidth > pageStore.presetHeight
          ? "landscape"
          : "portrait",
      unit: "mm",
      format: [pageStore.presetWidth || 85.6, pageStore.presetHeight || 54],
      compress: true, // ✅ enable compression
    });

    // Helper function to capture a DOM element as canvas
    const captureElement = async (element, side) => {
      if (!element) return null;
      // Temporarily reset transform to avoid zoom scaling in PDF
      const originalTransform = element.style.transform;
      element.style.transform = "scale(1)";

      // Preload images for the given side
      const boxes = side === "front" ? store.frontBoxes : store.backBoxes;
      await preloadImages(boxes);

      const canvas = await $html2canvas(element, {
        scale: 3, // Higher resolution for better quality
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true, // Enable logging for debugging
        allowTaint: false, // Prevent tainted canvas issues
        onclone: (clonedDoc) => {
          // Ensure fonts are applied in the cloned document
          const textElements = clonedDoc.querySelectorAll(
            "h1, h2, h3, h4, h6, p, a, span"
          );
          textElements.forEach((el) => {
            const box = boxes.find(
              (b) =>
                b.id === parseInt(el.getAttribute("data-id")) ||
                b.text === el.innerText
            );
            if (box && box.properties) {
              el.style.fontSize =
                box.properties.fontSize && box.properties.fontSize !== "Auto"
                  ? `${box.properties.fontSize}px`
                  : el.style.fontSize;
              el.style.fontFamily = box.properties.font
                ? box.properties.font.includes(",")
                  ? box.properties.font
                  : `"${box.properties.font}", sans-serif`
                : el.style.fontFamily;
            }
          });
          // Remove borders from design page in cloned document
          const designPage = clonedDoc.querySelector(".design-page");
          if (designPage) {
            designPage.style.border = "none";
            designPage.style.boxShadow = "none";
            // designPage.style.backgroundColor = "#ffffff";
          }
        },
      });

      // Restore original transform
      element.style.transform = originalTransform;
      return canvas;
    };

    // Ensure both sides are rendered for capture
    const originalActiveSide = store.activeSide;
    let frontCanvas = null;
    let backCanvas = null;

    // Capture front side
    if (frontRef.value) {
      store.activeSide = "front";
      await nextTick();
      frontCanvas = await captureElement(frontRef.value, "front");
    }

    // Capture back side
    if (backRef.value) {
      store.activeSide = "back";
      await nextTick();
      backCanvas = await captureElement(backRef.value, "back");
    }

    // Restore original active side
    store.activeSide = originalActiveSide;
    await nextTick();

    // Add front side to PDF
    if (frontCanvas) {
      const imgData = frontCanvas.toDataURL("image/png");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pageStore.presetWidth || 85.6,
        pageStore.presetHeight || 54,
        undefined,
        "MEDIUM" // ✅ compress front side
      );
    }

    // Add back side to PDF
    if (backCanvas && store.backBoxes.length > 0) {
      pdf.addPage(
        [pageStore.presetWidth || 85.6, pageStore.presetHeight || 54],
        pageStore.presetWidth > pageStore.presetHeight
          ? "landscape"
          : "portrait"
      );
      const imgData = backCanvas.toDataURL("image/png");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pageStore.presetWidth || 85.6,
        pageStore.presetHeight || 54,
        undefined,
        "MEDIUM" // ✅ compress front side
      );
    }

    // console.log("frontCanvas:", store.frontBoxes);

    const fullName = store.frontBoxes.find(
      (box) => box.key === "full_name"
    )?.text;

    console.log("fullName type:", typeof fullName);

    const badgeName =
      fullName && fullName.trim() !== ""
        ? fullName.toLowerCase().replace(/\s+/g, "_")
        : `${Date.now()}`;

    // Save the PDF
    pdf.save(`${badgeName}-my-badges.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert(
      "Failed to generate PDF. Please ensure all images are accessible and try again."
    );
  }
};

// Encode
// const value = "9845793485";
// const encoded = btoa(value); // "OTg0NTc5MzQ4NQ=="

// // Decode
// const decoded = atob(encoded); // "9845793485"

// console.log(encoded, decoded);
</script>

<style scoped>
.design-page {
  border: none !important;
  box-shadow: none !important;
}
</style>
