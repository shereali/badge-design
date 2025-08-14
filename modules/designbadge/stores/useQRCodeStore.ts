import { defineStore } from "pinia";

export const useQRCodeStore = defineStore("QRCode", {
  state: () => ({
    isOpen: false,
  }),

  actions: {
    toggleModal() {
      this.isOpen = !this.isOpen;
    },
  },
});
