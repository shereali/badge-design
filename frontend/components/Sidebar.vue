<template>
  <div v-if="sidebarInfo?.data?.designGroups?.length">
    <div class="flex mb-3 border-b border-gray-200 bg-gray-100 p-1 rounded-xl">
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
            v-for="item in group.items"
            :key="item.type"
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
        <span class="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">{{ badgeThemes.length }} Themes</span>
      </div>
      <p class="text-xs text-slate-500">
        Select a pre-designed template to instantly style your badge with matching fonts, colors, punch holes, and layout.
      </p>

      <div class="space-y-3">
        <div
          v-for="theme in badgeThemes"
          :key="theme.id"
          class="group border border-slate-200 hover:border-indigo-400 rounded-xl overflow-hidden shadow-sm hover:shadow transition bg-white cursor-pointer"
          @click="applyBadgeTheme(theme)"
        >
          <!-- Theme Preview Banner -->
          <div
            class="h-24 w-full p-3 flex flex-col justify-between relative overflow-hidden text-white"
            :style="{ background: theme.previewBg }"
          >
            <div class="flex items-center justify-between z-10">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm bg-black/30">
                {{ theme.badge }}
              </span>
              <span v-if="theme.punchArea && theme.punchArea !== 'none'" class="w-3.5 h-3.5 rounded-full bg-white/70 shadow-inner"></span>
            </div>

            <div class="z-10 flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-full border-2 border-white/80 overflow-hidden flex-shrink-0 bg-white/20">
                <img :src="theme.previewAvatar" class="w-full h-full object-cover" />
              </div>
              <div class="truncate">
                <div class="text-xs font-bold leading-tight drop-shadow truncate">{{ theme.previewName }}</div>
                <div class="text-[10px] opacity-90 truncate">{{ theme.previewRole }}</div>
              </div>
            </div>
          </div>

          <!-- Theme Details -->
          <div class="p-3 bg-white flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-slate-800">{{ theme.name }}</div>
              <div class="text-[11px] text-slate-500">{{ theme.description }}</div>
            </div>
            <button
              type="button"
              class="px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white rounded-lg transition"
            >
              Apply
            </button>
          </div>
        </div>
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
import { ref } from "vue";

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
  {
    id: "modern-conference",
    name: "Modern Tech Conference",
    description: "Vibrant blue gradient with round hole punch and keynote speaker layout",
    badge: "CONFERENCE",
    previewBg: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    previewName: "John Doe",
    previewRole: "Keynote Speaker",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Event Title", "TECHCON SUMMIT 2026", Math.round((canvasW - 300) / 2), 55, 300, 32, {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(2, "avatar", "Profile Photo", "", Math.round((canvasW - 100) / 2), 92, 100, 100, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "John Doe", Math.round((canvasW - 320) / 2), 205, 320, 36, {
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
      makeThemeBox(5, "p", "Company", "Google DeepMind", Math.round((canvasW - 300) / 2), 268, 300, 24, {
        fontSize: "12px",
        color: "#e2e8f0",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 302, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/verify/1001",
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
    id: "corporate-id",
    name: "Corporate Employee ID",
    description: "Clean modern company badge with employee ID, slot punch, and clear branding",
    badge: "CORPORATE ID",
    previewBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    previewName: "Sarah Ahmed",
    previewRole: "Software Architect",
    punchArea: "long-center",
    frontBackground: "#f8fafc",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Company Name", "SOFTCREDIBLE TECHNOLOGIES", Math.round((canvasW - 320) / 2), 48, 320, 32, {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#0f172a",
      }),
      makeThemeBox(2, "p", "Sub-tag", "Official Staff Identity", Math.round((canvasW - 260) / 2), 74, 260, 22, {
        fontSize: "10px",
        fontWeight: "bold",
        color: "#64748b",
        textTransform: "uppercase",
      }),
      makeThemeBox(3, "avatar", "Profile Photo", "", Math.round((canvasW - 105) / 2), 102, 105, 105, {
        avatarShape: "rounded",
        avatarRadius: 20,
        avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(4, "h1", "Full Name", "Sarah Ahmed", Math.round((canvasW - 320) / 2), 220, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#0f172a",
      }),
      makeThemeBox(5, "p", "Designation", "Lead Software Architect", Math.round((canvasW - 300) / 2), 254, 300, 26, {
        fontSize: "13px",
        color: "#475569",
      }),
      makeThemeBox(6, "p", "Employee ID", "EMP ID: SC-9048", Math.round((canvasW - 260) / 2), 282, 260, 24, {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#4f46e5",
      }),
      makeThemeBox(7, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 316, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/staff/SC-9048",
        qrWhiteColor: "#ffffff",
      }),
    ],
  },
  {
    id: "vip-executive",
    name: "Executive VIP Gala",
    description: "Dark luxury gold accent badge for executives, investors, and VIP guests",
    badge: "VIP PASS",
    previewBg: "linear-gradient(145deg, #09090b 0%, #18181b 50%, #27272a 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    previewName: "Alexander Sterling",
    previewRole: "Managing Director",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(145deg, #09090b 0%, #18181b 50%, #27272a 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "VIP Header", "★ VIP EXECUTIVE GUEST ★", Math.round((canvasW - 300) / 2), 55, 300, 30, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fbbf24",
      }),
      makeThemeBox(2, "avatar", "Profile Photo", "", Math.round((canvasW - 105) / 2), 92, 105, 105, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Alexander Sterling", Math.round((canvasW - 320) / 2), 210, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#f8fafc",
      }),
      makeThemeBox(4, "p", "Designation", "CHIEF EXECUTIVE OFFICER", Math.round((canvasW - 300) / 2), 246, 300, 26, {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#fde047",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Company", "Sterling Capital Group", Math.round((canvasW - 300) / 2), 272, 300, 24, {
        fontSize: "12px",
        color: "#cbd5e1",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 310, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/vip/sterling",
        qrWhiteColor: "#ffffff",
      }),
    ],
  },
  {
    id: "minimal-seminar",
    name: "Minimal Seminar",
    description: "High-contrast clean typography for academic, seminar, and research badges",
    badge: "SEMINAR",
    previewBg: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    previewName: "Dr. Farhan Tanvir",
    previewRole: "Research Fellow",
    punchArea: "none",
    frontBackground: "#ffffff",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Event Title", "INTERNATIONAL RESEARCH SUMMIT", Math.round((canvasW - 340) / 2), 45, 340, 32, {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#4f46e5",
      }),
      makeThemeBox(2, "avatar", "Profile Photo", "", Math.round((canvasW - 105) / 2), 88, 105, 105, {
        avatarShape: "squircle",
        avatarRadius: 28,
        avatarSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Dr. Farhan Tanvir", Math.round((canvasW - 320) / 2), 208, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#1e293b",
      }),
      makeThemeBox(4, "p", "Designation", "Research Fellow & Speaker", Math.round((canvasW - 300) / 2), 244, 300, 26, {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#4f46e5",
      }),
      makeThemeBox(5, "p", "Company", "Institute of Advanced Studies", Math.round((canvasW - 300) / 2), 272, 300, 24, {
        fontSize: "12px",
        color: "#64748b",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 310, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/speaker/farhan",
        qrWhiteColor: "#ffffff",
      }),
    ],
  },
  {
    id: "creative-summit",
    name: "Creative Festival",
    description: "Vibrant pink-violet gradient for design festivals, workshops, and creative meetups",
    badge: "CREATIVE",
    previewBg: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
    previewAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    previewName: "Nadia Islam",
    previewRole: "Workshop Leader",
    punchArea: "circle-center",
    frontBackground: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
    buildFrontBoxes: (canvasW) => [
      makeThemeBox(1, "h1", "Header", "✦ DESIGN & CREATIVE SUMMIT ✦", Math.round((canvasW - 320) / 2), 55, 320, 30, {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(2, "avatar", "Profile Photo", "", Math.round((canvasW - 105) / 2), 92, 105, 105, {
        avatarShape: "circle",
        avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      }),
      makeThemeBox(3, "h1", "Full Name", "Nadia Islam", Math.round((canvasW - 320) / 2), 210, 320, 36, {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ffffff",
      }),
      makeThemeBox(4, "p", "Designation", "WORKSHOP LEADER", Math.round((canvasW - 300) / 2), 246, 300, 26, {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#fef08a",
        textTransform: "uppercase",
      }),
      makeThemeBox(5, "p", "Studio", "Pixel & Canvas Collective", Math.round((canvasW - 300) / 2), 272, 300, 24, {
        fontSize: "12px",
        color: "#f1f5f9",
      }),
      makeThemeBox(6, "qrcode", "QR Code", "", Math.round((canvasW - 95) / 2), 310, 95, 95, {
        qrValue: "https://porichoyid.softcredible.com/workshop/nadia",
        qrWhiteColor: "#ffffff",
      }),
    ],
  },
];

function applyBadgeTheme(theme) {
  const canvasW = store.dropzone?.offsetWidth || pageStore.presetWidth * 3.78 || 396;
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
