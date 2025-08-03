<template>
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Image Manager"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 animate-fadeIn"
    >
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <h3 class="text-xl font-semibold text-gray-800">Image Manager</h3>
        <button
          class="text-gray-400 hover:text-red-500 transition"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-2 mb-4">
        <button
          class="px-4 py-2 rounded"
          :class="
            activeTab === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          "
          @click="activeTab = 'upload'"
        >
          Upload Image
        </button>
        <button
          class="px-4 py-2 rounded"
          :class="
            activeTab === 'library'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          "
          @click="activeTab = 'library'"
        >
          Uploaded Images
        </button>
      </div>

      <!-- Upload Tab -->
      <div v-if="activeTab === 'upload'">
        <div
          class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition"
          @click="triggerInput"
        >
          <svg
            class="w-12 h-12 text-blue-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 15a4 4 0 014-4h1V7a4 4 0 014-4h2a4 4 0 014 4v4h1a4 4 0 014 4v5H3v-5z"
            />
          </svg>
          <p class="text-sm text-gray-600">Click to select an image</p>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFileUpload"
          />
        </div>

        <div v-if="uploadProgress > 0" class="mt-6">
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-in-out"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-700 text-center mt-2">
            Uploading... {{ uploadProgress }}%
          </p>
        </div>
      </div>

      <!-- Uploaded Images Tab -->
      <div v-if="activeTab === 'library'">
        <!-- Search + Category -->
        <div class="flex justify-between items-center mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search image..."
            class="w-full px-3 py-2 border rounded"
          />
          <select
            v-model="selectedCategory"
            class="ml-2 px-3 py-2 border rounded"
          >
            <option value="">All</option>
            <option value="nature">Nature</option>
            <option value="tech">Tech</option>
            <option value="people">People</option>
          </select>
        </div>

        <!-- Preview List -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto"
        >
          <div
            v-for="(img, idx) in filteredImages"
            :key="idx"
            class="cursor-pointer border rounded hover:border-blue-500"
            @click="selectImage(img)"
          >
            <img
              :src="img.src"
              :alt="img.name"
              class="w-full h-24 object-cover rounded"
            />
            <p class="text-xs text-center text-gray-500 truncate">
              {{ img.name }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <button
          class="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
          @click="$emit('close')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  side: {
    type: String,
    default: "front", // or "back"
  },
});

const emit = defineEmits(["uploaded", "close"]);

const fileInput = ref(null);
const uploadProgress = ref(0);
const activeTab = ref("upload");
const uploadedImages = ref([
  {
    src: "https://placekitten.com/200/300",
    name: "Kitten 1",
    category: "nature",
  },
  {
    src: "https://placekitten.com/300/300",
    name: "Kitten 2",
    category: "people",
  },
  {
    src: "https://placekitten.com/400/300",
    name: "Kitten 3",
    category: "tech",
  },
]);
const searchQuery = ref("");
const selectedCategory = ref("");

const filteredImages = computed(() => {
  return uploadedImages.value.filter((img) => {
    const matchesCategory = selectedCategory.value
      ? img.category === selectedCategory.value
      : true;
    const matchesSearch = img.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

function triggerInput() {
  fileInput.value?.click();
}

function handleFileUpload(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  let processed = 0;
  uploadProgress.value = 0;

  const simulateUpload = (file, idx) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newImage = {
        src: reader.result,
        name: file.name,
        category: "uncategorized",
      };
      uploadedImages.value.push(newImage);
      emit("uploaded", {
        side: props.side,
        src: reader.result,
        name: file.name,
        category: "uncategorized",
      });

      processed++;
      uploadProgress.value = Math.round((processed / files.length) * 100);

      if (processed === files.length) {
        setTimeout(() => (uploadProgress.value = 0), 600);
      }
    };
    reader.readAsDataURL(file);
  };

  files.forEach((file, idx) => simulateUpload(file, idx));
}

function selectImage(image) {
  emit("uploaded", {
    side: props.side,
    src: image.src,
    name: image.name,
    category: image.category,
  });
  emit("close");
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
