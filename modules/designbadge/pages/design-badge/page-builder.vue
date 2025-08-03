<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Design Area -->
    <div class="flex-1 flex flex-col items-center p-4">
      <!-- Top Controls -->
      <div class="flex flex-col items-center w-full mb-4">
        <!-- Side Tabs -->
        <div class="mb-4 max-w-xs w-full">
          <div class="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              class="flex-1 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              :class="{
                'bg-blue-500 text-white': activeSide === 'front',
                'bg-gray-200 text-gray-700 hover:bg-gray-300':
                  activeSide !== 'front',
                'rounded-l-md': true,
              }"
              @click="switchSideTab('front')"
              :disabled="isFlipping"
            >
              Front Side
            </button>
            <button
              class="flex-1 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              :class="{
                'bg-blue-500 text-white': activeSide === 'back',
                'bg-gray-200 text-gray-700 hover:bg-gray-300':
                  activeSide !== 'back',
                'rounded-r-md': true,
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
          class="design-page w-[400px] sm:w-[500px] h-[500px] sm:h-[600px] bg-white"
          :style="{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center top',
          }"
          :class="{ 'grid-overlay': showGrid, flipped: activeSide === 'back' }"
          @dragover.prevent
          @drop="handleDrop"
        >
          <div class="card w-full h-full">
            <div
              class="front border border-gray-300 w-full h-full absolute top-0 left-0"
            >
              <!-- <h3 class="text-lg font-semibold mb-4">Front Side</h3> -->
              <Canvas
                v-if="activeSide === 'front'"
                :modelValue="frontCanvas"
                :sendElement="sendElement"
                @addToFrontCanvas="frontCanvas.push($event)"
                @requestFrontImage="showFrontImageModal = true"
                @sendSelectedElement="receiveSelectElement"
              />
            </div>

            <div
              class="back border border-gray-300 w-full h-full absolute top-0 left-0"
            >
              <!-- <h3 class="text-lg font-semibold mb-4">Back Side</h3> -->
              <!-- Back -->
              <Canvas
                v-if="activeSide === 'back'"
                :modelValue="backCanvas"
                :sendElement="sendElement"
                @addToBackCanvas="backCanvas.push($event)"
                @requestBackImage="showBackImageModal = true"
                @sendSelectedElement="receiveSelectElement"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Sidebar -->
    <Sidebar
      :selected-element="selectedElement"
      :selected-element-type="selectedElementType"
      :layers="layers"
      :selected-layer="selectedLayer"
      :current-properties="currentProperties"
      :display-option="displayOption"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
      @align-horizontal="alignHorizontal"
      @align-vertical="alignVertical"
      @update-properties="updateProperties"
      @apply-text-style="applyTextStyle"
      @make-transparent="makeTransparent"
      @apply-color="applyColor"
      @apply-text-align="applyTextAlign"
      @apply-vertical-align="applyVerticalAlign"
      @apply-text-transform="applyTextTransform"
      @toggle-text-style="toggleTextStyle"
      @apply-display-option="applyDisplayOption"
      @select-layer="selectLayer"
      @toggle-layer-visibility="toggleLayerVisibility"
    />

    <ImageUploadModal
      v-if="showFrontImageModal"
      side="front"
      @uploaded="handleFrontImageUploaded"
      @close="showFrontImageModal = false"
    />

    <ImageUploadModal
      v-if="showBackImageModal"
      side="back"
      @uploaded="handleBackImageUploaded"
      @close="showBackImageModal = false"
    />
  </div>
</template>

<script setup>
import interact from "interactjs";

const props = defineProps({
  selectedElementId: {
    type: [String, Number],
    default: null,
  },
});

const frontCanvas = ref([]);
const backCanvas = ref([]);

const activeSide = ref("front");
const activeTab = ref("design");
const zoomLevel = ref(100);
const showGrid = ref(false);
const isFlipping = ref(false);
const dropzone = ref(null);

const elementType = ref(null);
const sendElement = ref({});

const dropX = ref(null);
const dropY = ref(null);

const showFrontImageModal = ref(false);
const showBackImageModal = ref(false);

const zoomScale = computed(() => zoomLevel.value / 100);

const switchSideTab = (side) => {
  if (isFlipping.value || activeSide.value === side) return;
  isFlipping.value = true;
  activeSide.value = side;
  setTimeout(() => {
    isFlipping.value = false;
  }, 600);
};

