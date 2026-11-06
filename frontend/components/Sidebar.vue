<template>
  <div v-if="sidebarInfo?.data?.designGroups?.length">
    <div class="flex m-2 mb-3 border border-slate-200/80 bg-slate-100 p-1 rounded-xl">
      <button
        class="flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition"
        :class="store.activeTab === 'design' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
        @click="store.activeTab = 'design'"
      >
        Design
      </button>
      <button
        class="flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition"
        :class="store.activeTab === 'themes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
        @click="store.activeTab = 'themes'"
      >
        Themes
      </button>
      <button
        class="flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition"
        :class="store.activeTab === 'properties' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
        @click="store.activeTab = 'properties'"
      >
        Properties
      </button>
      <button
        class="flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition"
        :class="store.activeTab === 'layers' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'"
        @click="store.activeTab = 'layers'"
      >
        Layers
      </button>
    </div>

    <!-- Design Tab Content -->
    <div
      v-if="store.activeTab === 'design' && pending == false"
      class="space-y-1"
    >
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
        v-for="group in sidebarInfo.data.designGroups"
        :key="group.type"
        class="bg-white border-b border-gray-300"
      >
        <!-- Group Header -->
        <div
          @click="toggleGroup(group.type)"
          class="flex items-center p-2 cursor-pointer hover:bg-gray-50"
        >
          <Icon
            :name="group.icon"
            class="text-2xl mr-2 bg-blue-600 flex-shrink-0"
            aria-hidden="true"
          />
          <span class="leading-none">{{ group.label }}</span>
          <Icon
            name="mdi:chevron-down"
            class="ml-auto text-2xl"
            :class="{
              'transform rotate-180': sidebarInfo.data.openGroups[group.type],
            }"
          />
        </div>

        <!-- Group Items -->
        <div
          v-if="sidebarInfo.data.openGroups[group.type]"
          class="pl-6 space-y-2 py-2"
        >
          <!-- No Punching Option (Hardcoded to ensure it always appears) -->
          <div
            v-if="group.type === 'punching_area'"
            class="flex items-center p-2 bg-white rounded hover:bg-slate-100 max-w-sm cursor-pointer"
            @click="setPunchingArea('none')"
          >
            <button
              class="w-full border rounded-md py-1 px-5 border-gray-300 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50"
              :class="selectedPunchArea('none')"
            >
              No Punching
            </button>
          </div>
          <div
            v-for="(item, itemIdx) in group.items"
            :key="`${group.type}-${item.type}-${item.label || itemIdx}`"
            :draggable="
              item.type !== 'img' &&
              item.type !== 'background' &&
              item.type !== 'gradient' &&
              item.type !== 'color' &&
              item.type !== 'none' &&
              item.type !== 'circle-center' &&
              item.type !== 'circle-left-right' &&
              item.type !== 'long-center' &&
              item.type !== 'long-left-right'
                ? true
                : false
            "
            @dragstart="(e) => startSidebarDrag(e, item)"
            @dragend="(e) => emitDragEnd(e, item)"
            @click="handleSidebarItemClick(item)"
            class="draggable-item flex items-center p-2 bg-white rounded hover:bg-slate-100 max-w-sm"
            :class="{
              'cursor-move':
                item.type !== 'img' &&
                item.type !== 'background' &&
                item.type !== 'gradient' &&
                item.type !== 'color' &&
                item.type !== 'none' &&
                item.type !== 'circle-center' &&
                item.type !== 'circle-left-right' &&
                item.type !== 'long-center' &&
                item.type !== 'long-left-right',
              'cursor-pointer':
                item.type === 'img' ||
                item.type === 'background' ||
                item.type === 'gradient' ||
                item.type === 'color' ||
                item.type === 'none' ||
                item.type === 'circle-center' ||
                item.type === 'circle-left-right' ||
                item.type === 'long-center' ||
                item.type === 'long-left-right',
            }"
            :data-type="item.type"
          >
            <!-- QR Code -->
            <div
              v-if="item.type === 'qrcode'"
              class="flex items-center flex-row"
            >
              <Icon
                :name="item.icon"
                class="text-xl mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <span class="leading-none">{{ item.label }}</span>
            </div>

            <!-- Image -->
            <div
              class="flex items-center"
              v-else-if="item.type === 'img'"
              @click="openImageUploadModal(item)"
            >
              <Icon
                :name="item.icon"
                class="text-xl mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <span class="leading-none">{{ item.label }}</span>
            </div>

            <!-- Background -->
            <div
              class="flex items-center"
              v-else-if="item.type === 'background'"
              @click="openImageUploadModal(item)"
            >
              <Icon
                :name="item.icon"
                class="text-xl mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <span class="leading-none">{{ item.label }}</span>
            </div>

            <!-- Gradient -->
            <div
              class="flex items-center"
              v-else-if="item.type === 'gradient'"
              @click="openGradientModal"
            >
              <Icon
                :name="item.icon"
                class="text-xl mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <span class="leading-none">{{ item.label }}</span>
            </div>

            <!-- Color -->
            <div
              class="flex items-center"
              v-else-if="item.type === 'color'"
              @click="openColorModal"
            >
              <Icon
                :name="item.icon"
                class="text-xl mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <span class="leading-none">{{ item.label }}</span>
            </div>


            <!-- Background None -->
            <div
              class="flex items-center"
              v-else-if="item.type === 'none'"
              @click="removeBackground"
            >
              <Icon
                :name="item.icon"
                class="text-xl mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <span class="leading-none">{{ item.label }}</span>
            </div>

            <!-- Circle Center -->
            <button
              @click="setPunchingArea('circle-center')"
              class="w-full border rounded-md py-1 px-5 border-gray-300 flex items-center justify-center"
              :class="selectedPunchArea(item.type)"
              v-else-if="item.type === 'circle-center'"
            >
              <div
                class="w-5 h-5 bg-transparent border border-gray-300 rounded-xl z-10"
              ></div>
            </button>
            <!-- Circle Left Right -->
            <button
              @click="setPunchingArea('circle-left-right')"
              class="w-full border rounded-md py-1 px-5 border-gray-300 flex items-center justify-between"
              :class="selectedPunchArea(item.type)"
              v-else-if="item.type === 'circle-left-right'"
            >
              <div
                class="w-5 h-5 bg-transparent border border-gray-300 rounded-xl z-10"
              ></div>
              <div
                class="w-5 h-5 bg-transparent border border-gray-300 rounded-xl z-10"
              ></div>
            </button>
            <!-- Long Center -->
            <button
              @click="setPunchingArea('long-center')"
              class="w-full border rounded-md py-1 px-5 border-gray-300 flex items-center justify-center"
              :class="selectedPunchArea(item.type)"
              v-else-if="item.type === 'long-center'"
            >
              <div
                class="w-16 h-4 bg-transparent border border-gray-300 rounded-xl z-10"
              ></div>
            </button>
            <!-- Long Left Right -->
            <button
              @click="setPunchingArea('long-left-right')"
              class="w-full border rounded-md py-1 px-5 border-gray-300 flex items-center justify-between"
              :class="selectedPunchArea(item.type)"
              v-else-if="item.type === 'long-left-right'"
            >
              <div
                class="w-16 h-4 bg-transparent border border-gray-300 rounded-xl z-10"
              ></div>
              <div
                class="w-16 h-4 bg-transparent border border-gray-300 rounded-xl z-10"
              ></div>
            </button>

            <!-- Default Items -->
            <div class="flex items-center" v-else>
              <Icon
                :name="item.icon"
                class="text-xl mr-2 flex-shrink-0"
                aria-hidden="true"
              />
              <span class="leading-none">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Themes Tab Content -->
    <div v-if="store.activeTab === 'themes'" class="space-y-3 p-1">
      <div class="flex items-center justify-between pb-1 border-b border-slate-100">
        <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Ready-Made Badge Themes</h3>
        <span class="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
          {{ filteredBadgeThemes.length }} / {{ badgeThemes.length }} Themes
        </span>
      </div>
      <p class="text-xs text-slate-500">
        Industry-standard templates tailored for real-world conferences, business expos, summits, and workshops.
      </p>

      <!-- Search & Category Filter Navigation -->
      <div class="space-y-2">
        <!-- Search Input -->
        <div class="relative">
          <Icon name="mdi:magnify" class="absolute left-2.5 top-2.5 text-slate-400 text-sm" />
          <input
            v-model="themeSearch"
            type="text"
            placeholder="Search events (e.g. AI, Climate, Gala)..."
            class="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition"
          />
          <button
            v-if="themeSearch"
            type="button"
            @click="themeSearch = ''"
            class="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
          >
            <Icon name="mdi:close-circle" class="text-sm" />
          </button>
        </div>

        <!-- Category Horizontal Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <button
            v-for="cat in themeCategories"
            :key="cat.id"
            type="button"
            @click="activeCategory = cat.id"
            class="px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition cursor-pointer flex-shrink-0"
            :class="activeCategory === cat.id ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Themes Grid / List -->
      <div v-if="filteredBadgeThemes.length > 0" class="space-y-3">
        <div
          v-for="theme in filteredBadgeThemes"
          :key="theme.id"
          class="group border border-slate-200 hover:border-indigo-400 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white cursor-pointer"
          @click="applyBadgeTheme(theme)"
        >
          <!-- Theme Preview Banner -->
          <div
            class="h-24 w-full p-3 flex flex-col justify-between relative overflow-hidden text-white"
            :style="{ background: theme.previewBg }"
          >
            <div class="flex items-center justify-between z-10">
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm bg-black/40 border border-white/20">
                  {{ theme.badge }}
                </span>
                <span class="text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm bg-white/20 text-white/90">
                  {{ theme.categoryLabel }}
                </span>
              </div>
              <span
                v-if="theme.punchArea && theme.punchArea !== 'none'"
                class="w-3.5 h-3.5 rounded-full bg-white/80 shadow-inner flex items-center justify-center border border-black/20"
                title="Punch Hole Included"
              ></span>
            </div>

            <div class="z-10 flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full border-2 border-white/80 overflow-hidden flex-shrink-0 bg-white/20 shadow">
                <img :src="theme.previewAvatar" class="w-full h-full object-cover" />
              </div>
              <div class="truncate">
                <div class="text-xs font-bold leading-tight drop-shadow truncate">{{ theme.previewName }}</div>
                <div class="text-[10px] opacity-90 truncate">{{ theme.previewRole }}</div>
              </div>
            </div>
          </div>

          <!-- Theme Details Footer -->
          <div class="p-3 bg-white flex items-center justify-between">
            <div class="pr-2 truncate">
              <div class="text-xs font-bold text-slate-800 truncate">{{ theme.name }}</div>
              <div class="text-[11px] text-slate-500 line-clamp-1">{{ theme.description }}</div>
            </div>
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white rounded-lg transition flex-shrink-0 cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <!-- No Results State -->
      <div v-else class="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
        <Icon name="mdi:filter-remove-outline" class="text-2xl text-slate-400 mx-auto" />
        <div class="text-xs font-bold text-slate-700">No themes found</div>
        <p class="text-[11px] text-slate-400">Try searching with a different keyword or select "All Events".</p>
        <button
          type="button"
          @click="activeCategory = 'all'; themeSearch = ''"
          class="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
        >
          Reset filters
        </button>
      </div>
    </div>

    <!-- Properties Tab Content -->
    <div v-if="store.activeTab === 'properties'" class="space-y-2">
      <Properties />
    </div>
    <div v-if="store.activeTab === 'layers'" class="space-y-2">
      <ul>
        <li
          v-for="(layer, index) in layers"
          :key="layer.id"
          draggable="true"
          @dragstart="startLayerDrag($event, index)"
          @dragover.prevent
          @drop="onLayerDrop($event, index)"
          @click="selectLayer(layer.id)"
          class="p-2 rounded cursor-move hover:bg-gray-200 border border-gray-200"
          :class="{ 'bg-blue-200': selectedLayer === layer.id }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="mdi:drag" class="text-xl" />
              <span> {{ layer.name }} ({{ layer.type }})</span>
            </div>
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
import { ref, computed } from "vue";

