<template>
  <div class="fg-image" :data-src="src">
    <transition-group name="imageTransition">
      <div class="fg-image__placeholder" v-if="state.isLoading">
        <slot name="placeholder">
          <img class="loading" src="/image/logo/logo-small.svg" alt="加载中" />
        </slot>
      </div>

      <div class="fg-image__error" v-else-if="state.isLoadError">
        <slot name="error">
          <img
            class="load-failed-image opacity-40"
            src="/image/placeholder/load-failed-image.svg"
            alt="加载失败"
          />
        </slot>
      </div>

      <img
        class="fg-image__inner"
        v-else
        :src="src"
        :alt="alt"
        :style="imgStyle"
      />
    </transition-group>
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  fit: {
    type: String,
    default: "cover",
  },
  alt: {
    type: String,
    default: "图片资源",
  },
});
const emit = defineEmits(["load", "error"]);

const state = ref({
  isLoading: true, // 是否正在加载
  isLoadError: false, // 是否加载失败
});

const imgStyle = computed(() => {
  return {
    "object-fit": props.fit,
  };
});

const loadImage = () => {
  // console.log("加载图片");
  state.value.isLoading = true;
  state.value.isLoadError = false;

  const image = new Image();
  image.src = props.src;
  image.onload = (e) => onComplete(e);
  image.onerror = () => onError(image);
};

const onComplete = (e) => {
  // console.log("加载成功");
  state.value.isLoading = false;
  state.value.isLoadError = false;

  emit("load", e);
};

const onError = (image) => {
  // console.log("加载失败");
  state.value.isLoading = false;
  state.value.isLoadError = true;

  emit("error", image);
};

watch(
  () => props.src,
  () => loadImage()
);

onMounted(() => {
  loadImage();
});
</script>

<style lang="scss" scoped>
.fg-image {
  @apply block w-full h-full;

  .fg-image__inner {
    @apply block w-full h-full text-[0];
  }

  .fg-image__error,
  .fg-image__placeholder {
    @apply w-full h-full flex justify-center items-center;
  }

  .fg-image__placeholder {
    .loading {
      @apply h-1/2 animate-pulse;
    }
  }

  .fg-image__error {
    .load-failed-image {
      @apply w-3/5 h-3/5;
    }
  }
}

.imageTransition-enter-active {
  animation: imageTransition 0.5s;
}
.imageTransition-leave-active {
  animation: imageTransition 0s reverse;
}
@keyframes imageTransition {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
