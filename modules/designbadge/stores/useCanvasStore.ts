import { defineStore } from "pinia";
import { usePageStore } from "./usePageStore";
interface Size {
  width: number;
  height: number;
}

interface Variant {
  inner: string;
  marker: string;
  pixel: string;
}

interface QRCode {
  value: string;
  variant: string;
  radius: number;
  blackColor: string;
  whiteColor: string;
}

interface Position {
  left: number;
  top: number;
}

interface ElementProperties {
  size: Size;
  rotation: number;
  font: string;
  fontWeight: string;
  fontStyle: string;
  fontSize: string | number;
  fillColor: string;
  fillTransparency: boolean;
  imagePosition: string;
  objectFit: string;

  textDecoration: string;
  color: string;
  textAlign: string;
  verticalAlign: string;
  horizontalAlign: string;
  textTransform: string;
  src: string;
  strokeColor: string;
  strokeWidth: number;
  associatedData: string;
  content: string;
  x: number;
  y: number;
  text: string;
  displayOption?: string;
  qrcode: QRCode;
  direction: string;
}

interface CanvasElement {
  id: string | number;
  text: string;
  type: string;
  label: string;
  position: Position;
  properties: ElementProperties;
  isSelected: boolean;
  isDragging: boolean;
  visible: boolean;
}