const pageStore = usePageStore();
const qrcodeStore = useQRCodeStore();
const store = useCanvasStore();

const themeSearch = ref("");
const activeCategory = ref("all");

const themeCategories = [
  { id: "all", label: "All Events" },
  { id: "tech", label: "Tech & AI" },
  { id: "corporate", label: "Corporate" },
  { id: "course", label: "Courses & Sprints" },
  { id: "academic", label: "Academic & Medical" },
  { id: "diplomacy", label: "Diplomacy" },
  { id: "green", label: "Green Energy" },
  { id: "social", label: "Gala & Charity" },
  { id: "media", label: "Media & Arts" },
];

defineProps({
  selectedElement: [String, Number, null],
  selectedElementType: String,
  layers: Array,
  selectedLayer: [Number, null],
  currentProperties: Object,
  displayOption: String,
});

const emit = defineEmits(["drag-start", "drag-end", "item-added"]);

function startLayerDrag(event, index) {
  event.dataTransfer.setData("text/plain", index);
}

function onLayerDrop(event, dropIndex) {
  event.preventDefault();
  const dragIndex = parseInt(event.dataTransfer.getData("text/plain"));
  if (dragIndex === dropIndex) return;

  const boxes =
    store.activeSide === "front" ? store.frontBoxes : store.backBoxes;
  const [movedBox] = boxes.splice(dragIndex, 1);
  boxes.splice(dropIndex, 0, movedBox);

  boxes.forEach((box, index) => {
    box.zIndex = boxes.length - index; // Higher index = lower z-index
  });

  if (store.activeSide === "front") {
    store.frontBoxes = [...boxes]; // Trigger reactivity for front side
  } else {
    store.backBoxes = [...boxes]; // Trigger reactivity for back side
  }
  store.recordHistory();
}