const switchTab = (tab) => {
  activeTab.value = tab;
};

const zoom = (delta) => {
  zoomLevel.value = Math.max(50, Math.min(200, zoomLevel.value + delta));
};

const toggleGrid = () => {
  showGrid.value = !showGrid.value;
};

// Prepare draggable items
const onDragStart = (tag) => {
  //   console.log("Dragging:", tag);
  //   sendElement.value = {
  //     tag: tag,
  //     side: activeSide.value,
  //   };
};

function handleDrop(event) {
  event.preventDefault();

  const canvasRect = dropzone.value.getBoundingClientRect();

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  dropX.value = mouseX - canvasRect.left;
  dropY.value = mouseY - canvasRect.top;

  // const element = props.sendElement;
  // if (!element || !element.tag) return;

  // const newElement = {
  //   ...element,
  //   position: { top: dropY, left: dropX }, // Accurate mouse-based position
  // };

  // createElement(newElement);
}

const onDragEnd = ({ item, x, y }) => {
  const rect = dropzone.value.getBoundingClientRect();

  const dropXPos = x - rect.left;
  const dropYPos = y - rect.top;

  sendElement.value = {
    item: item,
    side: activeSide.value,
    position: { top: dropYPos, left: dropXPos },
  };
};

function handleFrontImageUploaded(dataUrl) {
  frontCanvas.value.push({
    id: Date.now(),
    text: dataUrl,
    type: "img",
    label: `IMG Label`,
    position: { top: 100, left: 100 },
    size: { width: 250, height: 150 },
    rotation: 0,
    isSelected: false,
    isDragging: false,
    direction: "ltr",
  });
  showFrontImageModal.value = false;
}

function handleBackImageUploaded(dataUrl) {
  backCanvas.value.push({
    id: Date.now(),
    text: dataUrl,
    type: "img",
    label: `IMG Label`,
    position: { top: 100, left: 100 },
    size: { width: 250, height: 150 },
    rotation: 0,
    isSelected: false,
    isDragging: false,
    direction: "ltr",
  });
  showBackImageModal.value = false;
}

// Sidebar Functionality

// Canvas and elements
const canvas = ref(null);
const canvasSize = ref({ width: 210, height: 297 }); // A4 size in mm
const elements = ref([]);
const selectedElement = ref(null);
const selectedLayer = ref(null);
const layers = ref([]);
const displayOption = ref("both sides");
const currentProperties = ref({});

// Function to receive selected element from Canvas
const receiveSelectElement = (elementId) => {
  console.log("Received selected element:", elementId);
  selectedElement.value = elementId;
  // const element = elements.value.find((e) => e.id === elementId);
  // if (element) {
  //   selectedLayer.value = layers.value.findIndex(
  //     (layer) => layer.id === elementId
  //   );
  //   updateProperties();
  // } else {
  //   selectedLayer.value = null;
  //   currentProperties.value = {};
  // }
};

// Computed property to get the selected element type
const selectedElementType = computed(() => {
  if (selectedElement.value === null) return null;
  const element = frontCanvas.value.find((e) => e.id === selectedElement.value);
  console.log("Selected Element Type:", element.type);
  return element ? element.type : null;
});

// Element types
const elementTypeMap = {
  text: {
    properties: {
      x: 40.1,
      y: 130,
      width: 317,
      height: 55,
      rotation: 0,
      font: "Roboto",
      fontStyle: "Regular",
      fontSize: 16,
      color: "#000000",
      text: "",
      exampleText: "Sample Text",
      fillTransparency: false,
      textDecoration: "none",
      lock: false,
      fillColor: "#ffffff",
      textAlign: "left",
      verticalAlign: "top",
      textTransform: "none",
    },
  },
  image: {
    properties: {
      x: 148.5,
      y: 284,
      width: 100,
      height: 100,
      rotation: 0,
      src: "https://via.placeholder.com/150",
      lock: false,
      strokeColor: "#eb2f2f",
      strokeWidth: 1,
      associatedData: "User ID",
    },
  },
  qrcode: {
    properties: {
      x: 20.5,
      y: 25,
      width: 100,
      height: 100,
      rotation: 0,
      content: "https://example.com",
      size: 100,
      lock: false,
    },
  },
  line: {
    properties: {
      x: 0,
      y: 0,
      width: 100,
      height: 2,
      rotation: 0,
      color: "#000000",
      thickness: 2,
      lock: false,
    },
  },
  background: {
    properties: {
      x: 0,
      y: 0,
      width: 210,
      height: 297,
      rotation: 0,
      color: "#ffffff",
      lock: false,
    },
  },
  eventlogo: {
    properties: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      src: "https://via.placeholder.com/100",
      lock: false,
    },
  },
  useravatar: {
    properties: {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      rotation: 0,
      src: "https://via.placeholder.com/50",
      lock: false,
    },
  },
  punching_area: {
    properties: {
      x: 0,
      y: 0,
      width: 100,
      height: 20,
      rotation: 0,
      color: "#000000",
      lock: false,
    },
  },
};

