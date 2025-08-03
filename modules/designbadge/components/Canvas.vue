<template>
  <div>
    <div
      ref="canvas"
      class="absolute w-full h-full bg-white select-none"
      @mousedown="handleCanvasClick"
    >
      <!-- Add Elements -->
      <!-- <div class="absolute top-4 left-4 z-10 space-x-2">
        <button
          v-for="tag in ['h1', 'h2', 'h3', 'p', 'a', 'img']"
          :key="tag"
          class="px-2 py-1 bg-blue-600 text-white rounded"
          @click="createElement(tag)"
        >
          ➕ {{ tag }}
        </button>
      </div> -->

      <!-- Vertical & Horizontal Guide Lines -->
      <template v-if="selectedBox && selectedBox.isDragging">
        <div
          class="absolute top-0 bottom-0 w-px bg-blue-500 z-0"
          :style="{
            left: selectedBox.position.left + selectedBox.size.width / 2 + 'px',
          }"
        ></div>
        <div
          class="absolute left-0 right-0 h-px bg-blue-500 z-0"
          :style="{
            top: selectedBox.position.top + selectedBox.size.height / 2 + 'px',
          }"
        ></div>
      </template>

      <!-- Draggable Elements -->
      <div
        v-for="(box, index) in boxes"
        :key="box.id"
        class="absolute border group"
        :class="box.isSelected ? 'border-blue-500' : 'border-transparent'"
        :style="{
          top: box.position.top + 'px',
          left: box.position.left + 'px',
          width: box.size.width + 'px',
          height: box.size.height + 'px',
          transform: `rotate(${box.rotation}deg)`,
          transformOrigin: 'center center',
        }"
        @mousedown.stop="activateElement(index, $event)"
      >
        <!-- Label (Dynamic) -->
        <div
          v-if="box.isSelected && box.label"
          class="absolute -top-5 left-0 px-1 text-xs text-white bg-blue-600"
        >
          {{ box.label }}
        </div>

        <!-- Distance (Only on Drag) -->
        <template v-if="box.isDragging">
          <!-- Y top -->
          <div
            class="absolute left-1/2 -top-10 -translate-x-1/2 text-xs text-red-500"
          >
            Y: {{ Math.round(box.position.top) }}
          </div>
          <!-- X left -->
          <div
            class="absolute -left-6 top-1/2 -translate-y-1/2 text-xs text-red-500"
          >
            {{ Math.round(box.position.left + box.size.width / 2) }}
          </div>
          <div
            class="absolute -right-6 top-1/2 -translate-y-1/2 text-xs text-red-500"
          >
            {{
              Math.round(canvasWidth - box.position.left - box.size.width / 2)
            }}
          </div>
          <div
            class="absolute left-1/2 -bottom-5 -translate-x-1/2 text-xs text-red-500"
          >
            {{
              Math.round(canvasHeight - box.position.top - box.size.height / 2)
            }}
          </div>
        </template>

        <!-- Rotate Icon -->
        <div
          v-if="box.isSelected"
          class="rotate-icon"
          @mousedown.stop.prevent="startRotate(index, $event)"
        >
          🔄
        </div>

        <!-- Resizing Handles -->
        <div
          v-if="box.isSelected"
          v-for="dir in directions"
          :key="dir"
          :class="['handle', dir]"
          @mousedown.stop.prevent="startResize(index, dir)"
        ></div>

        <!-- Editable Text -->
        <!-- Editable Dynamic Element -->
        <component
          v-if="box.type !== 'img'"
          :is="box.type"
          contenteditable
          class="flex justify-center items-center outline-none cursor-move leading-tight text-center w-full h-full"
          :style="{
            fontSize:
              Math.max(
                12,
                Math.min(
                  48,
                  box.type == 'p'
                    ? box.size.height * 0.2
                    : box.size.height * 0.4
                )
              ) + 'px',
            fontFamily: 'popins, sans-serif',
            color: box.textColor || 'black',
          }"
          v-html="box.text"
        >
        </component>

        <!-- Image Element -->

        <img
          v-else
          :src="box.text.src"
          class="w-full h-full object-contain cursor-pointer select-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Array,
  sendElement: Object,
});

const emit = defineEmits([
  "addToFrontCanvas",
  "addToBackCanvas",
  "requestFrontImage",
  "requestBackImage",
  "sendSelectedElement",
]);

watch(
  () => props.sendElement,
  (newSendElement) => {
    if (newSendElement) {
      createElement(newSendElement);
    }
  }
);

const canvas = ref(null);
const boxes = computed(() => props.modelValue);
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

const selectedElementId = ref(null);

onMounted(() => {
  const resizeObserver = new ResizeObserver(() => {
    canvasWidth.value = canvas.value?.offsetWidth;
    canvasHeight.value = canvas.value.offsetHeight;
  });

  resizeObserver.observe(canvas.value);
});