function selectLayer(layerId) {
  store.selectLayer(layerId);
}

const defaultSidebarInfo = {
  data: {
    openGroups: {
      user_info: true,
      event_info: false,
      qr_code: false,
      background: false,
      static_field: false,
      punching_area: false,
    },
    designGroups: [
      {
        type: "user_info",
        label: "User / Attendee Info",
        icon: "mdi:account",
        items: [
          { type: "h1", label: "Full Name", icon: "mdi:format-title" },
          { type: "h1", label: "First Name", icon: "mdi:format-title" },
          { type: "h1", label: "Last Name", icon: "mdi:format-title" },
          { type: "p", label: "Company", icon: "mdi:domain" },
          { type: "p", label: "Designation", icon: "mdi:badge-account-horizontal" },
          { type: "p", label: "Category / Role", icon: "mdi:shield-account" },
          { type: "p", label: "Email", icon: "mdi:email-outline" },
          { type: "p", label: "ID Number", icon: "mdi:card-account-details-outline" },
          { type: "avatar", label: "Profile Photo / Avatar", icon: "mdi:account-circle" },
        ],
      },
      {
        type: "event_info",
        label: "Event & Organization",
        icon: "mdi:calendar-star",
        items: [
          { type: "h1", label: "Event / Org Title", icon: "mdi:format-title" },
          { type: "p", label: "Venue / Location", icon: "mdi:map-marker-outline" },
          { type: "p", label: "Date & Year", icon: "mdi:calendar" },
          { type: "img", label: "Organization Logo", icon: "mdi:image-filter-vintage" },
        ],
      },
      {
        type: "qr_code",
        label: "QR & Barcode",
        icon: "mdi:qrcode-scan",
        items: [
          { type: "qrcode", label: "Dynamic QR Code", icon: "mdi:qrcode" },
          { type: "barcode", label: "Scan Barcode", icon: "mdi:barcode" },
        ],
      },
      {
        type: "static_field",
        label: "Design Elements",
        icon: "mdi:shape-outline",
        items: [
          { type: "h1", label: "Heading Text", icon: "mdi:format-header-1" },
          { type: "p", label: "Paragraph Text", icon: "mdi:text-box-outline" },
          { type: "img", label: "Custom Image / Icon", icon: "mdi:image-outline" },
          { type: "line", label: "Color Stripe / Banner", icon: "mdi:minus" },
        ],
      },
      {
        type: "background",
        label: "Card Background",
        icon: "mdi:palette-outline",
        items: [
          { type: "color", label: "Solid Color", icon: "mdi:palette" },
          { type: "gradient", label: "Gradient", icon: "mdi:gradient" },
          { type: "img", label: "Upload BG Image", icon: "mdi:image" },
          { type: "none", label: "Transparent / None", icon: "mdi:close-circle-outline" },
        ],
      },
      {
        type: "punching_area",
        label: "Lanyard Punch Hole",
        icon: "mdi:circle-outline",
        items: [
          { type: "circle-center", label: "Round Hole (Center)", icon: "mdi:circle" },
          { type: "circle-left-right", label: "Dual Holes (Left & Right)", icon: "mdi:dots-horizontal" },
          { type: "long-center", label: "Lanyard Slot (Center)", icon: "mdi:rectangle" },
        ],
      },
    ],
  },
};

