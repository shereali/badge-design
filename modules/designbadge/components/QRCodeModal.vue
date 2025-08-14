<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    v-if="qrcodeStore.qrcodeToggleModal"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <div class="flex justify-between items-center border-b pb-2">
        <h2 class="text-lg font-semibold">QR Code</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      <div class="mt-4">
        <div class="flex items-center mb-4">
          <input
            type="radio"
            id="personalData"
            v-model="dataType"
            value="personalData"
            class="mr-2"
          />
          <label for="personalData" class="mr-4">Personal Data</label>
          <input
            type="radio"
            id="otherData"
            v-model="dataType"
            value="otherData"
            class="mr-2"
          />
          <label for="otherData">Other Data</label>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700"
            >Data to be associated</label
          >
          <select
            v-model="selectedTicketId"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="" disabled selected>Ticket ID</option>
            <option
              v-for="ticket in ticketOptions"
              :key="ticket"
              :value="ticket"
            >
              {{ ticket }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex justify-end">
        <button
          @click="qrcodeStore.qrcodeToggleModal"
          class="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          @click="createQRCode"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Qrcode from "qrcode.vue";
import { useQRCodeStore } from "@/stores/useQRCodeStore";
const qrcodeStore = useQRCodeStore();
const dataType = ref("personalData");
const selectedTicketId = ref("");
const ticketOptions = ref(["TICK001", "TICK002", "TICK003"]);

const createQRCode = () => {
  console.log("Creating QR Code with:", {
    dataType: dataType.value,
    ticketId: selectedTicketId.value,
  });
  qrcodeStore.qrcodeToggleModal;
};

// defineExpose({ qrcodeStore.qrcodeToggleModal });
</script>

<style scoped>
/* Add any additional custom styles if needed */
</style>
