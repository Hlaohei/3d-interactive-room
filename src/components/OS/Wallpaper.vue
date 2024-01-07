<template>
  <transition-group name="wallpaperTransition">
    <OS-DefaultWallpaper v-if="osStore.wallpaper.default" />

    <div v-else class="os-wallpaper-box" :style="style"></div>
  </transition-group>
</template>

<script setup>
import { useHeiOsStore } from "@/stores/hei-os";

const osStore = useHeiOsStore();

const style = computed(() => {
  return {
    background: osStore.wallpaper.color
      ? osStore.wallpaper.colorValue
      : `url(${osStore.wallpaper.url})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };
});
</script>

<style lang="scss" scoped>
.os-wallpaper-box {
  @apply w-full h-full bg-cover bg-center;

  transition: all 0.5s;
}

.wallpaperTransition-enter-active {
  animation: wallpaperTransition 1.5s;
}
.wallpaperTransition-leave-active {
  animation: wallpaperTransition 0.5s reverse;
}
@keyframes wallpaperTransition {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
