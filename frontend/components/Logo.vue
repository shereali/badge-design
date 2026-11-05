<template>
  <div class="inline-flex items-center gap-2.5 select-none group">
    <!-- SVG Badge Icon -->
    <div
      class="flex-shrink-0 transition-transform group-hover:scale-105 duration-200"
      :class="iconSizeClass"
    >
      <img
        src="/logo.svg"
        alt="PorichoyID Logo"
        class="w-full h-full object-contain drop-shadow-sm"
      />
    </div>

    <!-- Brand Text -->
    <div v-if="showText" class="flex flex-col leading-tight">
      <div class="flex items-center">
        <span
          class="font-black tracking-tight"
          :class="[
            textSizeClass,
            whiteText
              ? 'text-white'
              : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent',
          ]"
        >
          Porichoy<span class="text-indigo-600">ID</span>
        </span>
      </div>
      <span
        v-if="subtitle"
        class="text-[9px] font-bold tracking-widest uppercase -mt-0.5"
        :class="whiteText ? 'text-indigo-200/80' : 'text-slate-400'"
      >
        Badge Studio
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: "md", // 'xs', 'sm', 'md', 'lg', 'xl'
  },
  showText: {
    type: Boolean,
    default: true,
  },
  whiteText: {
    type: Boolean,
    default: false,
  },
  subtitle: {
    type: Boolean,
    default: true,
  },
});

const iconSizeClass = computed(() => {
  switch (props.size) {
    case "xs":
      return "w-6 h-6";
    case "sm":
      return "w-8 h-8";
    case "lg":
      return "w-12 h-12";
    case "xl":
      return "w-14 h-14";
    case "md":
    default:
      return "w-10 h-10";
  }
});

const textSizeClass = computed(() => {
  switch (props.size) {
    case "xs":
      return "text-sm";
    case "sm":
      return "text-base";
    case "lg":
      return "text-2xl";
    case "xl":
      return "text-3xl";
    case "md":
    default:
      return "text-xl";
  }
});
</script>

