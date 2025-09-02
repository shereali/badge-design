<template>
  <div
    class="flex flex-col md:flex-row h-screen bg-gray-100 sm:overflow-y-auto"
  >
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col items-center p-4 order-2 md:order-1">
      <!-- Top Controls -->
      <div class="w-full">
        <div class="flex items-center justify-center gap-3 w-full">
          <button
            @click="downloadPDF"
            class="flex gap-1 border border-slate-200 px-5 py-2 text-sm bg-blue-200 text-blue-500 rounded-lg font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-blue-300"
          >
            <Icon name="tdesign:file-pdf" class="text-xl" />
            <span>Download</span>
          </button>
        </div>
      </div>
      <!-- Design Pages -->
      <div
        class="flex-1 w-full flex flex-col items-center overflow-auto mt-3 border-none space-y-4"
      >
        <!-- Front Side -->
        <div
          ref="frontPageRef"
          class="design-page bg-white shadow-md rounded-lg border-none"
          :style="{
            width: `${pageStore.presetWidth}mm`,
            height: `${pageStore.presetHeight}mm`,
            minWidth: `${pageStore.presetWidth}mm`,
            minHeight: `${pageStore.presetHeight}mm`,
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center top',
          }"
          :class="{ 'grid-overlay': showGrid }"
        >
          <div class="card w-full h-full relative">
            <div
              ref="frontRef"
              class="front w-full h-full absolute top-0 left-0 border-none"
            >
              <PreviewCanvas :modelValue="store.frontBoxes" />
            </div>
          </div>
        </div>
        <!-- Back Side -->
        <div
          v-if="store.backBoxes.length > 0"
          ref="backPageRef"
          class="design-page bg-white shadow-md rounded-lg border-none"
          :style="{
            width: `${pageStore.presetWidth}mm`,
            height: `${pageStore.presetHeight}mm`,
            minWidth: `${pageStore.presetWidth}mm`,
            minHeight: `${pageStore.presetHeight}mm`,
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center top',
          }"
          :class="{ 'grid-overlay': showGrid }"
        >
          <div class="card w-full h-full relative">
            <div
              ref="backRef"
              class="back w-full h-full absolute top-0 left-0 border-none"
            >
              <PreviewCanvas :modelValue="store.backBoxes" />
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

// Refs for DOM elements
const frontPageRef = ref(null);
const frontRef = ref(null);
const backPageRef = ref(null);
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

// Function to calculate content dimensions
const getContentDimensions = (boxes) => {
  let maxWidth = pageStore.presetWidth || 85.6;
  let maxHeight = pageStore.presetHeight || 54;
  boxes.forEach((box) => {
    if (box.visible) {
      const boxRight = box.position.left + box.properties.size.width;
      const boxBottom = box.position.top + box.properties.size.height;
      maxWidth = Math.max(maxWidth, boxRight / 3.78); // Convert px to mm
      maxHeight = Math.max(maxHeight, boxBottom / 3.78); // Convert px to mm
    }
  });
  return { width: maxWidth, height: maxHeight };
};

// Function to download the design as PDF
const downloadPDF = async () => {
  try {
    if (!$html2canvas || !$jsPDF) {
      throw new Error(
        "PDF utilities not available. Ensure the PDF plugin is loaded."
      );
    }

    // Determine PDF dimensions based on content
    const frontDimensions = getContentDimensions(store.frontBoxes);
    const backDimensions =
      store.backBoxes.length > 0
        ? getContentDimensions(store.backBoxes)
        : { width: 0, height: 0 };
    const hasBackSide = store.backBoxes.length > 0;
    const pdfWidth = Math.max(
      pageStore.presetWidth || 85.6,
      frontDimensions.width,
      backDimensions.width
    );
    const pdfHeight = hasBackSide
      ? Math.max(pageStore.presetHeight || 54, frontDimensions.height) * 2 + 10
      : Math.max(pageStore.presetHeight || 54, frontDimensions.height);

    const pdf = new $jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
      compress: true,
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

      // Ensure the element is visible for capture
      element.style.display = "block";
      element.style.visibility = "visible";

      const dimensions = side === "front" ? frontDimensions : backDimensions;
      const canvas = await $html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true,
        allowTaint: false,
        width: dimensions.width * 3.78, // Convert mm to pixels (1mm ≈ 3.78px at 96 DPI)
        height: dimensions.height * 3.78,
        onclone: (clonedDoc) => {
          // Ensure fonts and text styles are applied
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
                  : el.style.fontSize ||
                    `${Math.max(12, box.properties.size.height * 0.2)}px`;
              el.style.fontFamily = box.properties.font
                ? box.properties.font.includes(",")
                  ? box.properties.font
                  : `"${box.properties.font}", sans-serif`
                : el.style.fontFamily || "poppins, sans-serif";
              el.style.lineHeight = "1.2"; // Set a tight line height to avoid extra spacing
              el.style.whiteSpace = "normal";
              el.style.wordBreak = "break-word";
              el.style.overflow = "visible";
              el.style.width = `${box.properties.size.width}px`;
              el.style.height = `${box.properties.size.height}px`;
              el.style.margin = "0"; // Remove any margins that might add spacing
              el.style.padding = "0"; // Remove any padding that might add spacing
            }
          });
          // Remove borders and adjust design page
          const designPage = clonedDoc.querySelector(".design-page");
          if (designPage) {
            designPage.style.border = "none";
            designPage.style.boxShadow = "none";
            designPage.style.width = `${dimensions.width}mm`;
            designPage.style.height = `${dimensions.height}mm`;
            designPage.style.minWidth = `${dimensions.width}mm`;
            designPage.style.minHeight = `${dimensions.height}mm`;
            designPage.style.overflow = "visible";
          }
          const card = clonedDoc.querySelector(".card");
          if (card) {
            card.style.width = `${dimensions.width}mm`;
            card.style.height = `${dimensions.height}mm`;
            card.style.overflow = "visible";
          }
        },
      });

      // Restore original transform and styles
      element.style.transform = originalTransform;
      element.style.display = "";
      element.style.visibility = "";
      return canvas;
    };

    // Capture front side
    let frontCanvas = null;
    if (frontRef.value) {
      await nextTick(); // Ensure DOM is updated
      frontCanvas = await captureElement(frontRef.value, "front");
    }

    // Capture back side only if it has content
    let backCanvas = null;
    if (hasBackSide && backRef.value) {
      await nextTick(); // Ensure DOM is updated
      backCanvas = await captureElement(backRef.value, "back");
    }

    // Add front side to PDF
    if (frontCanvas) {
      const imgData = frontCanvas.toDataURL("image/png");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        frontDimensions.width,
        frontDimensions.height,
        undefined,
        "MEDIUM"
      );
    }

    // Add back side to PDF only if it has content
    if (backCanvas) {
      const imgData = backCanvas.toDataURL("image/png");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        frontDimensions.height + 10,
        backDimensions.width,
        backDimensions.height,
        undefined,
        "MEDIUM"
      );
    }

    const fullName = store.frontBoxes.find(
      (box) => box.key === "full_name"
    )?.text;
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
</script>

<style scoped>
.design-page {
  border: none !important;
  box-shadow: none !important;
  overflow: visible; /* Allow content to be fully captured */
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: visible; /* Ensure no clipping */
}
.front,
.back {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible; /* Prevent text clipping */
}
</style>
