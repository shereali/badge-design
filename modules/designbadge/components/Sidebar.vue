<template>
  <div>
    <div class="flex mb-4">
      <button
        class="flex-1 p-2"
        :class="{ 'bg-blue-500 text-white': store.activeTab === 'design' }"
        @click="store.activeTab = 'design'"
      >
        Design
      </button>
      <button
        class="flex-1 p-2"
        :class="{ 'bg-blue-500 text-white': store.activeTab === 'properties' }"
        @click="store.activeTab = 'properties'"
      >
        Properties
      </button>
      <button
        class="flex-1 p-2"
        :class="{ 'bg-blue-500 text-white': store.activeTab === 'layers' }"
        @click="store.activeTab = 'layers'"
      >
        Layers
      </button>
    </div>

    <!-- Design Tab Content -->
    <div v-if="store.activeTab === 'design'" class="space-y-1">
      <div class="py-3 px-2 flex">
        <Icon name="quill:paper" class="text-2xl text-blue-600" />
        <span
          >{{ pageStore.badgeSize }}({{ pageStore.presetWidth.toFixed(2) }}mmX{{
            pageStore.presetHeight.toFixed(2)
          }}mm) </span
        ><a
          href="#"
          class="text-blue-600 font-semibold"
          @click="pageStore.toggleModal"
        >
          &nbsp;Change</a
        >
      </div>
      <div
        v-for="group in designGroups"
        :key="group.type"
        class="bg-white border-b border-gray-300"
      >
        <div
          @click="toggleGroup(group.type)"
          class="flex items-center p-2 cursor-pointer hover:bg-gray-50"
        >
          <Icon
            :name="group.icon"
            class="text-2xl mr-2 bg-blue-600"
            aria-hidden="true"
          />
          <span>{{ group.label }}</span>
          <Icon
            name="mdi:chevron-down"
            class="ml-auto text-2xl"
            :class="{ 'transform rotate-180': openGroups[group.type] }"
            aria-hidden="true"
          />
        </div>
        <div v-if="openGroups[group.type]" class="pl-6 space-y-2 py-2">
          <div
            v-for="item in group.items"
            :key="item.type"
            :draggable="
              item.type !== 'qrcode' &&
              item.type !== 'gradient' &&
              item.type !== 'color' &&
              item.type !== 'none'
                ? true
                : false
            "
            @dragstart="(e) => startSidebarDrag(e, item)"
            @dragend="(e) => emitDragEnd(e, item)"
            class="draggable-item flex items-center p-2 bg-white rounded hover:bg-slate-100 max-w-sm"
            :class="{
              'cursor-move':
                item.type !== 'qrcode' &&
                item.type !== 'gradient' &&
                item.type !== 'color' &&
                item.type !== 'none',
              'cursor-pointer':
                item.type === 'qrcode' ||
                item.type === 'gradient' ||
                item.type === 'color' ||
                item.type === 'none',
            }"
            :data-type="item.type"
          >
            <div
              v-if="item.type === 'qrcode'"
              @click="qrcodeStore.qrCodetoggleModal"
            >
              <Icon :name="item.icon" class="w-5 h-5 mr-2" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </div>
            <div
              v-else-if="item.type === 'gradient'"
              @click="openGradientModal"
            >
              <Icon :name="item.icon" class="w-5 h-5 mr-2" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </div>
            <div v-else-if="item.type === 'color'" @click="openColorModal">
              <Icon :name="item.icon" class="w-5 h-5 mr-2" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </div>
            <div v-else-if="item.type === 'none'" @click="removeBackground">
              <Icon :name="item.icon" class="w-5 h-5 mr-2" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </div>
            <div v-else>
              <Icon :name="item.icon" class="w-5 h-5 mr-2" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Properties Tab Content -->
    <div v-if="store.activeTab === 'properties'" class="space-y-2">
      <Properties />
    </div>
    <!-- Layers Tab -->
    <div v-if="store.activeTab === 'layers'" class="space-y-2">
      <ul>
        <li
          v-for="layer in layers"
          :key="layer.id"
          @click="store.selectLayer(layer.id)"
          class="p-2 rounded cursor-pointer hover:bg-gray-200"
          :class="{ 'bg-blue-200': selectedLayer === layer.id }"
        >
          <div class="flex items-center justify-between">
            <span>{{ layer.name }} ({{ layer.type }})</span>
            <button
              @click.stop="store.toggleLayerVisibility(layer.id)"
              class="text-blue-500"
            >
              <Icon
                :name="layer.visible ? 'mdi:eye' : 'mdi:eye-off'"
                class="w-5 h-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useCanvasStore } from "@/stores/useCanvasStore";
