import { useCanvasStore } from "@/stores/useCanvasStore";
import { usePageStore } from "@/stores/usePageStore";
import { useAuthStore } from "@/stores/useAuthStore";

// Define interfaces for type safety
interface Layer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
}

interface DragItem {
  type: string;
  [key: string]: any;
}

interface DragEndPayload {
  item: DragItem;
  x: number;
  y: number;
}

export function useBadgeEditor() {
  // Stores
  const pageStore = usePageStore();
  const store = useCanvasStore();
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || "/api";

  const {
    activeTab,
    frontBoxes,
    backBoxes,
    activeSide,
    selectedElement,
    currentProperties,
    dropzone,
    showImageModal,
    showGradientModal,
    showColorModal,
    frontBackground,
    backBackground,
    pendingImagePosition,
    pendingImageSide,
    cursorPosition,
    dropdownOpen,
    imageItem,
    punchArea,
    punchCircle,
    punchLong,
  } = storeToRefs(store);

  const presetWidth = pageStore.presetWidth;
  const presetHeight = pageStore.presetHeight;
  const applyGradient = store.applyGradient;

  // Toast
  const toast = useToast();

  // Router and Route
  const router = useRouter();
  const route = useRoute();

  // Reactive state
  const zoomLevel: Ref<number> = ref(100);
  const showGrid: Ref<boolean> = ref(false);
  const isFlipping: Ref<boolean> = ref(false);
  const selectedLayer: Ref<string | null> = ref(null);
  const layers: Ref<Layer[]> = ref([]);
  const displayOption: Ref<string> = ref("both sides");
  const loading = ref(false);
  const badgeTitle = ref("Untitled Badge");

  // Computed properties
  const zoomScale: ComputedRef<number> = computed(() => zoomLevel.value / 100);
  const selectedElementType: ComputedRef<string | null> = computed(() => {
    const element = store.boxes.find(
      (e: any) => e.id === store.selectedElement
    );
    return element ? element.type : null;
  });

  // Badge ID from route query (e.g. ?id=xyz or ?badge=xyz)
  const currentBadgeId = computed(() => {
    const q = (route.query.id || route.query.badge || route.params.id) as string;
    if (!q) return "";
    try {
      // Decode if base64 encoded or raw uuid
      if (/^[0-9a-fA-F-]{36}$/.test(q)) return q;
      const decoded = atob(q);
      return decoded || q;
    } catch {
      return q;
    }
  });

  // Initialize dropzone on mount
  onMounted(() => {
    store.dropzone = dropzone.value;
    if (store.frontBoxes) store.frontBoxes.punchCirle = store.punchCirle;
    if (store.backBoxes) store.backBoxes.punchLong = store.punchLong;

    if (currentBadgeId.value) {
      fetchBadgeData();
    }
  });

  // Watch for changes in store and update layers
  watch(
    [() => store.activeSide, () => store.frontBoxes, () => store.backBoxes],
    () => {
      layers.value = store.boxes.map((box: any) => ({
        id: box.id,
        name: box.label || box.type,
        type: box.type,
        visible: box.visible ?? true,
      }));
      selectedLayer.value = store.selectedElement;
    },
    { deep: true }
  );

  // Watch for badge ID change in route
  watch(
    () => currentBadgeId.value,
    (newId) => {
      if (newId) {
        fetchBadgeData();
      }
    }
  );

  // Function to fetch badge data from our Laravel backend
  const fetchBadgeData = async () => {
    if (!currentBadgeId.value) return;

    loading.value = true;
    try {
      const response: any = await $fetch(
        `${apiBase}/badges/${currentBadgeId.value}`,
        {
          headers: authStore.getAuthHeaders(),
        }
      );

      if (response && response.data) {
        const badge = response.data;
        badgeTitle.value = badge.title || "Untitled Badge";

        // Restore page configuration
        if (badge.page_config) {
          const cfg = badge.page_config;
          if (cfg.badgeSize) pageStore.badgeSize = cfg.badgeSize;
          if (cfg.badgeSizePreset) pageStore.badgeSizePreset = cfg.badgeSizePreset;
          if (cfg.badgeOrientation) pageStore.badgeOrientation = cfg.badgeOrientation;
          if (cfg.customWidth) pageStore.customWidth = cfg.customWidth;
          if (cfg.customHeight) pageStore.customHeight = cfg.customHeight;
        } else if (badge.width && badge.height) {
          pageStore.customWidth = badge.width;
          pageStore.customHeight = badge.height;
          pageStore.badgeOrientation = badge.orientation || "portrait";
          pageStore.badgeSize = badge.size_preset || "A6";
        }

        // Restore Canvas Boxes
        if (badge.front_boxes && Array.isArray(badge.front_boxes)) {
          store.frontBoxes = badge.front_boxes;
        }
        if (badge.back_boxes && Array.isArray(badge.back_boxes)) {
          store.backBoxes = badge.back_boxes;
        }

        // Restore Settings
        if (badge.settings) {
          if (badge.settings.frontBackground) frontBackground.value = badge.settings.frontBackground;
          if (badge.settings.backBackground) backBackground.value = badge.settings.backBackground;
          if (badge.settings.punchArea !== undefined) punchArea.value = badge.settings.punchArea;
          if (badge.settings.punchCircle !== undefined) punchCircle.value = badge.settings.punchCircle;
          if (badge.settings.punchLong !== undefined) punchLong.value = badge.settings.punchLong;
        }

        console.log("Badge loaded successfully:", badge.title);
      }
    } catch (err: any) {
      console.error("Failed to load badge:", err);
      toast.error({
        title: "Load Error",
        message: err?.data?.message || "Could not load badge data.",
        position: "topRight",
      });
    } finally {
      loading.value = false;
      setTimeout(() => {
        isInitialLoaded.value = true;
      }, 600);
    }
  };

  const isInitialLoaded = ref(false);
  const autoSaveStatus = ref<"idle" | "pending" | "saving" | "saved" | "error">("idle");
  const lastSavedAt = ref<Date | null>(null);
  let autoSaveTimeout: any = null;

  // Auto-Save Trigger Debounce
  const triggerAutoSave = () => {
    if (!isInitialLoaded.value) return;
    if (store.frontBoxes.length === 0 && store.backBoxes.length === 0) return;

    autoSaveStatus.value = "pending";
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(async () => {
      try {
        await sendData(true);
      } catch (e) {
        // logged in sendData
      }
    }, 2500); // 2.5 second debounce after user stops editing
  };

  // Watch for state changes across elements & title to trigger auto-save
  watch(
    () => [
      store.frontBoxes,
      store.backBoxes,
      store.frontBackground,
      store.backBackground,
      store.punchArea,
      store.punchCircle,
      store.punchLong,
      badgeTitle.value,
      pageStore.presetWidth,
      pageStore.presetHeight,
    ],
    () => {
      triggerAutoSave();
    },
    { deep: true }
  );

  // If new badge without query ID, enable auto-save after initial setup
  if (!route.query.id) {
    setTimeout(() => {
      isInitialLoaded.value = true;
    }, 1500);
  }

  // Function to send data (Save to Laravel API)
  const sendData = async (isAutoSave = false): Promise<any> => {
    try {
      if (isAutoSave) {
        autoSaveStatus.value = "saving";
      } else {
        loading.value = true;
      }

      const badgeJson = {
        page_config: {
          pageWidth: pageStore.pageWidth,
          pageHeight: pageStore.pageHeight,
          presetWidth: pageStore.presetWidth,
          presetHeight: pageStore.presetHeight,
          showModal: pageStore.showModal,
          badgeOrientation: pageStore.badgeOrientation,
          badgeSize: pageStore.badgeSize,
          badgeSizePreset: pageStore.badgeSizePreset,
          customWidth: pageStore.customWidth,
          customHeight: pageStore.customHeight,
        },
        frontBoxes: frontBoxes.value,
        backBoxes: backBoxes.value,
        activeSide: activeSide.value,
        currentProperties: currentProperties.value,
        frontBackground: frontBackground.value,
        backBackground: backBackground.value,
        punchArea: punchArea.value,
        punchCircle: punchCircle.value,
        punchLong: punchLong.value,
      };

      const sanitizedLayers = toRaw(layers.value).map((layer) => ({
        id: layer.id,
        name: layer.name,
        type: layer.type,
        visible: layer.visible ?? true,
      }));

      const payload = {
        title: badgeTitle.value || "My Badge",
        page_config: badgeJson.page_config,
        front_boxes: badgeJson.frontBoxes,
        back_boxes: badgeJson.backBoxes,
        layers: sanitizedLayers,
        active_side: activeSide.value,
        orientation: pageStore.badgeOrientation,
        size_preset: pageStore.badgeSize,
        width: pageStore.pageWidth,
        height: pageStore.pageHeight,
        settings: {
          frontBackground: frontBackground.value,
          backBackground: backBackground.value,
          punchArea: punchArea.value,
          punchCircle: punchCircle.value,
          punchLong: punchLong.value,
        },
      };

      let res: any;
      if (currentBadgeId.value) {
        // Update existing badge
        res = await $fetch(`${apiBase}/badges/${currentBadgeId.value}`, {
          method: "PUT",
          headers: authStore.getAuthHeaders(),
          body: payload,
        });
      } else {
        // Create new badge
        res = await $fetch(`${apiBase}/badges`, {
          method: "POST",
          headers: authStore.getAuthHeaders(),
          body: payload,
        });
        if (res && res.data && res.data.id) {
          currentBadgeId.value = res.data.id;
          router.replace({ query: { id: res.data.id } });
        }
      }

      autoSaveStatus.value = "saved";
      lastSavedAt.value = new Date();

      if (!isAutoSave) {
        toast.success({
          title: "Saved!",
          message: "Badge saved successfully.",
          position: "topRight",
        });
      }

      return res;
    } catch (err: any) {
      console.error("Error saving badge:", err);
      if (isAutoSave) {
        autoSaveStatus.value = "error";
      } else {
        toast.error({
          title: "Save Failed",
          message: err?.data?.message || err?.message || "Could not save badge.",
          position: "topRight",
        });
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const switchSideTab = (side: string): void => {
    if (isFlipping.value || store.activeSide === side) return;
    isFlipping.value = true;
    store.activeSide = side;
    setTimeout(() => (isFlipping.value = false), 600);
  };

  const zoom = (delta: number): void => {
    zoomLevel.value = Math.max(50, Math.min(200, zoomLevel.value + delta));
  };

  const toggleGrid = (): void => {
    showGrid.value = !showGrid.value;
  };

  const onDragStart = (item: DragItem): void => {
    // Prepare for drag
  };

  const onDragEnd = ({ item, x, y }: DragEndPayload): void => {
    if (!dropzone.value) return;
    const rect = dropzone.value.getBoundingClientRect();
    const dropXPos = x - rect.left;
    const dropYPos = y - rect.top;

    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const elementWidth =
      item.type === "background" ? pageStore.presetWidth * 3.78 : 200;
    const elementHeight =
      item.type === "background" ? pageStore.presetHeight * 3.78 : 64;

    const adjustedX = Math.max(
      0,
      Math.min(dropXPos, canvasWidth - elementWidth)
    );
    const adjustedY = Math.max(
      0,
      Math.min(dropYPos, canvasHeight - elementHeight)
    );

    store.addElementFromDrag(item, { top: adjustedY, left: adjustedX });
  };

  const handleDrop = (event: DragEvent): void => {
    event.preventDefault();
  };

  const handleImageUploaded = (dataUrl: string): void => {
    store.handleImageUploaded(dataUrl);
    store.showImageModal = false;
  };

  return {
    activeSide,
    presetWidth,
    presetHeight,
    frontBoxes,
    backBoxes,
    currentProperties,
    showImageModal,
    pendingImageSide,
    applyGradient,
    showColorModal,
    selectedElement,
    dropzone,
    zoomLevel,
    showGrid,
    isFlipping,
    zoomScale,
    selectedLayer,
    layers,
    displayOption,
    selectedElementType,
    badgeTitle,
    loading,
    autoSaveStatus,
    lastSavedAt,

    sendData,
    switchSideTab,
    zoom,
    toggleGrid,
    onDragStart,
    onDragEnd,
    handleDrop,
    handleImageUploaded,
    fetchBadgeData,
  };
}
