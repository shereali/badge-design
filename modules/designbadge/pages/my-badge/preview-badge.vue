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
    .filter((box) => box.type === "img" || box.type === "avatar")
    .map((box) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = box.type === "avatar" ? box.text : box.properties.src.url;
        img.onload = () => resolve(img);
        img.onerror = () =>
          reject(
            new Error(
              `Failed to load image: ${
                box.type === "avatar" ? box.text : box.properties.src.url
              }`
            )
          );
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
        width: dimensions.width * 3.78,
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
              el.style.lineHeight = "1.2";
              el.style.whiteSpace = "normal";
              el.style.wordBreak = "break-word";
              el.style.overflow = "visible";
              el.style.width = `${box.properties.size.width}px`;
              el.style.height = `${box.properties.size.height}px`;
              el.style.margin = "0";
              el.style.padding = "0";
            }
          });

          // Apply avatar-specific styles
          const avatarElements = clonedDoc.querySelectorAll(
            'div[class*="overflow-hidden shadow-sm"][style*="position: absolute"]'
          );
          avatarElements.forEach((el) => {
            // Find the corresponding box by matching position and size
            const elStyle = window.getComputedStyle(el);
            const elLeft = parseFloat(elStyle.left);
            const elTop = parseFloat(elStyle.top);
            const elWidth = parseFloat(elStyle.width);
            const elHeight = parseFloat(elStyle.height);

            const box = boxes.find((b) => {
              return (
                b.type === "avatar" &&
                Math.abs(b.position.left - elLeft) < 1 &&
                Math.abs(b.position.top - elTop) < 1 &&
                Math.abs(b.properties.size.width - elWidth) < 1 &&
                Math.abs(b.properties.size.height - elHeight) < 1
              );
            });

            if (box && box.properties.avatar) {
              const avatar = box.properties.avatar;
              let styles = {
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f3f4f6",
                width: `${box.properties.size.width}px`,
                height: `${box.properties.size.height}px`,
              };

              // Handle shadow and ring
              let shadows = ["0 1px 2px 0 rgba(0, 0, 0, 0.05)"];
              if (avatar.showRing) {
                shadows.push("0 0 0 2px #ffffff");
                shadows.push("0 0 0 4px #9ca3af");
              }
              styles.boxShadow = shadows.join(", ");

              // Handle border
              if (avatar.showBorder) {
                styles.borderWidth = "1px";
                styles.borderStyle = "solid";
                styles.borderColor = "#d1d5db";
              }

              // Handle shape-specific styles
              switch (avatar.shape) {
                case "circle":
                  styles.borderRadius = "9999px";
                  break;
                case "rounded":
                  styles.borderRadius = `${avatar.radius}px`;
                  break;
                case "squircle":
                  styles.borderRadius = `${Math.min(
                    avatar.radius,
                    100
                  )}% / ${Math.min(avatar.radius + 10, 100)}%`;
                  break;
                case "diamond":
                  styles.clipPath = "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)";
                  break;
                case "hex":
                  styles.clipPath =
                    "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)";
                  break;
                case "triangle":
                  styles.clipPath = "polygon(50% 0, 0 100%, 100% 100%)";
                  break;
                case "blob":
                  styles.clipPath =
                    'path("M74.7 12.9c11.8 7.3 20.2 20 23 34.2 2.7 14.2-.3 29.9-8.6 39.8-8.3 9.9-21.8 14-35.6 12.2-13.8-1.7-27.8-10.3-35.1-22.8-7.3-12.5-7.8-28.8-2.5-41.4 5.3-12.6 16.4-21.5 28.4-25C56.2 6.6 68.9 5.7 74.7 12.9z")';
                  break;
                case "custom":
                  if (avatar.customClipPath) {
                    styles.clipPath = avatar.customClipPath;
                  }
                  break;
                default:
                  styles.borderRadius = `${avatar.radius}px`;
              }

              // Apply styles to the avatar container
              Object.assign(el.style, styles);

              // Ensure the image inside the avatar has correct styles
              const img = el.querySelector("img");
              if (img) {
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.display = "block";
                img.style.objectFit = "cover";
              }
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
  overflow: visible;
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: visible;
}
.front,
.back {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: visible;
}
</style>