const handleKeydown = (elementId, event) => {
  if (displayOption.value !== "right side only") return;
  const element = elements.value.find((e) => e.id === elementId);
  if (!element || element.type !== "text") return;

  // Handle space key
  if (event.key === " " || event.key === "Spacebar") {
    event.preventDefault(); // Prevent default space behavior
    const target = event.target;
    const text = target.textContent || "";
    target.textContent = text + " "; // Append space to the end
    element.properties.text = target.textContent; // Update element text
    currentProperties.value.text = target.textContent; // Update current properties

    // Move cursor to the end
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(target);
    range.collapse(false); // Collapse to the end
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

// Element management
const addElement = (type, x = 100, y = 100) => {
  const id = Date.now();
  const elementType = elementTypeMap[type];
  if (!elementType) return;

  const element = {
    id,
    type,
    properties: { ...elementType.properties, x, y },
  };

  elements.value.push(element);
  layers.value.push({
    id,
    name: `Layer ${layers.value.length + 1}`,
    type,
    visible: true,
    locked: false,
  });

  nextTick(() => setupInteract(element));
  return element;
};

const setupInteract = (element) => {
  const target = document.querySelector(`[data-element-id="${element.id}"]`);
  if (!target) return;

  interact(target)
    .draggable({
      enabled: !element.properties.lock,
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: canvas.value,
          endOnly: true,
        }),
      ],
      onmove: (event) => {
        if (element.properties.lock) return;
        const index = elements.value.findIndex((e) => e.id === element.id);
        if (index !== -1) {
          elements.value[index].properties.x += event.dx;
          elements.value[index].properties.y += event.dy;
          updateProperties();
        }
      },
    })
    .resizable({
      enabled: !element.properties.lock,
      edges: { left: true, right: true, bottom: true, top: true },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 10, height: 10 },
        }),
      ],
      onmove: (event) => {
        if (element.properties.lock) return;
        const index = elements.value.findIndex((e) => e.id === element.id);
        if (index !== -1) {
          elements.value[index].properties.width = event.rect.width;
          elements.value[index].properties.height = event.rect.height;
          elements.value[index].properties.x += event.deltaRect.left;
          elements.value[index].properties.y += event.deltaRect.top;
          updateProperties();
        }
      },
    })
    .on("tap", () => selectElement(element.id));
};

const selectElement = (elementId) => {
  console.log("Selecting element:", elementId);
  selectedElement.value = elementId;
  selectedLayer.value = layers.value.findIndex(
    (layer) => layer.id === elementId
  );
  updateProperties();
};

const selectLayer = (index) => {
  console.log("Selecting layer:", index);
  selectedLayer.value = index;
  selectedElement.value = layers.value[index].id;
  updateProperties();
};