import { usePageStore } from "@/stores/usePageStore";
import { useQRCodeStore } from "@/stores/useQRCodeStore";
const pageStore = usePageStore();
const qrcodeStore = useQRCodeStore();
const store = useCanvasStore();

defineProps({
  selectedElement: [String, Number, null],
  selectedElementType: String,
  layers: Array,
  selectedLayer: [Number, null],
  currentProperties: Object,
  displayOption: String,
});

const emit = defineEmits(["drag-start", "drag-end"]);

function startSidebarDrag(event, item) {
  emit("drag-start", item);
}

function emitDragEnd(event, item) {
  const x = event.clientX;
  const y = event.clientY;
  emit("drag-end", { item, x, y });
}

const openGroups = ref({
  user_info: false,
  event_info: false,
  qrcode: false,
  background: false,
  static_field: false,
  punching_area: false,
});

const designGroups = [
  {
    type: "user_info",
    label: "User Info",
    icon: "mdi:account",
    items: [
      {
        type: "h1",
        label: "LAST NAME",
        icon: "streamline-flex-color:copy-2-flat",
      },
      {
        type: "h1",
        label: "FIRST NAME",
        icon: "streamline-flex-color:copy-2-flat",
      },
      {
        type: "h1",
        label: "Full Name",
        icon: "streamline-flex-color:copy-2-flat",
      },
      { type: "p", label: "EMAIL", icon: "streamline-flex-color:copy-2-flat" },
      {
        type: "p",
        label: "COMPANY NAME",
        icon: "streamline-flex-color:copy-2-flat",
      },
      {
        type: "p",
        label: "DESIGNATION",
        icon: "streamline-flex-color:copy-2-flat",
      },
      { type: "p", label: "ROLE", icon: "streamline-flex-color:copy-2-flat" },
      {
        type: "p",
        label: "USER ID",
        icon: "streamline-flex-color:copy-2-flat",
      },
      {
        type: "eventlogo",
        label: "AVATAR",
        icon: "streamline-flex-color:copy-2-flat",
      },
    ],
  },
  {
    type: "event_info",
    label: "Event Info",
    icon: "mdi:calendar",
    items: [
      {
        type: "h1",
        label: "Event Name",
        icon: "streamline-flex-color:copy-2-flat",
      },
      { type: "p", label: "Venue", icon: "streamline-flex-color:copy-2-flat" },
      { type: "p", label: "Date", icon: "streamline-flex-color:copy-2-flat" },
      {
        type: "p",
        label: "ZIP Code",
        icon: "streamline-flex-color:copy-2-flat",
      },
      { type: "p", label: "City", icon: "streamline-flex-color:copy-2-flat" },
      {
        type: "img",
        label: "Event Logo",
        icon: "streamline-flex-color:copy-2-flat",
      },
    ],
  },
  {
    type: "qrcode",
    label: "QR Code",
    icon: "mdi:qrcode",
    items: [{ type: "qrcode", label: "QR Code", icon: "mdi:qrcode" }],
  },
  {
    type: "background",
    label: "Background",
    icon: "mdi:image",
    items: [
      { type: "background", label: "Image", icon: "mdi:image" },
      { type: "gradient", label: "Gradient", icon: "mdi:gradient" },
      { type: "color", label: "Color", icon: "mdi:palette" },
      { type: "none", label: "None", icon: "mdi:close" },
    ],
  },
  {
    type: "static_field",
    label: "Static Fields",
    icon: "mdi:shape",
    items: [
      { type: "p", label: "Text", icon: "mdi:text" },
      { type: "img", label: "Image", icon: "mdi:image" },
      { type: "rectangle", label: "Rectangle", icon: "mdi:rectangle" },
    ],
  },
  {
    type: "punching_area",
    label: "Punching Area Reference",
    icon: "mdi:gesture-tap",
    items: [
      { type: "punching_area", label: "None", icon: "mdi:close" },
      { type: "punching_area", label: "Top", icon: "mdi:arrow-up" },
      { type: "punching_area", label: "Bottom", icon: "mdi:arrow-down" },
    ],
  },
];

const toggleGroup = (groupType) => {
  openGroups.value[groupType] = !openGroups.value[groupType];
};

function openGradientModal() {
  store.showGradientModal = true;
}

function openColorModal() {
  store.showColorModal = true;
}

function removeBackground() {
  store.setBackground(null, store.activeSide);
}
</script>

<style scoped>
.transparent {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.transparent span {
  margin-left: 5px;
}
</style>