export const useCanvasStore = defineStore("canvasStore", {
  state: () => ({
    activeTab: "design" as string,
    frontBoxes: [] as CanvasElement[],
    backBoxes: [] as CanvasElement[],
    activeSide: "front" as "front" | "back",
    selectedElement: null as string | number | null,
    selectedElementType: null as string | null,
    currentProperties: {} as Partial<ElementProperties>,
    dropzone: null as HTMLElement | null,
    showImageModal: false,
    showGradientModal: false,
    showColorModal: false,
    frontBackground: null as string | null, // Background for front side
    backBackground: null as string | null, // Background for back side
    pendingImagePosition: null as Position | null,
    pendingImageSide: null as "front" | "back" | null,
    cursorPosition: null as { node: Node; offset: number } | null,
    dropdownOpen: false as boolean,
    imageItem: null as string | any,
    punchArea: false,
    punchCircle: "" as string,
    punchLong: "" as string,
  }),
  getters: {
    boxes: (state): CanvasElement[] =>
      state.activeSide === "front" ? state.frontBoxes : state.backBoxes,
    currentBackground: (state): string | null =>
      state.activeSide === "front"
        ? state.frontBackground
        : state.backBackground,
  },
  actions: {
    elementMachanism(data?: any) {
      const item = data.item;
      const position = data.position;

      const newElement: CanvasElement = {
        id: Date.now(),
        text: item.value || "Sample Text",
        type: item.type,
        label: `${item.label}`,
        position,
        properties: {
          size: { width: data.width ?? "", height: data.height ?? "" },
          rotation: 0,
          font: "Roboto",
          fontWeight: "normal",
          fontStyle: "normal",
          fontSize: "Auto",
          fillColor: item.type === "rectangle" ? "blue" : "transparent",
          fillTransparency: false,
          imagePosition: "center" as string,
          objectFit: "cover" as string,

          textDecoration: "none",
          color: "black",
          textAlign: item.type === "h1" || item.type === "p" ? "center" : "",
          verticalAlign:
            item.type === "h1" || item.type === "p" ? "middle" : "",
          horizontalAlign:
            item.type === "h1" || item.type === "p" ? "center" : "",
          textTransform: "none",
          src: data.dataUrl ?? "",
          strokeColor: "",
          strokeWidth: 0,
          associatedData: "",
          content: "",
          x: position.left,
          y: position.top,
          text: item.label || "Sample Text",
          displayOption: "both sides",
          qrcode: data.qrcode ?? "",
          direction: "ltr",
        },
        isSelected: true,
        isDragging: false,
        visible: true,
      };

      return newElement;
    },
    addElementFromDrag(item: any, position: Position) {
      // Ensure position is within drop zone
      const pageStore = usePageStore();
      const canvasWidth =
        this.dropzone?.offsetWidth || pageStore.presetWidth * 3.78;
      const canvasHeight =
        this.dropzone?.offsetHeight || pageStore.presetHeight * 3.78;
      const elementWidth = 200; // Default width
      const elementHeight = 64; // Default height

      const adjustedPosition = {
        left: Math.max(0, Math.min(position.left, canvasWidth - elementWidth)),
        top: Math.max(0, Math.min(position.top, canvasHeight - elementHeight)),
      };

      const data = {
        item: item,
        position: adjustedPosition,
        width: elementWidth,
        height: elementHeight,
      };

      const newElement = this.elementMachanism(data);

      this.addElement(newElement);
      this.selectedElement = newElement.id;
      this.updateProperties();
    },

    handleImageUploaded(dataUrl: string) {
      // if (item.type === "img" || item.type === "background") {
      //   this.imageItem = item;
      //   this.showImageModal = true;
      const position = { left: 123, top: 204 };
      this.pendingImagePosition = position;
      this.pendingImageSide = this.activeSide;
      //   return;
      // }

      const pageStore = usePageStore();
      const customPosition = {
        left: 198,
        top: 277,
      };
      const canvasWidth =
        this.dropzone?.offsetWidth || pageStore.presetWidth * 3.78;
      const canvasHeight =
        this.dropzone?.offsetHeight || pageStore.presetHeight * 3.78;
      const elementWidth =
        this.imageItem.type === "background"
          ? pageStore.presetWidth * 3.78
          : 150;
      const elementHeight =
        this.imageItem.type === "background"
          ? pageStore.presetHeight * 3.78
          : 150;

      // Ensure position is within drop zone
      const adjustedPosition = {
        left: Math.max(
          0,
          Math.min(
            this.imageItem.type === "background"
              ? customPosition.left
              : this.pendingImagePosition.left,
            canvasWidth - elementWidth
          )
        ),
        top: Math.max(
          0,
          Math.min(
            this.imageItem.type === "background"
              ? customPosition.top
              : this.pendingImagePosition.top,
            canvasHeight - elementHeight
          )
        ),
      };

      const data = {
        item: {
          text: this.imageItem.label,
          type: this.imageItem.type,
          label: this.imageItem.type === "background" ? "background" : "Image",
        },
        position: adjustedPosition,
        dataUrl: dataUrl,
        width: elementWidth,
        height: elementHeight,
      };

      const newElement = this.elementMachanism(data);

      if (this.pendingImageSide === "front") {
        this.frontBoxes.push(newElement);
      } else {
        this.backBoxes.push(newElement);
      }
      this.pendingImagePosition = null;
      this.pendingImageSide = null;
      this.selectedElement = newElement.id;
      this.updateProperties();
    },

    addElement(element: CanvasElement) {
      if (this.activeSide === "front") {
        this.frontBoxes.push(element);
      } else {
        this.backBoxes.push(element);
      }
    },

    // handleImageUploaded(dataUrl: string) {
    //   if (this.pendingImagePosition && this.pendingImageSide) {
    //     const pageStore = usePageStore();
    //     const customPosition = {
    //       left: 198,
    //       top: 277,
    //     };
    //     const data = {
    //       item: {
    //         text: this.imageItem.label,
    //         type: this.imageItem.type,
    //         label:
    //           this.imageItem.type === "background" ? "background" : "Image",
    //       },
    //       position:
    //         this.imageItem.type === "background"
    //           ? customPosition
    //           : this.pendingImagePosition,
    //       dataUrl: dataUrl,
    //       width:
    //         this.imageItem.type === "background"
    //           ? pageStore.presetWidth * 3.78
    //           : 150,
    //       height:
    //         this.imageItem.type === "background"
    //           ? pageStore.presetHeight * 3.78
    //           : 150,
    //     };

    //     const newElement = this.elementMachanism(data);

    //     if (this.pendingImageSide === "front") {
    //       this.frontBoxes.push(newElement);
    //     } else {
    //       this.backBoxes.push(newElement);
    //     }
    //     this.pendingImagePosition = null;
    //     this.pendingImageSide = null;
    //     this.selectedElement = newElement.id;
    //     this.updateProperties();
    //   }
    // },

    handleQRCodeGenerator(qrcodeValue: string) {
      const qrcodeData = {
        value: qrcodeValue,
        variant: "pixelated",
        radius: 1,
        blackColor: "#000000", // 'var(--ui-text-highlighted)' if you are using `@nuxt/ui` v3
        whiteColor: "transparent",
      };
      const data = {
        item: {
          text: "",
          type: "qrcode",
          label: "QR Code",
        },
        position: {
          left: 43,
          top: 188,
        },
        width: 150,
        height: 150,
        qrcode: qrcodeData,
      };

      const newElement = this.elementMachanism(data);

      this.addElement(newElement);
      this.selectedElement = newElement.id;
      this.updateProperties();
    },

    updateProperties(newProperties?: Partial<ElementProperties>) {
      if (this.selectedElement === null) {
        this.currentProperties = {};
        return;
      }
      const element = this.boxes.find((e) => e.id === this.selectedElement);
      if (!element) return;

      if (newProperties) {
        element.position.left = newProperties.x ?? element.position.left;
        element.position.top = newProperties.y ?? element.position.top;
        element.properties = { ...element.properties, ...newProperties };
        element.text = newProperties.text ?? element.text;
      }
      this.currentProperties = {
        x: Math.floor(element.position.left),
        y: Math.floor(element.position.top),
        size: { ...element.properties.size },
        rotation: element.properties.rotation,
        font: element.properties.font,
        fontWeight: element.properties.fontWeight,
        fontStyle: element.properties.fontStyle,
        fontSize: element.properties.fontSize,
        fillColor: element.properties.fillColor,
        imagePosition: element.properties.imagePosition,
        objectFit: element.properties.objectFit,

        fillTransparency: element.properties.fillTransparency,
        textDecoration: element.properties.textDecoration,
        color: element.properties.color,
        textAlign: element.properties.textAlign,
        verticalAlign: element.properties.verticalAlign,
        horizontalAlign: element.properties.horizontalAlign,
        textTransform: element.properties.textTransform,
        src: element.properties.src,
        strokeColor: element.properties.strokeColor,
        strokeWidth: element.properties.strokeWidth,
        associatedData: element.properties.associatedData,
        content: element.properties.content,
        text: element.text,
        displayOption: element.properties.displayOption,
        qrcode: element.properties.qrcode,
        direction: element.properties.direction,
      };
    },

    updateElementText(id: string | number, newText: string) {
      const boxes =
        this.activeSide === "front" ? this.frontBoxes : this.backBoxes;
      const element = boxes.find((e) => e.id === id);
      if (element) {
        element.text = newText;
        element.properties.text = newText;
      }
    },

    alignHorizontal(alignment: "left" | "center" | "right") {
      if (this.selectedElement === null || !this.dropzone) return;
      const element = this.boxes.find((e) => e.id === this.selectedElement);
      if (!element) return;
      const canvasRect = this.dropzone.getBoundingClientRect();
      const elementWidth = element.properties.size.width;
      switch (alignment) {
        case "left":
          element.position.left = 0;
          element.properties.textAlign = "left";
          element.properties.horizontalAlign = "left";
          break;
        case "center":
          element.position.left = (canvasRect.width - elementWidth) / 2;
          element.properties.textAlign = "center";
          element.properties.horizontalAlign = "center";
          break;
        case "right":
          element.position.left = canvasRect.width - elementWidth;
          element.properties.textAlign = "right";
          element.properties.horizontalAlign = "right";
          break;
      }
      this.currentProperties.x = element.position.left;
      this.currentProperties.textAlign = alignment;
      this.currentProperties.horizontalAlign = alignment;
      this.updateProperties(this.currentProperties);
    },

    alignVertical(alignment: "top" | "middle" | "bottom") {
      if (this.selectedElement === null || !this.dropzone) return;
      const element = this.boxes.find((e) => e.id === this.selectedElement);
      if (!element) return;
      const canvasRect = this.dropzone.getBoundingClientRect();
      const elementHeight = element.properties.size.height;
      switch (alignment) {
        case "top":
          element.position.top = 0;
          element.properties.verticalAlign = "top";
          break;
        case "middle":
          element.position.top = (canvasRect.height - elementHeight) / 2;
          element.properties.verticalAlign = "middle";
          break;
        case "bottom":
          element.position.top = canvasRect.height - elementHeight;
          element.properties.verticalAlign = "bottom";
          break;
      }
      this.currentProperties.y = element.position.top;
      this.currentProperties.verticalAlign = alignment;
      this.updateProperties(this.currentProperties);
    },

    makeTransparent(color: string) {
      if (color === "fillColor") {
        this.currentProperties.fillTransparency = true;
        this.currentProperties.fillColor = "transparent";
        this.updateProperties(this.currentProperties);
      } else {
        this.currentProperties.color = "transparent";
        this.updateProperties(this.currentProperties);
      }
    },

    applyTextAlign(align: string) {
      this.currentProperties.textAlign = align;
      this.currentProperties.horizontalAlign = align;
      const element = this.boxes.find((e) => e.id === this.selectedElement);
      if (element) {
        element.properties.textAlign = align;
        element.properties.horizontalAlign = align;
      }
      this.updateProperties(this.currentProperties);
    },

    applyVerticalAlign(align: string) {
      this.currentProperties.verticalAlign = align;
      const element = this.boxes.find((e) => e.id === this.selectedElement);
      if (element) {
        element.properties.verticalAlign = align;
      }
      this.updateProperties(this.currentProperties);
    },

    applyTextTransform(transform: string) {
      this.currentProperties.textTransform = transform;
      this.updateProperties(this.currentProperties);
    },

    toggleTextStyle(style: "bold" | "italic" | "underline") {
      if (style === "bold") {
        this.currentProperties.fontWeight =
          this.currentProperties.fontWeight === "bold" ? "normal" : "bold";
      } else if (style === "italic") {
        this.currentProperties.fontStyle =
          this.currentProperties.fontStyle === "italic" ? "normal" : "italic";
      } else if (style === "underline") {
        this.currentProperties.textDecoration =
          this.currentProperties.textDecoration === "underline"
            ? "none"
            : "underline";
      }
      this.updateProperties(this.currentProperties);
    },

    toggleLayerVisibility(id: string | number) {
      const boxes =
        this.activeSide === "front" ? this.frontBoxes : this.backBoxes;
      const el = boxes.find((e) => e.id === id);
      if (el) el.visible = !el.visible;
    },

    selectLayer(id: string | number) {
      this.selectedElement = id;
      this.updateProperties();
    },

    setTextDirection(id: string | number, direction: "ltr" | "rtl") {
      const element = this.boxes.find((e) => e.id === id);
      if (element) {
        element.properties.direction = direction;
        this.currentProperties.direction = direction;
        this.updateProperties(this.currentProperties);
      }
    },

    setBackground(background: string | null, side: "front" | "back") {
      if (side === "front") {
        this.frontBackground = background;
      } else {
        this.backBackground = background;
      }
    },

    applyGradient(gradient: string, side: "front" | "back") {
      this.setBackground(gradient, side);
      this.showGradientModal = false;
    },

    applyColor(color: string, side: "front" | "back") {
      this.setBackground(color, side);
      this.showColorModal = false;
    },

    setPunchArea(area: string, side: string) {
      console.log("Setting punch area:", area, "for side:", side);
      if (side === "front") {
        this.punchArea = true;
        this.punchCircle = area;
        this.punchLong = area;
      } else if (side === "back") {
        this.punchArea = true;
        this.punchCircle = area;
        this.punchLong = area;
      }
    },
  },
  persist: true,
});