const updateProperties = (newProperties = null) => {
  if (selectedElement.value === null) return;
  const element = elements.value.find((e) => e.id === selectedElement.value);
  if (!element) return;

  if (newProperties) {
    if (element.type === "text") {
      element.properties = {
        ...element.properties,
        ...newProperties,
        width: newProperties.w,
        height: newProperties.h,
        rotation: newProperties.r,
      };
    } else if (
      element.type === "image" ||
      element.type === "eventlogo" ||
      element.type === "useravatar"
    ) {
      element.properties = {
        ...element.properties,
        ...newProperties,
        width: newProperties.w,
        height: newProperties.h,
        rotation: newProperties.r,
      };
    } else if (element.type === "qrcode") {
      element.properties = {
        ...element.properties,
        ...newProperties,
        width: newProperties.w,
        height: newProperties.h,
        rotation: newProperties.r,
      };
    } else {
      element.properties = {
        ...element.properties,
        ...newProperties,
        width: newProperties.w,
        height: newProperties.h,
        rotation: newProperties.r,
      };
    }
  }

  if (element.type === "h1") {
    currentProperties.value = {
      x: element.properties.x || 40.1,
      y: element.properties.y || 130,
      w: element.properties.width || 317,
      h: element.properties.height || 55,
      r: element.properties.rotation || 0,
      font: element.properties.font || "Roboto",
      fontStyle: element.properties.fontStyle || "Regular",
      fontSize: element.properties.fontSize || 16,
      fillColor: element.properties.fillColor || "#ffffff",
      fillTransparency: element.properties.fillTransparency || false,
      text: element.properties.text || element.properties.exampleText || "",
      textDecoration: element.properties.textDecoration || "none",
      color: element.properties.color || "#000000",
      textAlign: element.properties.textAlign || "left",
      verticalAlign: element.properties.verticalAlign || "top",
      textTransform: element.properties.textTransform || "none",
    };
  } else if (
    element.type === "image" ||
    element.type === "eventlogo" ||
    element.type === "useravatar"
  ) {
    currentProperties.value = {
      x: element.properties.x || 148.5,
      y: element.properties.y || 284,
      w: element.properties.width || 100,
      h: element.properties.height || 100,
      r: element.properties.rotation || 0,
      src: element.properties.src || "https://via.placeholder.com/150",
      strokeColor: element.properties.strokeColor || "#eb2f2f",
      strokeWidth: element.properties.strokeWidth || 1,
      associatedData: element.properties.associatedData || "User ID",
    };
  } else if (element.type === "qrcode") {
    currentProperties.value = {
      x: element.properties.x || 20.5,
      y: element.properties.y || 25,
      w: element.properties.width || 100,
      h: element.properties.height || 100,
      r: element.properties.rotation || 0,
      content: element.properties.content || "https://example.com",
      size: element.properties.size || 100,
    };
  } else {
    currentProperties.value = {
      x: element.properties.x || 0,
      y: element.properties.y || 0,
      w: element.properties.width || 100,
      h: element.properties.height || 100,
      r: element.properties.rotation || 0,
    };
  }
};

const deleteElement = () => {
  if (!selectedElement.value) return;

  const index = elements.value.findIndex((e) => e.id === selectedElement.value);
  if (index === -1) return;

  elements.value.splice(index, 1);
  layers.value = layers.value.filter(
    (layer) => layer.id !== selectedElement.value
  );
  selectedElement.value = null;
  selectedLayer.value = null;
  currentProperties.value = {};
};

const savePosition = () => {
  if (selectedElement.value === null) return;

  const index = elements.value.findIndex((e) => e.id === selectedElement.value);
  if (index === -1) return;

  const element = elements.value[index];
  if (element.type === "text") {
    element.properties = {
      ...element.properties,
      x: currentProperties.value.x,
      y: currentProperties.value.y,
      width: currentProperties.value.w,
      height: currentProperties.value.h,
      rotation: currentProperties.value.r,
      font: currentProperties.value.font,
      fontStyle: currentProperties.value.fontStyle,
      fontSize: currentProperties.value.fontSize,
      fillColor: currentProperties.value.fillColor,
      fillTransparency: currentProperties.value.fillTransparency,
      text: currentProperties.value.text,
      textDecoration: currentProperties.value.textDecoration,
      color: currentProperties.value.color,
      textAlign: currentProperties.value.textAlign,
      verticalAlign: currentProperties.value.verticalAlign,
      textTransform: currentProperties.value.textTransform,
    };
  } else if (
    element.type === "image" ||
    element.type === "eventlogo" ||
    element.type === "useravatar"
  ) {
    element.properties = {
      ...element.properties,
      x: currentProperties.value.x,
      y: currentProperties.value.y,
      width: currentProperties.value.w,
      height: currentProperties.value.h,
      rotation: currentProperties.value.r,
      src: currentProperties.value.src,
      strokeColor: currentProperties.value.strokeColor,
      strokeWidth: currentProperties.value.strokeWidth,
      associatedData: currentProperties.value.associatedData,
    };
  } else if (element.type === "qrcode") {
    element.properties = {
      ...element.properties,
      x: currentProperties.value.x,
      y: currentProperties.value.y,
      width: currentProperties.value.w,
      height: currentProperties.value.h,
      rotation: currentProperties.value.r,
      content: currentProperties.value.content,
      size: currentProperties.value.size,
    };
  } else {
    element.properties = {
      ...element.properties,
      x: currentProperties.value.x,
      y: currentProperties.value.y,
      width: currentProperties.value.w,
      height: currentProperties.value.h,
      rotation: currentProperties.value.r,
    };
  }
};

