<template>
  <div class="app-preview-box">
    <header
      class="custom-header"
      @mousedown.self="onDrag($event)"
      @dblclick.self="onMax()"
    >
      <h2 class="app-name">
        <i
          class="iconfont"
          :class="appInfo.icon"
          :style="{
            color: appInfo.iconColor || 'rgba(255, 255, 255, 0.8)',
          }"
        ></i>
        <span>{{ appInfo.name }}</span>
      </h2>
      <NuxtLink class="outside-link" to="/preview" target="_blank">
        <span>新标签打开页面</span>
      </NuxtLink>
    </header>

    <iframe
      src="https://ckjdygc.cc/preview?isHeiOs=true"
      frameborder="0"
      class="w-full h-full"
    ></iframe>
  </div>
</template>

<script setup>
const props = defineProps({
  appInfo: Object,
});

const emit = defineEmits(["onDrag", "onMax"]);
const onDrag = (e) => {
  emit("onDrag", e);
};
const onMax = () => {
  emit("onMax");
};
</script>

<style lang="scss" scoped>
.app-preview-box {
  @apply text-white text-opacity-80 text-xs
    w-full h-full;

  .custom-header {
    @include glass-bg-dark(0);
    @apply w-full h-8 absolute top-0 left-0
      flex justify-start items-center gap-4;

    .app-name {
      @apply flex items-center gap-2 pl-2
        h-full text-base leading-8;
    }

    .outside-link {
      @include glass-bg-dark(1);
      @apply rounded-md px-2 py-0.5;
      transition: all 0.3s;

      &:hover,
      &.active {
        background-color: rgba($color: #ffffff, $alpha: 0.1);
      }
      &:active {
        background-color: rgba($color: #ffffff, $alpha: 0.2);
        transform: scale(0.9);
      }
    }
  }
}
</style>
