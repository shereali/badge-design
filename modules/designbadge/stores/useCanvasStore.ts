import { defineStore } from "pinia";

interface Size {
  width: number;
  height: number;
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
  textDecoration: string;
  color: string;
  textAlign: string;
  verticalAlign: string;
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
    frontBoxes: [] as CanvasElement[],
    backBoxes: [] as CanvasElement[],
    activeSide: "front" as "front" | "back",
    selectedElement: null as string | number | null,
    currentProperties: {} as Partial<ElementProperties>,
    dropzone: null as HTMLElement | null,
    showImageModal: false,
    pendingImagePosition: null as Position | null,
    pendingImageSide: null as "front" | "back" | null,
    cursorPosition: null as { node: Node; offset: number } | null,
  }),
  getters: {
    boxes: (state): CanvasElement[] =>
      state.activeSide === "front" ? state.frontBoxes : state.backBoxes,
  },
  actions: {
    addElementFromDrag(item: any, position: Position) {
      if (item.type === "img") {
        this.showImageModal = true;
        this.pendingImagePosition = position;
        this.pendingImageSide = this.activeSide;
        return;
      }

      const newElement: CanvasElement = {
        id: Date.now(),
        text: item.label || "Sample Text",
        type: item.type,
        label: `${item.label}`,
        position,
        properties: {
          size: { width: 200, height: 64 },
          rotation: 0,
          font: "Roboto",
          fontWeight: "normal",
          fontStyle: "normal",
          fontSize: "Auto",
          fillColor: "#ffffff",
          fillTransparency: false,
          textDecoration: "none",
          color: "black",
          textAlign: item.type === "h1" || item.type === "p" ? "center" : "", // Center text by default
          verticalAlign:
            item.type === "h1" || item.type === "p" ? "middle" : "", // Middle align by default
          textTransform: "none",
          src: "",
          strokeColor: "",
          strokeWidth: 0,
          associatedData: "",
          content: "",
          x: position.left,
          y: position.top,
          text: item.label || "Sample Text",
          displayOption: "both sides",
          direction: "ltr",
        },
        isSelected: true, // Select the new element by default
        isDragging: false,
        visible: true,
      };

      this.addElement(newElement);
      this.selectedElement = newElement.id; // Set as selected
      this.updateProperties(); // Update properties panel
    },

    addElement(element: CanvasElement) {
      if (this.activeSide === "front") {
        this.frontBoxes.push(element);
      } else {
        this.backBoxes.push(element);
      }
    },

    handleImageUploaded(dataUrl: string) {
      if (this.pendingImagePosition && this.pendingImageSide) {
        const newElement: CanvasElement = {
          id: Date.now(),
          text: "",
          type: "img",
          label: "Image",
          position: this.pendingImagePosition,
          properties: {
            size: { width: 250, height: 150 },
            rotation: 0,
            font: "",
            fontWeight: "normal",
            fontStyle: "normal",
            fontSize: "Auto",
            fillColor: "",
            fillTransparency: false,
            textDecoration: "",
            color: "#000000",
            textAlign: "center",
            verticalAlign: "",
            textTransform: "",
            src: dataUrl, // This is correct
            strokeColor: "",
            strokeWidth: 0,
            associatedData: "",
            content: "",
            x: this.pendingImagePosition.left,
            y: this.pendingImagePosition.top,
            text: "",
            displayOption: "both sides",
          },
          isSelected: true, // Select the image by default
          isDragging: false,
          visible: true,
        };
        if (this.pendingImageSide === "front") {
          this.frontBoxes.push(newElement);
        } else {
          this.backBoxes.push(newElement);
        }
        this.pendingImagePosition = null;
        this.pendingImageSide = null;
        this.selectedElement = newElement.id; // Ensure the image is selected
        this.updateProperties(); // Update properties panel
      }
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
      } else {
        this.currentProperties = {
          x: element.position.left,
          y: element.position.top,
          size: { ...element.properties.size },
          rotation: element.properties.rotation,
          font: element.properties.font,
          fontWeight: element.properties.fontWeight,
          fontStyle: element.properties.fontStyle,
          fontSize: element.properties.fontSize,
          fillColor: element.properties.fillColor,
          fillTransparency: element.properties.fillTransparency,
          textDecoration: element.properties.textDecoration,
          color: element.properties.color,
          textAlign: element.properties.textAlign,
          verticalAlign: element.properties.verticalAlign,
          textTransform: element.properties.textTransform,
          src: element.properties.src,
          strokeColor: element.properties.strokeColor,
          strokeWidth: element.properties.strokeWidth,
          associatedData: element.properties.associatedData,
          content: element.properties.content,
          text: element.text,
          displayOption: element.properties.displayOption,
        };
      }
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
          break;
        case "center":
          element.position.left = (canvasRect.width - elementWidth) / 2;
          break;
        case "right":
          element.position.left = canvasRect.width - elementWidth;
          break;
      }
      this.currentProperties.x = element.position.left;
      this.currentProperties.textAlign = alignment;
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
          break;
        case "middle":
          element.position.top = (canvasRect.height - elementHeight) / 2;
          break;
        case "bottom":
          element.position.top = canvasRect.height - elementHeight;
          break;
      }
      this.currentProperties.y = element.position.top;
      this.currentProperties.verticalAlign = alignment;
      this.updateProperties(this.currentProperties);
    },
    makeTransparent() {
      this.currentProperties.fillTransparency = true;
      this.currentProperties.fillColor = "";
      this.updateProperties(this.currentProperties);
    },
    applyTextAlign(align: string) {
      this.currentProperties.textAlign = align;
      this.updateProperties(this.currentProperties);
    },
    applyVerticalAlign(align: string) {
      this.currentProperties.verticalAlign = align;
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
  },
  persist: true,
});