const saveDesign = () => {
  const designData = {
    elements: elements.value.map((element) => ({
      ...element,
      properties: { ...element.properties },
    })),
    layers: layers.value,
    canvasSize: canvasSize.value,
  };
  console.log("Saving design:", designData);
  return designData;
};

const loadDesign = (data) => {
  elements.value = data.elements;
  layers.value = data.layers;
  canvasSize.value = data.canvasSize;
  nextTick(() => elements.value.forEach(setupInteract));
};

const handleCanvasClick = (event) => {
  if (!event.target.closest("[data-element-id]")) {
    selectedElement.value = null;
    selectedLayer.value = null;
    currentProperties.value = {};
  }
};

const updateText = (elementId, event) => {
  const element = elements.value.find((e) => e.id === elementId);
  if (element && element.type === "text") {
    element.properties.text = event.target.textContent;
    currentProperties.value.text = event.target.textContent;
    applyTextStyle();
  }
};

// const dragStart = (type) => {
//   event.dataTransfer.setData("text/plain", type);
// };

// const onDrop = (event) => {
//   event.preventDefault();
//   const rect = canvas.value.getBoundingClientRect();
//   const x = event.clientX - rect.left;
//   const y = event.clientY - rect.top;
//   const type = event.dataTransfer.getData("text");

//   if (type) {
//     const element = addElement(type, x, y);
//     if (element) {
//       selectElement(element.id);
//     }
//   }
// };

const toggleLayerVisibility = (index) => {
  layers.value[index].visible = !layers.value[index].visible;
  const elementIndex = elements.value.findIndex(
    (e) => e.id === layers.value[index].id
  );
  if (elementIndex !== -1) {
    elements.value[elementIndex].properties.lock = !layers.value[index].visible;
    updateProperties();
  }
};

// Alignment methods
const alignHorizontal = (alignment) => {
  if (selectedElement.value === null) return;
  const element = elements.value.find((e) => e.id === selectedElement.value);
  if (!element) return;

  const canvasRect = canvas.value.getBoundingClientRect();
  const elementWidth = currentProperties.value.w || element.properties.width;

  switch (alignment) {
    case "left":
      currentProperties.value.x = 0;
      break;
    case "center":
      currentProperties.value.x = (canvasRect.width - elementWidth) / 2;
      break;
    case "right":
      currentProperties.value.x = canvasRect.width - elementWidth;
      break;
  }
  savePosition();
};

const alignVertical = (alignment) => {
  if (selectedElement.value === null) return;
  const element = elements.value.find((e) => e.id === selectedElement.value);
  if (!element) return;

  const canvasRect = canvas.value.getBoundingClientRect();
  const elementHeight = currentProperties.value.h || element.properties.height;

  switch (alignment) {
    case "top":
      currentProperties.value.y = 0;
      break;
    case "middle":
      currentProperties.value.y = (canvasRect.height - elementHeight) / 2;
      break;
    case "bottom":
      currentProperties.value.y = canvasRect.height - elementHeight;
      break;
  }
  savePosition();
};

// Text style methods
const toggleTextStyle = (style) => {
  if (selectedElement.value === null) return;
  const element = elements.value.find((e) => e.id === selectedElement.value);
  if (!element || element.type !== "text") return;

  if (style === "bold") {
    currentProperties.value.fontStyle =
      currentProperties.value.fontStyle === "Bold" ? "Regular" : "Bold";
  } else if (style === "italic") {
    currentProperties.value.fontStyle =
      currentProperties.value.fontStyle === "Italic" ? "Regular" : "Italic";
  } else if (style === "underline") {
    currentProperties.value.textDecoration =
      currentProperties.value.textDecoration === "underline"
        ? "none"
        : "underline";
  }
  applyTextStyle();
};

