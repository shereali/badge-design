<template>
  <div class="w-full h-full relative">
    <div
      ref="canvas"
      class="absolute w-full h-full bg-white select-none"
      :style="{
        background:
          props.modelValue === store.frontBoxes
            ? store.frontBackground || 'white'
            : store.backBackground || 'white',
      }"
      @mousedown="handleCanvasClick"
    >
      <!-- Canvas Background -->
      <!-- Punch Area Indicators -->
      <div v-if="store.punchArea" class="punch-area">
        <div class="punch-long">
          <!-- {{ store.punchLong }} -->
          <div
            v-if="store.punchLong == 'long-left-right'"
            class="w-16 h-4 bg-transparent border border-gray-200 rounded-xl absolute top-5 right-5 z-10"
          ></div>
          <div
            v-if="store.punchLong == 'long-left-right'"
            class="w-16 h-4 bg-transparent border border-gray-200 rounded-xl absolute top-5 left-5 z-10"
          ></div>

          <div
            v-if="store.punchLong == 'long-center'"
            class="w-16 h-4 bg-transparent border border-gray-200 rounded-xl absolute top-5 left-1/2 -translate-x-1/2 z-10"
          ></div>
        </div>

        <div class="punch-circle">
          <div
            v-if="store.punchCircle == 'circle-left-right'"
            class="w-5 h-5 bg-transparent border border-white/60 rounded-full absolute top-5 left-5 z-10"
          ></div>
          <div
            v-if="store.punchCircle == 'circle-left-right'"
            class="w-5 h-5 bg-transparent border border-white/60 rounded-full absolute top-5 right-5 z-10"
          ></div>

          <div
            v-if="store.punchCircle == 'circle-center'"
            class="w-5 h-5 bg-transparent border border-white/60 rounded-full absolute top-5 left-1/2 -translate-x-1/2 z-10"
          ></div>
        </div>
      </div>
      <!-- Vertical & Horizontal Guide Lines -->
      <template v-if="selectedBox && selectedBox.isDragging">
        <div
          class="absolute top-0 bottom-0 w-px bg-blue-400/60 z-0"
          :style="{
            left:
              selectedBox.position.left +
              selectedBox.properties.size.width / 2 +
              'px',
          }"
        ></div>
        <div
          class="absolute left-0 right-0 h-px bg-blue-400/60 z-0"
          :style="{
            top:
              selectedBox.position.top +
              selectedBox.properties.size.height / 2 +
              'px',
          }"
        ></div>
      </template>

      <!-- Snapping Guides (Auto-center lines with equal margins) -->
      <div
        v-if="isSnappedX"
        class="absolute top-0 bottom-0 w-0.5 bg-indigo-600 z-30 pointer-events-none flex flex-col items-center"
        :style="{ left: snapGuideX + 'px' }"
      >
        <span class="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
          CENTER (Equal Margins)
        </span>
      </div>

      <div
        v-if="isSnappedY"
        class="absolute left-0 right-0 h-0.5 bg-indigo-600 z-30 pointer-events-none flex items-center justify-center"
        :style="{ top: snapGuideY + 'px' }"
      >
        <span class="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow ml-1 whitespace-nowrap">
          MIDDLE
        </span>
      </div>

      <!-- Draggable Elements -->
      <template v-for="(box, index) in store.boxes" :key="box.id">
        <div
          v-if="box.visible"
          class="absolute group"
          :class="{
            'border-2 border-blue-500': box.isSelected,
          }"
          :style="{
            top: box.position.top + 'px',
            left: box.position.left + 'px',
            width: box.properties.size.width + 'px',
            height: box.properties.size.height + 'px',
            transform: `rotate(${box.properties.rotation}deg)`,
            transformOrigin: 'center center',
            backgroundColor: box.properties.fillTransparency
              ? 'transparent'
              : box.properties.fillColor || '#ffffff',
            border:
              box.isSelected
                ? '2px solid #3b82f6'
                : box.properties.strokeWidth > 0
                ? `${box.properties.strokeWidth}px solid ${box.properties.strokeColor}`
                : 'none',
            zIndex: box.zIndex || 0,
            boxSizing: 'border-box',
          }"
          @mousedown.stop="activateElement(index, $event)"
          @dblclick="handleDoubleClick(box, index)"
          @keydown="deleteItem($event)"
        >
          <!-- Selected-only elements -->
          <template v-if="box.isSelected">
            <!-- Label (Dynamic) -->
            <div
              v-if="box.label"
              class="absolute -top-5 left-0 px-1 text-xs text-white bg-blue-600"
            >
              {{ box.label }}
            </div>

            <!-- Delete Button -->
            <div
              class="absolute -top-6 right-0 text-xs text-ceter cursor-pointer"
              @click.stop="deleteElement(index)"
            >
              <Icon
                name="bitcoin-icons:trash-outline"
                class="text-lg flex items-center justify-center place-content-center text-red-600"
              />
            </div>

            <!-- Distance (Only on Drag) -->
            <template v-if="box.isDragging">
              <div
                class="absolute left-1/2 -top-10 -translate-x-1/2 text-xs text-red-500"
              >
                Y: {{ Math.round(box.position.top) }}
              </div>
              <div
                class="absolute -left-6 top-1/2 -translate-y-1/2 text-xs text-red-500"
              >
                {{
                  Math.round(box.position.left + box.properties.size.width / 2)
                }}
              </div>
              <div
                class="absolute -right-6 top-1/2 -translate-y-1/2 text-xs text-red-500"
              >
                {{
                  Math.round(
                    canvasWidth -
                      box.position.left -
                      box.properties.size.width / 2
                  )
                }}
              </div>
              <div
                class="absolute left-1/2 -bottom-5 -translate-x-1/2 text-xs text-red-500"
              >
                {{
                  Math.round(
                    canvasHeight -
                      box.position.top -
                      box.properties.size.height / 2
                  )
                }}
              </div>
            </template>

            <!-- Rotate Icon -->
            <div
              class="rotate-icon"
              @mousedown.stop.prevent="startRotate(index, $event)"
            >
              <Icon name="line-md:rotate-270" class="text-blue-600" />
            </div>

            <!-- Resizing Handles -->
            <div
              v-for="dir in directions"
              :key="dir"
              :class="['handle', dir]"
              @mousedown.stop.prevent="startResize(index, dir)"
            ></div>
          </template>

          <!-- Content -->
          <component
            v-if="
              checkElementTypes.find((item) =>
                checkElementTypes.includes(box.type)
              )
            "
            :is="box.type"
            contenteditable="true"
            class="focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-text w-full h-full flex flex-col m-0 p-0 text-inherit select-text break-words whitespace-normal"
            :class="[
              verticalToJustifyClass(box),
              horizontalToTextAlignClass(box),
            ]"
            :style="textStyles(box)"
            :ref="(el) => setTextElementRef(box, el)"
            @focus="handleTextFocus(box, $event)"
            @blur="handleTextBlur(box, $event)"
            @input="handleTextInput(box, $event)"
          ></component>

          <!-- Images -->
          <img
            v-if="box.type === 'img'"
            :src="box.properties.src?.url || box.properties.src || box.text"
            class="w-full h-full cursor-pointer select-none"
            :class="[objectPositionClass(box), objectFitPositionClass(box)]"
            @keydown="deleteItem($event)"
            @error="handleImageError"
          />

          <!-- Static Image -->
          <img
            v-if="box.type === 'background'"
            :src="box.properties.src?.url || box.properties.src || box.text"
            class="w-full h-full transition-all duration-300 cursor-pointer select-none"
            :class="[objectPositionClass(box), objectFitPositionClass(box)]"
            @keydown="deleteItem($event)"
            @error="handleImageError"
          />

          <!-- Avatar / Profile Photo -->
          <div
            v-if="box.type === 'avatar'"
            class="overflow-hidden flex items-center justify-center bg-slate-100 w-full h-full select-none"
            :class="[
              box.properties?.avatar?.showBorder ? 'border border-gray-300' : '',
              box.properties?.avatar?.showRing ? 'border-2 border-indigo-500' : '',
            ]"
            :style="avatarContainerStyle(box)"
          >
            <div
              class="w-full h-full pointer-events-none select-none"
              :style="{
                width: '100%',
                height: '100%',
                backgroundImage: `url('${getAvatarSrc(box)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: avatarContainerStyle(box).borderRadius || '0px',
                clipPath: avatarContainerStyle(box).clipPath || 'none',
                boxSizing: 'border-box',
              }"
            ></div>
          </div>

          <!-- QR Code -->
          <Qrcode
            v-if="box.type === 'qrcode'"
            :value="box.properties.qrcode.value"
            :variant="box.properties.qrcode.variant"
            :radius="box.properties.qrcode.radius"
            :blackColor="box.properties.qrcode.blackColor"
            :whiteColor="box.properties.qrcode.whiteColor"
            @keydown="deleteItem(index, $event)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useCanvasStore } from "@/stores/useCanvasStore";
import { ref, computed, watch, nextTick } from "vue";

const store = useCanvasStore();
const props = defineProps({
  modelValue: Array,
});

const canvas = ref(null);
const checkElementTypes = ["h1", "h2", "h3", "h4", "h6", "p", "a", "span"];
const directions = [
  "top-left",
  "top",
  "top-right",
  "right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "left",
];

const canvasWidth = ref(0);
const canvasHeight = ref(0);
let resizeDir = "";
let dragOffset = { x: 0, y: 0 };
let selectedBoxIndex = -1;
const textElements = ref({});
const activeEditingId = ref(null);

// Snapping state
const isSnappedX = ref(false);
const isSnappedY = ref(false);
const snapGuideX = ref(0);
const snapGuideY = ref(0);

function verticalToJustifyClass(box) {
  let align = "justify-center";
  if (box.properties.verticalAlign === "top") align = "justify-start";
  if (box.properties.verticalAlign === "middle") align = "justify-center";
  if (box.properties.verticalAlign === "bottom") align = "justify-end";
  return align;
}

function horizontalToTextAlignClass(box) {
  const align =
    box.properties.horizontalAlign || box.properties.textAlign || "center";
  if (align === "left") return "text-left items-start";
  if (align === "center") return "text-center items-center";
  if (align === "right") return "text-right items-end";
  if (align === "justify") return "text-justify items-stretch";
  return "text-center items-center";
}

function handleCanvasClick() {
  store.boxes.forEach((b) => (b.isSelected = false));
  selectedBoxIndex = -1;
  store.selectedElement = null;
  store.updateProperties();
}

function activateElement(index, event) {
  store.boxes.forEach((b, i) => (b.isSelected = i === index));
  selectedBoxIndex = index;
  startDrag(index, event);
  store.selectedElement = store.boxes[index].id;
  store.selectedElementType = store.boxes[index].type;
  store.activeTab = "properties";
  store.updateProperties();
}

function deleteItem(event) {
  if (event.key === "Delete" && store.selectedElement) {
    const index = store.boxes.findIndex(
      (item) => item.id === store.selectedElement
    );
    if (index !== -1) {
      store.boxes.splice(index, 1);
      store.selectedElement = null;
      store.updateProperties();
      store.recordHistory();
    }
  }
}

function deleteElement(index) {
  const box = store.boxes[index];
  if (box) {
    store.boxes.splice(index, 1);
    store.selectedElement = null;
    store.updateProperties();
    store.recordHistory();
  }
}

function handleDoubleClick(box, index) {
  if (checkElementTypes.includes(box.type)) {
    store.boxes.forEach((b, i) => (b.isSelected = i === index));
    selectedBoxIndex = index;
    store.selectedElement = box.id;
    store.selectedElementType = box.type;
    store.activeTab = "properties";
    store.updateProperties();

    nextTick(() => {
      const el = textElements.value[box.id];
      if (el) {
        el.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }
}

onMounted(() => {
  const resizeObserver = new ResizeObserver(() => {
    canvasWidth.value = canvas.value?.offsetWidth;
    canvasHeight.value = canvas.value?.offsetHeight;
  });
  resizeObserver.observe(canvas.value);
  document.addEventListener("keydown", deleteItem);
});

function setTextElementRef(box, el) {
  if (el) {
    textElements.value[box.id] = el;
    const currentText = box.text ?? box.properties?.text ?? "";
    if (activeEditingId.value !== box.id && el.innerText !== currentText) {
      el.innerText = currentText;
    }
  } else {
    delete textElements.value[box.id];
  }
}

watch(
  () => store.boxes.map((b) => ({ id: b.id, text: b.text ?? b.properties?.text ?? "" })),
  (boxesList) => {
    boxesList.forEach(({ id, text }) => {
      if (activeEditingId.value === id) return;
      const el = textElements.value[id];
      if (el && el.innerText !== text) {
        el.innerText = text;
      }
    });
  },
  { deep: true, immediate: true }
);

function startDrag(index, event) {
  const box = store.boxes[index];
  dragOffset.x = event.clientX - box.position.left;
  dragOffset.y = event.clientY - box.position.top;
  box.isDragging = true;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopActions);
}

function onDrag(event) {
  const box = store.boxes[selectedBoxIndex];
  if (!box) return;

  const canvasRect = canvas.value.getBoundingClientRect();
  const canvasW = canvasRect.width;
  const canvasH = canvasRect.height;
  const boxW = box.properties.size.width;
  const boxH = box.properties.size.height;

  let rawLeft = event.clientX - dragOffset.x;
  let rawTop = event.clientY - dragOffset.y;

  // Snapping threshold (pixels)
  const threshold = 8;

  // 1. Horizontal Auto-Center Snapping (Leaves exactly equal space on left & right)
  const centerLeft = (canvasW - boxW) / 2;
  if (Math.abs(rawLeft - centerLeft) <= threshold) {
    rawLeft = centerLeft;
    isSnappedX.value = true;
    snapGuideX.value = canvasW / 2;
  } else {
    isSnappedX.value = false;
  }

  // 2. Vertical Auto-Center Snapping (Leaves exactly equal space on top & bottom)
  const centerTop = (canvasH - boxH) / 2;
  if (Math.abs(rawTop - centerTop) <= threshold) {
    rawTop = centerTop;
    isSnappedY.value = true;
    snapGuideY.value = canvasH / 2;
  } else {
    isSnappedY.value = false;
  }

  // Keep within canvas bounds
  const newLeft = Math.max(0, Math.min(canvasW - boxW, rawLeft));
  const newTop = Math.max(0, Math.min(canvasH - boxH, rawTop));

  box.position.left = newLeft;
  box.position.top = newTop;

  store.currentProperties.x = Math.round(newLeft);
  store.currentProperties.y = Math.round(newTop);
  store.currentProperties.avatar = {
    ...box.properties.avatar,
  };
  store.updateProperties(store.currentProperties);
}

function startResize(index, dir) {
  selectedBoxIndex = index;
  resizeDir = dir;
  document.addEventListener("mousemove", onResize);
  document.addEventListener("mouseup", stopActions);
}

function onResize(event) {
  const box = store.boxes[selectedBoxIndex];
  const minSize = 40;
  const dx = event.movementX;
  const dy = event.movementY;

  let newWidth = box.properties.size.width;
  let newHeight = box.properties.size.height;
  let newLeft = box.position.left;
  let newTop = box.position.top;

  if (resizeDir.includes("right")) {
    newWidth = Math.max(minSize, newWidth + dx);
  }
  if (resizeDir.includes("left")) {
    const prevWidth = newWidth;
    newWidth = Math.max(minSize, newWidth - dx);
    if (newWidth > minSize || prevWidth > minSize) {
      newLeft += dx;
    }
  }

  if (resizeDir.includes("bottom")) {
    newHeight = Math.max(minSize, newHeight + dy);
  }
  if (resizeDir.includes("top")) {
    const prevHeight = newHeight;
    newHeight = Math.max(minSize, newHeight - dy);
    if (newHeight > minSize || prevHeight > minSize) {
      newTop += dy;
    }
  }

  box.properties.size.width = newWidth;
  box.properties.size.height = newHeight;
  box.position.left = newLeft;
  box.position.top = newTop;

  store.currentProperties.size = { ...box.properties.size };
  store.currentProperties.x = newLeft;
  store.currentProperties.y = newTop;
  store.updateProperties(store.currentProperties);
}

function startRotate(index, event) {
  const box = store.boxes[index];
  const centerX = box.position.left + box.properties.size.width / 2;
  const centerY = box.position.top + box.properties.size.height / 2;

  const startX = event.clientX;
  const startY = event.clientY;

  const dxStart = startX - centerX;
  const dyStart = startY - centerY;
  const startAngle = Math.atan2(dyStart, dxStart) * (360 / Math.PI);
  const initialRotation = box.properties.rotation;

  function rotate(e) {
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const currentAngle = Math.atan2(dy, dx) * (360 / Math.PI);

    const delta = (currentAngle - startAngle) * 12;

    box.properties.rotation = (initialRotation + delta + 360) % 360;
    store.currentProperties.rotation = Math.floor(box.properties.rotation);
    store.currentProperties.avatar = {
      ...box.properties.avatar,
    };
    store.updateProperties(store.currentProperties);
  }

  function stopRotate() {
    document.removeEventListener("mousemove", rotate);
    document.removeEventListener("mouseup", stopRotate);
    store.recordHistory();
  }

  document.addEventListener("mousemove", rotate);
  document.addEventListener("mouseup", stopRotate);
}

function stopActions() {
  isSnappedX.value = false;
  isSnappedY.value = false;
  store.boxes.forEach((b) => (b.isDragging = false));
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mousemove", onResize);
  document.removeEventListener("mouseup", stopActions);
  store.recordHistory();
}

function handleTextFocus(box, event) {
  activeEditingId.value = box.id;
}

function handleTextInput(box, event) {
  const el = event.target;
  const newText = el.innerText || "";
  box.text = newText;
  box.properties.text = newText;
  store.updateElementText(box.id, newText);
  if (store.selectedElement === box.id) {
    store.currentProperties.text = newText;
  }
}

function handleTextBlur(box, event) {
  const el = event.target;
  const newText = el.innerText || "";
  activeEditingId.value = null;
  box.text = newText;
  box.properties.text = newText;
  store.updateElementText(box.id, newText);
  if (store.selectedElement === box.id) {
    store.currentProperties.text = newText;
  }
  store.recordHistory();
}

function avatarContainerStyle(box) {
  const avatar = box.properties?.avatar || {};
  const shape = avatar.shape || "circle";
  const radius = avatar.radius !== undefined ? avatar.radius : 32;
  const customClipPath = avatar.customClipPath || "";

  const style = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  if (shape === "circle") {
    style.borderRadius = "50%";
  } else if (shape === "rounded" || shape === "squircle") {
    style.borderRadius = `${radius}px`;
  } else if (shape === "diamond") {
    style.clipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
  } else if (shape === "hex") {
    style.clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
  } else if (shape === "triangle") {
    style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
  } else if (shape === "custom" && customClipPath) {
    style.clipPath = customClipPath;
  }
  return style;
}

function getAvatarSrc(box) {
  const src =
    box.properties?.avatar?.avatar_src ||
    box.properties?.src?.url ||
    box.properties?.src ||
    box.text;
  if (
    src &&
    typeof src === "string" &&
    (src.startsWith("http") || src.startsWith("data:") || src.startsWith("/"))
  ) {
    return src;
  }
  return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
}

function handleAvatarError(e) {
  e.target.src =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
}

function preserveCursorPosition(event) {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    store.cursorPosition = {
      node: range.startContainer,
      offset: range.startOffset,
    };
  }
}

function handleImageError(event) {
  console.error("Image failed to load:", event.target.src);
}

const selectedBox = computed(() => store.boxes.find((b) => b.isSelected));

function textStyles(box) {
  let fontSize = "16px";
  if (box.properties.fontSize && box.properties.fontSize !== "Auto") {
    fontSize = `${box.properties.fontSize}px`;
  } else if (box.type === "h1") {
    fontSize = "20px";
  } else if (box.type === "p") {
    fontSize = "14px";
  }

  const textAlign =
    box.properties.horizontalAlign || box.properties.textAlign || "center";

  return {
    fontSize,
    lineHeight: box.properties.lineHeight || "1.2",
    fontFamily: box.properties.font || "Poppins, sans-serif",
    fontWeight:
      box.properties.fontWeight || (box.type === "h1" ? "bold" : "normal"),
    fontStyle: box.properties.fontStyle || "normal",
    textDecoration: box.properties.textDecoration || "none",
    textTransform: box.properties.textTransform || "none",
    color: box.properties.color || "black",
    direction: box.properties.direction || "ltr",
    textAlign,
    margin: "0",
    padding: "0",
    boxSizing: "border-box",
  };
}

function horizontalAlignClass(box) {
  let align = "justify-center";
  if (box.properties.horizontalAlign === "left") align = "justify-start";
  if (box.properties.horizontalAlign === "center") align = "justify-center";
  if (box.properties.horizontalAlign === "right") align = "justify-end";
  return [align];
}

function verticalAlignClass(box) {
  let align = "items-center";
  if (box.properties.verticalAlign === "top") align = "items-start";
  if (box.properties.verticalAlign === "middle") align = "items-center";
  if (box.properties.verticalAlign === "bottom") align = "items-end";
  return [align];
}

function objectPositionClass(box) {
  switch (box.properties.imagePosition || box.properties.objectFit) {
    case "top-left":
      return "object-top-left";
    case "top":
      return "object-top";
    case "top-right":
      return "object-top-right";
    case "left":
      return "object-left";
    case "center":
      return "object-center";
    case "right":
      return "object-right";
    case "bottom-left":
      return "object-bottom-left";
    case "bottom":
      return "object-bottom";
    case "bottom-right":
      return "object-bottom-right";
  }
}

function objectFitPositionClass(box) {
  switch (box.properties.objectFit) {
    case "contain":
      return "object-contain";
    case "cover":
      return "object-cover";
    case "fill":
      return "object-fill";
    case "none":
      return "object-none";
    case "scale-down":
      return "object-scale-down";
  }
}


</script>

<style scoped>
.handle {
  width: 8px;
  height: 8px;
  background-color: white;
  border: 1px solid blue;
  position: absolute;
  z-index: 10;
}

.top-left {
  top: -4px;
  left: -4px;
  cursor: nwse-resize;
}
.top {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}
.top-right {
  top: -4px;
  right: -4px;
  cursor: nesw-resize;
}
.right {
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
  cursor: ew-resize;
}
.bottom-right {
  bottom: -4px;
  right: -4px;
  cursor: nwse-resize;
}
.bottom {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}
.bottom-left {
  bottom: -4px;
  left: -4px;
  cursor: nesw-resize;
}
.left {
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.rotate-icon {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: grab;
  font-size: 18px;
  user-select: none;
}

[contenteditable] {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
