<template>
  <transition name="startTransition">
    <div class="os-start-box">
      <div class="app-item" v-for="item in AppList" @click="onClickItem(item)">
        <div class="app-icon">
          <i
            class="iconfont"
            :class="item.icon"
            :style="{
              color: item.iconColor || 'rgba(255, 255, 255, 0.8)',
            }"
          ></i>
        </div>
        <span class="app-name">{{ item.name }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import APP from "./APP";
import { useHeiOsStore } from "@/stores/hei-os";

const osStore = useHeiOsStore();

const AppList = reactive([...APP]);

const onClickItem = (item) => {
  osStore.openApp(item.id);
};
</script>

<style lang="scss" scoped>
.os-start-box {
  @include glass-bg-dark(1);
  @apply absolute bottom-14 left-1/2 -translate-x-1/2
    w-128 h-128 rounded-xl p-4
    grid gap-2 grid-cols-3
    overflow-auto
    z-[49];

  .app-item {
    @apply aspect-square rounded-lg
      flex flex-col justify-center items-center
      cursor-pointer select-none;

    background-color: rgba(#1f1f1f, 0.4);
    transition: all 0.3s;

    &:hover,
    &.active {
      background-color: rgba($color: #ffffff, $alpha: 0.1);
    }
    &:active {
      background-color: rgba($color: #ffffff, $alpha: 0.2);
      transform: scale(0.95);
    }

    .app-icon {
      @apply flex justify-center items-center
        w-1/2 h-1/2;

      i {
        @apply text-5xl;
      }
    }

    .app-name {
      @apply text-sm text-white text-opacity-80;
    }
  }
}

.startTransition-enter-active {
  animation: startTransition 0.3s;
}
.startTransition-leave-active {
  animation: startTransition 0.2s reverse;
}
@keyframes startTransition {
  from {
    opacity: 0;
    transform: translate(-50%, 50%) scale(0.8);
  }
  to {
    opacity: 1;
  }
}
</style>