const sidebarInfo = ref(defaultSidebarInfo);
const pending = ref(false);
function startSidebarDrag(event, item) {
  emit("drag-start", item);
}

function emitDragEnd(event, item) {
  const x = event.clientX;
  const y = event.clientY;
  emit("drag-end", { item, x, y });
}

function handleSidebarItemClick(item) {
  if (
    item.type === "img" ||
    item.type === "background" ||
    item.type === "gradient" ||
    item.type === "color" ||
    item.type === "none" ||
    item.type === "circle-center" ||
    item.type === "circle-left-right" ||
    item.type === "long-center" ||
    item.type === "long-left-right"
  ) {
    return;
  }
  const canvasW = store.dropzone?.offsetWidth || pageStore.presetWidth * 3.78 || 397;
  const canvasH = store.dropzone?.offsetHeight || pageStore.presetHeight * 3.78 || 560;
  const elW = item.type === "avatar" || item.type === "qrcode" ? 95 : 200;
  const elH = item.type === "avatar" || item.type === "qrcode" ? 95 : (item.type === "line" ? 4 : 32);
  const left = Math.round((canvasW - elW) / 2);
  const top = Math.round((canvasH - elH) / 2);
  store.addElementFromDrag(item, { left, top });
  emit("item-added", item);
}

function toggleGroup(groupType) {
  sidebarInfo.value.data.openGroups[groupType] =
    !sidebarInfo.value.data.openGroups[groupType];
}

function openImageUploadModal(item) {
  store.imageItem = item;
  store.showImageModal = true;
}

function openGradientModal() {
  store.showGradientModal = true;
}

function openColorModal() {
  store.showColorModal = true;
}

function removeBackground() {
  store.setBackground(null, store.activeSide);
}

function setPunchingArea(area) {
  selectedPunchArea(area);
  store.setPunchArea(area, store.activeSide);
}

const selectedPunchArea = (area) => {
  if (area === "none") {
    return !store.punchArea ? "border border-blue-500 bg-blue-50" : "";
  }
  switch (area) {
    case "circle-center":
      return store.punchCircle === "circle-center" && store.punchArea
        ? "border border-blue-500 bg-blue-50"
        : "";
    case "circle-left-right":
      return store.punchCircle === "circle-left-right" && store.punchArea
        ? "border border-blue-500 bg-blue-50"
        : "";
    case "long-center":
      return store.punchLong === "long-center" && store.punchArea
        ? "border border-blue-500 bg-blue-50"
        : "";
    case "long-left-right":
      return store.punchLong === "long-left-right" && store.punchArea
        ? "border border-blue-500 bg-blue-50"
        : "";
    default:
      return "";
  }
};
const makeThemeBox = (
  id,
  type,
  label,
  text,
  left,
  top,
  width,
  height,
  custom = {}
) => ({
  id,
  key: `${type}-${id}`,
  type,
  label,
  text,
  position: { left, top },
  isSelected: false,
  isDragging: false,
  visible: true,
  properties: {
    size: { width, height },
    rotation: 0,
    font: '"Cairo", sans-serif',
    fontWeight: custom.fontWeight || (type === "h1" ? "bold" : "normal"),
    fontStyle: custom.fontStyle || "normal",
    fontSize: custom.fontSize || (type === "h1" ? "20px" : "13px"),
    fillColor: custom.fillColor || "#000000",
    fillTransparency: true,
    imagePosition: "center",
    objectFit: "cover",
    textDecoration: "none",
    color: custom.color || "#1e293b",
    textAlign: custom.textAlign || "center",
    verticalAlign: "middle",
    horizontalAlign: custom.textAlign || "center",
    textTransform: custom.textTransform || "none",
    src: "",
    strokeColor: "#000000",
    strokeWidth: 0,
    associatedData: "",
    content: text,
    x: left,
    y: top,
    text,
    direction: "ltr",
    qrcode: {
      value: custom.qrValue || "https://porichoyid.softcredible.com",
      variant: "pixelated",
      radius: 1,
      blackColor: custom.qrBlackColor || "#000000",
      whiteColor: custom.qrWhiteColor || "transparent",
    },
    avatar: {
      showBorder: true,
      showRing: false,
      shape: custom.avatarShape || "circle",
      radius: custom.avatarRadius || 32,
      customClipPath: "",
      containerStyle: {},
      avatar_src:
        custom.avatarSrc ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      imageStyle: {},
    },
    ...custom,
  },
});