function createElement(element) {
  // console.log(`Creating element: ${element.item.label}`);

  // return false;

  if (element.item.type === "img") {
    if (element.side === "front") {
      emit("requestFrontImage");
    } else {
      emit("requestBackImage");
    }
    return;
  }

  const newElement = {
    id: Date.now(),
    text: element.item.label || "Sample Text",
    type: element.item.type,
    label: `${element.item.label}`,
    position: element.position,
    properties: {
      y: element.y,
      x: element.x,
      // width: 250,
      // height: 250,
      // rotation: 250,
      // font: 250,
      // fontStyle: 250,
      // fontSize: 250,
      // fillColor: 250,
      // fillTransparency: 250,
      // text: 250,
      // exampleText: 250,
      // textDecoration: 250,
      // color: 250,
      // textAlign: 250,
      // verticalAlign: 250,
      // textTransform: 250,
    },
    size: { width: 250, height: 70 },
    rotation: 0,
    isSelected: false,
    isDragging: false,
    direction: "ltr",
  };

  if (element.side === "front") {
    emit("addToFrontCanvas", newElement);
  } else {
    emit("addToBackCanvas", newElement);
  }
}

function handleCanvasClick() {
  boxes.value.forEach((b) => (b.isSelected = false));
  selectedBoxIndex = -1;
  emit("sendSelectedElement", null);
}

function activateElement(index, event) {
  boxes.value.forEach((b, i) => (b.isSelected = i === index));
  selectedBoxIndex = index;
  startDrag(index, event); // ✅ Trigger drag when element is clicked
  console.log(
    "Canvas clicked, deselecting all elements",
    boxes.value[index].id
  );

  emit("sendSelectedElement", boxes.value[index].id);
  // selectedElementId.value = boxes.value[index].id;
}

function startDrag(index, event) {
  const box = boxes.value[index];
  dragOffset.x = event.clientX - box.position.left;
  dragOffset.y = event.clientY - box.position.top;
  box.isDragging = true;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopActions);
}

function onDrag(event) {
  const box = boxes.value[selectedBoxIndex];
  const canvasRect = canvas.value.getBoundingClientRect();
  let newLeft = event.clientX - dragOffset.x;
  let newTop = event.clientY - dragOffset.y;

  newLeft = Math.max(0, Math.min(canvasRect.width - box.size.width, newLeft));
  newTop = Math.max(0, Math.min(canvasRect.height - box.size.height, newTop));

  box.position.left = newLeft;
  box.position.top = newTop;
}

function startResize(index, dir) {
  selectedBoxIndex = index;
  resizeDir = dir;
  document.addEventListener("mousemove", onResize);
  document.addEventListener("mouseup", stopActions);
}

function onResize(event) {
  const box = boxes.value[selectedBoxIndex];
  const minSize = 40;
  const dx = event.movementX;
  const dy = event.movementY;

  if (resizeDir.includes("right"))
    box.size.width = Math.max(minSize, box.size.width + dx);
  if (resizeDir.includes("left")) {
    box.size.width = Math.max(minSize, box.size.width - dx);
    box.position.left += dx;
  }
  if (resizeDir.includes("bottom"))
    box.size.height = Math.max(minSize, box.size.height + dy);
  if (resizeDir.includes("top")) {
    box.size.height = Math.max(minSize, box.size.height - dy);
    box.position.top += dy;
  }
}

function autoResizeText(index, event) {
  //   const el = event.target;
  //   el.style.height = "auto"; // Reset first
  //   el.style.height = el.scrollHeight + "px";
  //   boxes.value[index].size.height = el.offsetHeight;
}

function startRotate(index, event) {
  const box = boxes.value[index];
  const centerX = box.position.left + box.size.width / 2;
  const centerY = box.position.top + box.size.height / 2;

  const startX = event.clientX;
  const startY = event.clientY;

  const dxStart = startX - centerX;
  const dyStart = startY - centerY;
  const startAngle = Math.atan2(dyStart, dxStart) * (360 / Math.PI);
  const initialRotation = box.rotation;

  function rotate(e) {
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const currentAngle = Math.atan2(dy, dx) * (360 / Math.PI);

    // 🔥 Boost rotation speed (adjust multiplier as needed)
    const delta = (currentAngle - startAngle) * 12;

    box.rotation = (initialRotation + delta + 360) % 360;
  }

  function stopRotate() {
    document.removeEventListener("mousemove", rotate);
    document.removeEventListener("mouseup", stopRotate);
  }

  document.addEventListener("mousemove", rotate);
  document.addEventListener("mouseup", stopRotate);
}

function stopActions() {
  boxes.value.forEach((b) => (b.isDragging = false));
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mousemove", onResize);
  document.removeEventListener("mouseup", stopActions);
}

const selectedBox = computed(() => boxes.value.find((b) => b.isSelected));

function emitSelectElement(id) {
  emit("selectElement", id);
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
</style>
