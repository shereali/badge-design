<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col items-center p-4">
      <!-- Top Controls -->
      <div class="w-full flex justify-center">
        <button
          @click="downloadPDF"
          class="flex gap-1 border border-slate-200 px-5 py-2 text-sm bg-blue-200 text-blue-500 rounded-lg font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-blue-300"
        >
          <Icon name="tdesign:file-pdf" class="text-xl" />
          <span>Download</span>
        </button>
      </div>
      <!-- Design Pages -->
      <div
        class="flex-1 w-full flex flex-col items-center overflow-auto mt-3 space-y-4"
      >
        <!-- Front Side -->
        <div
          ref="frontPageRef"
          class="design-page bg-white shadow-md rounded-lg"
          :style="{
            width: `${pageStore.presetWidth}mm`,
            height: `${pageStore.presetHeight}mm`,
            minWidth: `${pageStore.presetWidth}mm`,
            minHeight: `${pageStore.presetHeight}mm`,
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center top',
          }"
        >
          <div class="card w-full h-full relative">
            <div
              ref="frontRef"
              class="front w-full h-full absolute top-0 left-0"
            >
              <PreviewCanvas :modelValue="store.frontBoxes" />
            </div>
          </div>
        </div>
        <!-- Back Side -->
        <div
          v-if="store.backBoxes.length > 0"
          ref="backPageRef"
          class="design-page bg-white shadow-md rounded-lg"
          :style="{
            width: `${pageStore.presetWidth}mm`,
            height: `${pageStore.presetHeight}mm`,
            minWidth: `${pageStore.presetWidth}mm`,
            minHeight: `${pageStore.presetHeight}mm`,
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center top',
          }"
        >
          <div class="card w-full h-full relative">
            <div ref="backRef" class="back w-full h-full absolute top-0 left-0">
              <PreviewCanvas :modelValue="store.backBoxes" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCanvasStore } from "@/stores/useCanvasStore";
import { usePageStore } from "@/stores/usePageStore";
import { ref, nextTick } from "vue";

const store = useCanvasStore();
const pageStore = usePageStore();
const { zoomScale } = useBadgeEditor();

const frontPageRef = ref(null);
const frontRef = ref(null);
const backPageRef = ref(null);
const backRef = ref(null);

const { $html2canvas, $jsPDF } = useNuxtApp();

// Proxy function to bypass CORS, skipping data and blob URLs
const proxyImage = async (url) => {
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  try {
    const response = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    );
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Failed to proxy image: ${url}`, error);
    return url; // Fallback
  }
};

// Preload images with proxy
const preloadImages = async (boxes) => {
  const imagePromises = boxes
    .filter((box) => {
      if (box.type === "img" || box.type === "background")
        return box.properties?.src?.url;
      if (box.type === "avatar") return box.text;
      return false;
    })
    .map(async (box) => {
      const url = box.type === "avatar" ? box.text : box.properties.src.url;
      const proxiedUrl = await proxyImage(url);
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = proxiedUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      });
    });
  await Promise.allSettled(imagePromises); // Use allSettled to continue even if some fail
};

// Calculate content dimensions
const getContentDimensions = (boxes) => {
  let maxWidth = pageStore.presetWidth || 85.6;
  let maxHeight = pageStore.presetHeight || 54;
  boxes.forEach((box) => {
    if (box.visible) {
      const boxRight = box.position.left + box.properties.size.width;
      const boxBottom = box.position.top + box.properties.size.height;
      maxWidth = Math.max(maxWidth, boxRight / 3.78);
      maxHeight = Math.max(maxHeight, boxBottom / 3.78);
    }
  });
  return { width: maxWidth, height: maxHeight };
};

// Download the design as PDF
const downloadPDF = async () => {
  try {
    if (!$html2canvas || !$jsPDF) {
      throw new Error("PDF utilities not available.");
    }

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

    // Capture a DOM element as canvas
    const captureElement = async (element, side) => {
      if (!element) return null;
      const originalTransform = element.style.transform;
      element.style.transform = "scale(1)";
      const boxes = side === "front" ? store.frontBoxes : store.backBoxes;
      await preloadImages(boxes);
      element.style.display = "block";
      element.style.visibility = "visible";

      const dimensions = side === "front" ? frontDimensions : backDimensions;
      const canvas = await $html2canvas(element, {
        scale: 3,
        backgroundColor: "#ffffff",
        width: dimensions.width * 3.78,
        height: dimensions.height * 3.78,
        onclone: async (clonedDoc) => {
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
              // Match the exact calculation from PreviewCanvas.vue's textStyles
              const calculatedSize = Math.max(
                12,
                Math.min(
                  48,
                  box.type === "p"
                    ? box.properties.size.height * 0.2
                    : box.properties.size.height * 0.4
                )
              );
              el.style.fontSize =
                box.properties.fontSize && box.properties.fontSize !== "Auto"
                  ? `${box.properties.fontSize}px`
                  : `${calculatedSize}px`;
              el.style.fontFamily = box.properties.font
                ? `"${box.properties.font}", sans-serif`
                : "poppins, sans-serif";
              el.style.lineHeight = "1.2";
              el.style.whiteSpace = "normal";
              el.style.wordBreak = "break-word";
              el.style.width = `${box.properties.size.width}px`;
              el.style.height = `${box.properties.size.height}px`;
              el.style.margin = "0";
              el.style.padding = "0";
            }
          });

          // Proxy images in the cloned document
          const images = clonedDoc.querySelectorAll("img");
          for (const img of images) {
            if (img.src) {
              img.src = await proxyImage(img.src);
              img.crossOrigin = "anonymous";
            }
          }

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

      element.style.transform = originalTransform;
      element.style.display = "";
      element.style.visibility = "";
      return canvas;
    };

    // Capture front side
    let frontCanvas = null;
    if (frontRef.value) {
      await nextTick();
      frontCanvas = await captureElement(frontRef.value, "front");
    }

    // Capture back side
    let backCanvas = null;
    if (hasBackSide && backRef.value) {
      await nextTick();
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

    // Add back side to PDF
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
    pdf.save(`${badgeName}-my-badges.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};
</script>

<style scoped>
.design-page {
  border: none !important;
  box-shadow: none !important;
  overflow: visible;
}
.card,
.front,
.back {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: visible;
}
</style>