const badgeThemes = [
  // --- TECH & AI ---
  {
    id: "modern-conference",
    name: "TechCon Global Summit",
    category: "tech",
    categoryLabel: "Tech & AI",
    description: "Vibrant blue gradient with round lanyard punch and keynote speaker layout",
    badge: "TECH SUMMIT",
    previewBg: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    previewName: "Elena Rostova",
    previewRole: "Keynote Speaker",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Event Title", "TECHCON GLOBAL SUMMIT 2026", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(2, "avatar", "Profile Photo", "", Math.round((canvasW - 100) / 2), 92, 100, 100, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Elena Rostova", Math.round((canvasW - 320) / 2), 204, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Designation", "KEYNOTE SPEAKER", Math.round((canvasW - 300) / 2), 242, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#a5f3fc",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Company", "OpenAI Research Labs", Math.round((canvasW - 300) / 2), 268, 300, 26, {
        fontSize: "12px",
        color: "#e2e8f0",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/verify/tech-1001",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Access Tag", "★ ALL ACCESS VIP PASS ★", Math.round((canvasW - 280) / 2), 412, 280, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
    ],
  },
  {
    id: "ai-robotics-congress",
    name: "World AI & Robotics Congress",
    category: "tech",
    categoryLabel: "Tech & AI",
    description: "Deep cyber-violet theme with neon magenta accents and slot punch",
    badge: "AI SUMMIT",
    previewBg: "linear-gradient(135deg, #090d16 0%, #31104b 55%, #701a75 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    previewName: "Dr. Marcus Vance",
    previewRole: "Principal AI Scientist",
    punchArea: "long-center",
    frontBackground: "linear-gradient(135deg, #090d16 0%, #31104b 55%, #701a75 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Event Title", "WORLD AI & ROBOTICS CONGRESS", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#f472b6",
      }),
      makeThemeBox(2, "avatar", "Profile Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Dr. Marcus Vance", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "21px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Designation", "PRINCIPAL AI SCIENTIST", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fbcfe8",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Company", "DeepMind Autonomous Robotics", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#cbd5e1",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/verify/ai-2026",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Access Tag", "◆ EXECUTOR & PRESENTER PASS ◆", Math.round((canvasW - 280) / 2), 412, 280, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#f472b6",
      }),
    ],
  },
  {
    id: "cyber-sentinel-con",
    name: "CyberSentinel Threat Defense Summit",
    category: "tech",
    categoryLabel: "Tech & AI",
    description: "Terminal slate & matrix emerald with high security clearance tags",
    badge: "CYBERSEC",
    previewBg: "linear-gradient(135deg, #022c22 0%, #064e3b 60%, #0f172a 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    previewName: "Kavita Rao",
    previewRole: "Threat Intel Architect",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #022c22 0%, #064e3b 60%, #0f172a 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Event Title", "CYBERSENTINEL DEFENSE 2026", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#34d399",
      }),
      makeThemeBox(2, "avatar", "Profile Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "square",
        avatarRadius: 12,
        avatarSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Kavita Rao", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Designation", "THREAT INTEL ARCHITECT", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#6ee7b7",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Company", "ZeroTrust Global SOC", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#94a3b8",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/sec/kavita",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Access Tag", "[ CLEARANCE LEVEL: TS-ALPHA ]", Math.round((canvasW - 280) / 2), 412, 280, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#34d399",
      }),
    ],
  },
  {
    id: "web3-devcon",
    name: "Web3 & Blockchain Protocol Devcon",
    category: "tech",
    categoryLabel: "Tech & AI",
    description: "Electric cyan and dark void gradient for decentralized builders",
    badge: "WEB3 DEV",
    previewBg: "linear-gradient(135deg, #030712 0%, #111827 50%, #0369a1 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    previewName: "Arjun Nair",
    previewRole: "Core Protocol Engineer",
    punchArea: "long-center",
    frontBackground: "linear-gradient(135deg, #030712 0%, #111827 50%, #0369a1 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Event Title", "WEB3 PROTOCOL DEVCON '26", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#38bdf8",
      }),
      makeThemeBox(2, "avatar", "Profile Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Arjun Nair", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Designation", "CORE PROTOCOL ENGINEER", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#7dd3fc",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Company", "Ethereum Foundation Hub", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#94a3b8",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/web3/arjun",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Access Tag", "BUILDER BADGE ⚡ HACKER ACCESS", Math.round((canvasW - 280) / 2), 412, 280, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#38bdf8",
      }),
    ],
  },

  // --- CORPORATE & BUSINESS ---
  {
    id: "corporate-executive",
    name: "Corporate Executive Staff ID",
    category: "corporate",
    categoryLabel: "Corporate",
    description: "Crisp corporate navy & platinum with slot punch and employee ID barcode",
    badge: "ENTERPRISE",
    previewBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    previewName: "Sarah Ahmed",
    previewRole: "VP of Engineering",
    punchArea: "long-center",
    frontBackground: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Company", "APEX GLOBAL HOLDINGS", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#94a3b8",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 100) / 2), 92, 100, 100, {
        avatarShape: "square",
        avatarRadius: 8,
        avatarSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Sarah Ahmed", Math.round((canvasW - 320) / 2), 204, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Designation", "VP OF ENGINEERING", Math.round((canvasW - 300) / 2), 242, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#60a5fa",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "ID", "EMPLOYEE ID: APX-99420", Math.round((canvasW - 300) / 2), 268, 300, 26, {
        fontSize: "12px",
        color: "#cbd5e1",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 304, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/staff/sarah-ahmed",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "HEADQUARTERS ALL-FLOORS ACCESS", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "10px",
        fontWeight: "bold",
        color: "#94a3b8",
      }),
    ],
  },
  {
    id: "fintech-banking-expo",
    name: "FinTech & Digital Banking Expo",
    category: "corporate",
    categoryLabel: "Corporate",
    description: "Royal blue and sharp gold accents for banking and investment summits",
    badge: "FINTECH",
    previewBg: "linear-gradient(135deg, #1e3a8a 0%, #172554 60%, #0f172a 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80",
    previewName: "David Sterling",
    previewRole: "Head of Digital Assets",
    punchArea: "long-center",
    frontBackground: "linear-gradient(135deg, #1e3a8a 0%, #172554 60%, #0f172a 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Event Title", "GLOBAL FINTECH EXPO 2026", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#f59e0b",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "David Sterling", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Designation", "HEAD OF DIGITAL ASSETS", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fbbf24",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Company", "Morgan & Croft Financial", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#cbd5e1",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/fintech/david",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "★ EXECUTIVE ROUNDTABLE DELEGATE ★", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "10px",
        fontWeight: "bold",
        color: "#f59e0b",
      }),
    ],
  },
  {
    id: "venture-capital-forum",
    name: "Venture Capital & Investor Conclave",
    category: "corporate",
    categoryLabel: "Corporate",
    description: "Obsidian black and warm champagne gold for high-net-worth investor galas",
    badge: "INVESTOR",
    previewBg: "linear-gradient(135deg, #18181b 0%, #27272a 60%, #000000 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    previewName: "Alexander Sterling",
    previewRole: "Managing Director",
    punchArea: "long-center",
    frontBackground: "linear-gradient(135deg, #18181b 0%, #27272a 60%, #000000 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Event Title", "VENTURE CAPITAL CONCLAVE", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fbbf24",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Alexander Sterling", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Designation", "MANAGING GENERAL PARTNER", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fde047",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Company", "Sterling Horizon Capital", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#e4e4e7",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/vc/sterling",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "★ GENERAL PARTNER VIP BADGE ★", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#fbbf24",
      }),
    ],
  },

  // --- COURSES, BOOTCAMPS & SPRINTS ---
  {
    id: "fullstack-bootcamp",
    name: "Full-Stack Dev Bootcamp Sprint",
    category: "course",
    categoryLabel: "Courses & Sprints",
    description: "Modern indigo & violet gradient for coding academies and hackathon fellows",
    badge: "DEV FELLOW",
    previewBg: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    previewName: "Tanzim Hasan",
    previewRole: "Full-Stack Engineer Fellow",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6366f1 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Course Title", "FULL-STACK MASTERY SPRINT", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Tanzim Hasan", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "ENGINEERING FELLOW", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#93c5fd",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Cohort", "Cohort 14 • Deshicoder Academy", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#e0e7ff",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/cohort/tanzim",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "CERTIFIED DEVELOPER CANDIDATE", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#a5b4fc",
      }),
    ],
  },
  {
    id: "ux-design-sprint",
    name: "UI/UX Product Design Sprint",
    category: "course",
    categoryLabel: "Courses & Sprints",
    description: "Coral, crimson & warm sun gradient for creative designers and design sprint workshops",
    badge: "DESIGN SPRINT",
    previewBg: "linear-gradient(135deg, #881337 0%, #be123c 50%, #f43f5e 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    previewName: "Maya Lin",
    previewRole: "Senior Product Designer",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #881337 0%, #be123c 50%, #f43f5e 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Course Title", "UI/UX PRODUCT DESIGN SPRINT", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fecdd3",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Maya Lin", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "PRODUCT DESIGN MENTOR", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fef08a",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Studio", "Figma Design Collective", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#ffe4e6",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/design/maya",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "✦ MASTERCLASS LAB ACCESS ✦", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#fef08a",
      }),
    ],
  },
  {
    id: "data-science-mastery",
    name: "Applied AI & Data Science Lab",
    category: "course",
    categoryLabel: "Courses & Sprints",
    description: "Dark teal & aqua green theme for intensive data labs and AI researchers",
    badge: "AI LAB",
    previewBg: "linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #14b8a6 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    previewName: "Rahim Chowdhury",
    previewRole: "Data Science Fellow",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #14b8a6 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Course Title", "APPLIED DATA SCIENCE LAB", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#5eead4",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "square",
        avatarRadius: 16,
        avatarSrc: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Rahim Chowdhury", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "DATA SCIENCE FELLOW", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#99f6e4",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Lab", "National Computing Center", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#ccfbf1",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/lab/rahim",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "RESEARCH SPRINT CREDENTIAL", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#5eead4",
      }),
    ],
  },

  // --- ACADEMIC & MEDICAL ---
  {
    id: "world-medical-congress",
    name: "World Medical & Health Summit",
    category: "academic",
    categoryLabel: "Academic & Medical",
    description: "Clean medical cyan and navy with surgeon and doctor credentials",
    badge: "MEDICAL",
    previewBg: "linear-gradient(135deg, #0e7490 0%, #0369a1 50%, #1e3a8a 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80",
    previewName: "Dr. Farah Tanvir",
    previewRole: "Chief Neurosurgeon",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #0e7490 0%, #0369a1 50%, #1e3a8a 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Congress Title", "WORLD MEDICAL SUMMIT 2026", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#a5f3fc",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Dr. Farah Tanvir", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "CHIEF NEUROSURGEON", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#bae6fd",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Hospital", "Johns Hopkins Medical Mission", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#e0f2fe",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/med/farah",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "✚ DELEGATE • CLINICAL FELLOW ✚", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#a5f3fc",
      }),
    ],
  },
  {
    id: "academic-research-colloquium",
    name: "Science & Research Colloquium",
    category: "academic",
    categoryLabel: "Academic & Medical",
    description: "Oxford deep burgundy & cream gold for university researchers and professors",
    badge: "ACADEMIC",
    previewBg: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 60%, #991b1b 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    previewName: "Prof. Arthur Pendelton",
    previewRole: "Chair of Astrophysics",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 60%, #991b1b 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Congress Title", "SCIENCE & RESEARCH COLLOQUIUM", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#fef08a",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Prof. Arthur Pendelton", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "21px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "CHAIR OF ASTROPHYSICS", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fef08a",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "University", "Oxford Institute of Physics", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#fee2e2",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/edu/arthur",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "FACULTY & KEYNOTE HONOREE", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#fef08a",
      }),
    ],
  },
  {
    id: "dental-biotech-symposium",
    name: "Dental & Clinical Biotech Expo",
    category: "academic",
    categoryLabel: "Academic & Medical",
    description: "Emerald mint and crisp white for clinical practitioners and dental specialists",
    badge: "CLINICAL",
    previewBg: "linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    previewName: "Dr. Nadia Haque",
    previewRole: "Clinical Director",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Congress Title", "DENTAL BIOTECH EXPO 2026", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#a7f3d0",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Dr. Nadia Haque", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "CLINICAL ORTHODONTIST", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#6ee7b7",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Hospital", "Apex Dental Healthcare", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#d1fae5",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/dent/nadia",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "CERTIFIED PRACTITIONER PASS", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#a7f3d0",
      }),
    ],
  },

  // --- DIPLOMACY & POLITICAL ---
  {
    id: "un-diplomatic-mission",
    name: "Model United Nations (MUN)",
    category: "diplomacy",
    categoryLabel: "Diplomacy",
    description: "Official UN blue & diplomatic gold for delegates and ambassadors",
    badge: "MUN DELEGATE",
    previewBg: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 60%, #0369a1 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    previewName: "Ambassador S. Rahman",
    previewRole: "Permanent Representative",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 60%, #0369a1 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Mission Title", "MODEL UNITED NATIONS 2026", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fef08a",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Ambassador S. Rahman", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "21px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "CHIEF DIPLOMATIC DELEGATE", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fef08a",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Country", "General Assembly Delegation", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#e0f2fe",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/mun/rahman",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "★ GENERAL ASSEMBLY FLOOR ACCESS ★", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "10px",
        fontWeight: "bold",
        color: "#fef08a",
      }),
    ],
  },
  {
    id: "smart-governance-summit",
    name: "Governance & Smart Cities Assembly",
    category: "diplomacy",
    categoryLabel: "Diplomacy",
    description: "Formal slate & bronze gold for parliamentary and ministry summits",
    badge: "GOVERNANCE",
    previewBg: "linear-gradient(135deg, #1e293b 0%, #334155 60%, #475569 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    previewName: "Hon. Yasmin Kamal",
    previewRole: "Ministry Policy Delegate",
    punchArea: "long-center",
    frontBackground: "linear-gradient(135deg, #1e293b 0%, #334155 60%, #475569 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Summit Title", "SMART GOVERNANCE SUMMIT", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fbbf24",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "square",
        avatarRadius: 8,
        avatarSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Hon. Yasmin Kamal", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "21px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "PUBLIC POLICY DIRECTOR", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fde68a",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Ministry", "Ministry of Digital Transformation", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#cbd5e1",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/gov/yasmin",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "MINISTERIAL PLENARY PASS", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#fbbf24",
      }),
    ],
  },

  // --- GREEN ENERGY & ENVIRONMENTAL ---
  {
    id: "earth-climate-cop",
    name: "COP30 Climate Action Summit",
    category: "green",
    categoryLabel: "Green Energy",
    description: "Deep forest emerald & sunny amber for climate delegates and NGO leaders",
    badge: "CLIMATE ACTION",
    previewBg: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    previewName: "Amina Al-Mansoor",
    previewRole: "Sustainability Director",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Summit Title", "COP30 CLIMATE ACTION SUMMIT", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fef08a",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Amina Al-Mansoor", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "SUSTAINABILITY DIRECTOR", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#a7f3d0",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Org", "Global Earth Foundation", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#d1fae5",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/cop/amina",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "🌱 OFFICIAL NGO DELEGATE 🌱", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#fef08a",
      }),
    ],
  },
  {
    id: "cleantech-energy-expo",
    name: "CleanTech & Solar Global Expo",
    category: "green",
    categoryLabel: "Green Energy",
    description: "Vibrant solar lime and forest green for clean energy engineers and exhibitors",
    badge: "CLEANTECH",
    previewBg: "linear-gradient(135deg, #14532d 0%, #15803d 50%, #16a34a 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    previewName: "Felix Chen",
    previewRole: "Renewable Energy Architect",
    punchArea: "long-center",
    frontBackground: "linear-gradient(135deg, #14532d 0%, #15803d 50%, #16a34a 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Expo Title", "CLEANTECH & SOLAR WORLD EXPO", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fde047",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Felix Chen", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "RENEWABLE ENERGY ARCHITECT", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#bbf7d0",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Company", "Solaria Global Tech", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#dcfce7",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/cleantech/felix",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "⚡ SOLAR PAVILION EXHIBITOR ⚡", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#fde047",
      }),
    ],
  },

  // --- GALA, CHARITY & SOCIAL ---
  {
    id: "hope-charity-gala",
    name: "Hope Foundation Charity Gala",
    category: "social",
    categoryLabel: "Gala & Charity",
    description: "Royal midnight navy & champagne gold for philanthropy and foundation dinners",
    badge: "CHARITY GALA",
    previewBg: "linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #31104b 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    previewName: "Victoria Beaumont",
    previewRole: "Platinum Philanthropist",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #31104b 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Gala Title", "HOPE FOUNDATION CHARITY GALA", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#f59e0b",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Victoria Beaumont", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "PLATINUM PATRON", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fde68a",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Org", "Beaumont Endowment Fund", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#e2e8f0",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/gala/victoria",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "★ VIP TABLE • HONORED GUEST ★", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#f59e0b",
      }),
    ],
  },
  {
    id: "humanitarian-fellowship",
    name: "Humanitarian Rotary Fellowship",
    category: "social",
    categoryLabel: "Gala & Charity",
    description: "Deep burgundy & rose for community leaders, fellowship, and rotary assemblies",
    badge: "FELLOWSHIP",
    previewBg: "linear-gradient(135deg, #4c0519 0%, #831843 60%, #9f1239 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    previewName: "Engr. Rezaul Karim",
    previewRole: "Distinguished Fellow",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #4c0519 0%, #831843 60%, #9f1239 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Gala Title", "ROTARY HUMANITARIAN FELLOWSHIP", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#fecdd3",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Engr. Rezaul Karim", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "21px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "DISTINGUISHED FELLOW", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fde047",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Club", "Rotary Club International", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#ffe4e6",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/rotary/karim",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "DISTRICT 3281 • HONORARY LIFE MEMBER", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "10px",
        fontWeight: "bold",
        color: "#fecdd3",
      }),
    ],
  },

  // --- MEDIA, ARTS & FESTIVALS ---
  {
    id: "indie-film-arts",
    name: "Horizon International Film Festival",
    category: "media",
    categoryLabel: "Media & Arts",
    description: "Cinematic noir obsidian & neon amber for directors, jury members, and press",
    badge: "FILM FEST",
    previewBg: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    previewName: "Soraya Vane",
    previewRole: "Jury President / Director",
    punchArea: "long-center",
    frontBackground: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Fest Title", "HORIZON FILM FESTIVAL 2026", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#f59e0b",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "square",
        avatarRadius: 8,
        avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Soraya Vane", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "JURY PRESIDENT & DIRECTOR", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fbbf24",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Studio", "CineWorld Guild", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#e4e4e7",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/film/soraya",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "🎬 ALL ACCESS PRESS & RED CARPET 🎬", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "10px",
        fontWeight: "bold",
        color: "#f59e0b",
      }),
    ],
  },
  {
    id: "soundwave-music-fest",
    name: "SoundWave Live Music Festival",
    category: "media",
    categoryLabel: "Media & Arts",
    description: "Vibrant electric magenta & deep purple with artist all-access credentials",
    badge: "MUSIC FEST",
    previewBg: "linear-gradient(135deg, #581c87 0%, #be185d 50%, #f43f5e 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    previewName: "Leo Valen",
    previewRole: "Headlining Artist",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #581c87 0%, #be185d 50%, #f43f5e 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Fest Title", "SOUNDWAVE MUSIC FESTIVAL", Math.round((canvasW - 320) / 2), 52, 320, 32, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fde047",
      }),
      makeThemeBox(2, "avatar", "Photo", "", Math.round((canvasW - 96) / 2), 92, 96, 96, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Leo Valen", Math.round((canvasW - 320) / 2), 202, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Role", "HEADLINING ARTIST", Math.round((canvasW - 300) / 2), 240, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fde047",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Stage", "Neon Main Stage • Backstage VIP", Math.round((canvasW - 300) / 2), 266, 300, 26, {
        fontSize: "12px",
        color: "#fae8ff",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/artist/leo",
        qrWhiteColor: "#ffffff",
      }),
      makeThemeBox(7, "p", "Tag", "🎸 ARTIST ALL-ACCESS BACKSTAGE PASS 🎸", Math.round((canvasW - 300) / 2), 412, 300, 26, {
        fontSize: "10px",
        fontWeight: "bold",
        color: "#fde047",
      }),
    ],
  },
];

const filteredBadgeThemes = computed(() => {
  return badgeThemes.filter((t) => {
    const matchesCat =
      activeCategory.value === "all" || t.category === activeCategory.value;
    if (!matchesCat) return false;
    if (!themeSearch.value.trim()) return true;
    const query = themeSearch.value.toLowerCase().trim();
    return (
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.badge.toLowerCase().includes(query) ||
      (t.categoryLabel && t.categoryLabel.toLowerCase().includes(query))
    );
  });
});

function applyBadgeTheme(theme) {
  const canvasW = 397;
  const boxes = theme.buildFrontBoxes(canvasW);
  store.applyTheme({
    name: theme.name,
    punchArea: theme.punchArea,
    frontBackground: theme.frontBackground,
    backBackground: "#ffffff",
    frontBoxes: boxes,
    backBoxes: [],
  });
}
</script>

<style scoped>
li[draggable="true"] {
  user-select: none;
}

li[draggable="true"]:hover {
  background-color: #e5e7eb;
}

li[draggable="true"][dragging] {
  opacity: 0.5;
}
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