const applyTextStyle = (newProperties = null) => {
  if (selectedElement.value === null) return;
  const element = elements.value.find((e) => e.id === selectedElement.value);
  if (!element || element.type !== "text") return;

  if (newProperties) {
    currentProperties.value = { ...currentProperties.value, ...newProperties };
  }

  const target = document.querySelector(
    `[data-element-id="${element.id}"] div[contenteditable]`
  );
  if (target) {
    target.style.fontFamily = currentProperties.value.font;
    target.style.fontSize = `${currentProperties.value.fontSize}px`;
    target.style.fontWeight =
      currentProperties.value.fontStyle === "Bold" ? "bold" : "normal";
    target.style.fontStyle =
      currentProperties.value.fontStyle === "Italic" ? "italic" : "normal";
    target.style.color = currentProperties.value.color;
    target.style.backgroundColor = currentProperties.value.fillTransparency
      ? "transparent"
      : currentProperties.value.fillColor;
    target.style.textDecoration = currentProperties.value.textDecoration;
    target.style.textAlign =
      displayOption.value === "right side only"
        ? "right"
        : currentProperties.value.textAlign;
    target.style.verticalAlign = currentProperties.value.verticalAlign;
    target.style.textTransform = currentProperties.value.textTransform;
    target.style.direction =
      displayOption.value === "right side only" ? "rtl" : "ltr";
    target.setAttribute(
      "dir",
      displayOption.value === "right side only" ? "rtl" : "ltr"
    );
    target.textContent =
      currentProperties.value.text || element.properties.exampleText;

    // Ensure cursor is at the end for RTL
    if (displayOption.value === "right side only") {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(target);
      range.collapse(false); // Collapse to the end
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  savePosition();
};

const makeTransparent = () => {
  if (selectedElementType.value === "text") {
    currentProperties.value.fillColor = "rgba(0, 0, 0, 0)";
    currentProperties.value.fillTransparency = true;
    applyTextStyle();
  }
};

const applyColor = (color) => {
  if (selectedElementType.value === "text") {
    currentProperties.value.fillColor = color;
    currentProperties.value.fillTransparency = false;
    applyTextStyle();
    nextTick(() => {
      const target = document.querySelector(
        `[data-element-id="${selectedElement.value}"] div[contenteditable]`
      );
      if (target)
        target.style.backgroundColor = currentProperties.value.fillColor;
    });
  }
};

const applyTextAlign = (align) => {
  if (selectedElementType.value === "text") {
    currentProperties.value.textAlign = align;
    applyTextStyle();
  }
};

const applyVerticalAlign = (align) => {
  if (selectedElementType.value === "text") {
    currentProperties.value.verticalAlign = align;
    applyTextStyle();
  }
};

const applyTextTransform = (transform) => {
  if (selectedElementType.value === "text") {
    currentProperties.value.textTransform = transform;
    applyTextStyle();
  }
};

const applyDisplayOption = (option) => {
  displayOption.value = option;
  applyTextStyle();
};

// Watch selectedElement to update properties
watch(selectedElement, () => {
  updateProperties();
  if (selectedElement.value) applyTextStyle();
});

// Watch currentProperties to save changes
watch(currentProperties, () => savePosition(), { deep: true });

// Initialize interact.js
onMounted(() => {
  elements.value.forEach(setupInteract);
});

watch(displayOption, () => {
  applyTextStyle();
});
</script>

<style scoped>
.card {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
}

.design-page {
  transition: transform 0.3s ease-in-out;
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
  background-image: linear-gradient(
      to right,
      rgba(156, 163, 175, 0.2) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(156, 163, 175, 0.2) 1px, transparent 1px),
    linear-gradient(to right, rgba(156, 163, 175, 0.6) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(156, 163, 175, 0.6) 1px, transparent 1px);
  background-size: calc(100% / 20) calc(100% / 20),
    calc(100% / 20) calc(100% / 20), calc(100% / 4) 100%, 100% calc(100% / 6);
  pointer-events: none;
  z-index: 10;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

details[open] summary .rotate-180 {
  transform: rotate(180deg);
}

@media (max-width: 640px) {
  .design-page {
    width: 250px;
    height: 350px;
  }
}
</style>
