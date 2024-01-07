<template>
  <div class="app-sys-display-box">
    <header
      class="custom-header w-full h-6 absolute top-0 left-0 opacity-0"
      @mousedown.self="onDrag($event)"
      @dblclick.self="onMax()"
    ></header>

    <div class="left-box">
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

      <div class="mode-box">
        <div
          class="mode-item"
          :class="{ active: activeMode === item }"
          v-for="item in modes"
          :key="item"
          @click="onClickMode(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <div class="right-box">
      <transition-group name="modeTransition">
        <div v-if="activeMode === '基础'" class="mode-item mode-basic">
          <div class="mode-name">
            {{ activeMode }}
          </div>

          <div class="options-box">
            <div
              class="options-item"
              :class="{ active: osStore.wallpaper.default }"
              @click="osStore.setWallpaperIsDefault()"
            >
              <div class="preview-box">
                <OS-DefaultWallpaper />
              </div>

              <div class="options-name">默认壁纸</div>
            </div>

            <div
              class="options-item"
              :class="{ active: osStore.wallpaper.random }"
              @click="osStore.setWallpaperIsRandom()"
            >
              <div class="preview-box">
                <Fg-Image
                  :src="bingRandomUrl"
                  alt="必应随机壁纸（第三方API）"
                />
              </div>

              <div class="options-name">随机壁纸</div>
            </div>
          </div>

          <div class="options-description">
            <p>默认壁纸：自带交互壁纸，是一个系统组件</p>
            <p>
              随机壁纸：通过第三方API直接获取，每次刷新页面都会更换，返回的图片也是必应往期精美壁纸
              <a :href="randomUrl" target="_blank">{{ randomUrl }}</a>
            </p>
          </div>
        </div>

        <div v-if="activeMode === '纯色'" class="mode-item mode-color">
          <div class="mode-name">{{ activeMode }}</div>

          <div class="mode-color-picker-box">
            <ColorPicker
              isWidget
              useType="both"
              :zIndex="0"
              v-model:pureColor="pureColor"
              v-model:gradientColor="gradientColor"
              :debounce="10"
              @gradientColorChange="onColorChange"
              @pureColorChange="onColorChange"
            />
          </div>
        </div>

        <div v-else-if="activeMode === '必应'" class="mode-item mode-bing">
          <div class="mode-name">
            {{ activeMode }}
            <span class="name-description">
              必应官方每天会更新一张精美壁纸，这里只显示最近的壁纸
            </span>
          </div>

          <div class="image-list">
            <div
              class="image-box"
              @click="onClickImage(jointBingUrl(item.url))"
              v-for="(item, index) in bingList"
              :key="index"
            >
              <Fg-Image :src="jointBingUrl(item.url)" alt="必应壁纸" />
            </div>
          </div>
        </div>

        <div v-else-if="activeMode === '自选'" class="mode-item mode-self">
          <div class="mode-name">{{ activeMode }}</div>

          <div>暂时没有</div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { useHeiOsStore } from "@/stores/hei-os";

// import { getBingList, bingRandomUrl } from "@/api/third-party/wallpaper";

// 颜色选择插件
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

const emit = defineEmits(["onDrag", "onMax"]);
const onDrag = (e) => {
  emit("onDrag", e);
};
const onMax = () => {
  emit("onMax");
};

const bingRandomUrl = "https://bing.img.run/rand.php";
const randomUrl = ref(bingRandomUrl);

const osStore = useHeiOsStore();

const props = defineProps({
  appInfo: Object,
});

const modes = ["基础", "纯色", "必应", "自选"];
const activeMode = ref("基础");

const onClickMode = (item) => {
  activeMode.value = item;
};

const pureColor = ref("#ff74de");
const gradientColor = ref("radial-gradient(circle, #000000 0%, #5b5b5b 100%)");
const onColorChange = (colorValue) => {
  osStore.setWallpaperIsColor();
  osStore.setWallpaperColorValue(colorValue);
};

const bingList = ref([]);

const jointBingUrl = (url) => {
  return `https://cn.bing.com${url}`;
};

const onClickImage = (url) => {
  osStore.setWallpaperIsImage(url);
};

onMounted(() => {
  // getBingList().then((res) => {
  //   if (!res || !res.result) return;
  //   bingList.value = res.result;
  // });
});
</script>

<style lang="scss" scoped>
.app-sys-display-box {
  @apply text-white text-opacity-80 select-none
    w-full h-full
    flex;
  backdrop-filter: $glass-bg-blur-dark;

  .left-box {
    @apply w-28 h-full
      bg-white bg-opacity-5;

    .app-name {
      @apply text-center text-white text-opacity-100
        flex justify-center items-center gap-1
        p-2;

      i {
        @apply text-xl;
      }
    }

    .mode-box {
      @apply p-2 w-full text-center;

      .mode-item {
        @apply text-xs p-2 mb-2 
          rounded-md
          cursor-pointer;
        transition: all 0.3s;

        &:hover,
        &.active {
          background-color: rgba($color: #ffffff, $alpha: 0.1);
        }
        &:active {
          background-color: rgba($color: #ffffff, $alpha: 0.2);
          transform: scale(0.95);
        }
      }
    }
  }

  .right-box {
    @apply flex-1 p-4 overflow-auto;

    .mode-item {
      .mode-name {
        @apply flex items-baseline gap-2 text-xl mb-4;

        .name-description {
          @apply flex-1
          text-xs text-white text-opacity-40 truncate;
        }
      }
    }

    .mode-basic {
      .options-box {
        @apply grid grid-cols-2 gap-2;

        .options-item {
          @apply border-[0.1rem] border-white border-opacity-0 rounded-lg
            p-2
            text-center
            cursor-pointer;
          transition: all 0.3s;

          &:hover {
            @apply border-opacity-20;
          }
          &:active,
          &.active {
            @apply border-opacity-50;
          }

          .options-name {
            @apply text-xs text-white text-opacity-80
              mt-2 p-1;
          }
        }
      }

      .preview-box {
        @apply w-full aspect-video overflow-hidden rounded-md;
      }

      .options-description {
        @apply text-xs text-white text-opacity-40 leading-5
          mt-4;
      }
    }

    .mode-bing {
      .image-list {
        @apply grid grid-cols-2 gap-2;
      }
    }

    .image-box {
      @apply rounded-lg overflow-hidden
        cursor-pointer
        relative;
      transition: all 0.3s;

      &::after {
        content: "点击图片切换壁纸";
        @include glass-bg-dark(0);
        @apply absolute right-1 bottom-1
          p-1
          text-xs
          rounded-lg;

        transition: all 0.3s;
        opacity: 0;
      }

      &:hover {
        transform: scale(1.02);

        &::after {
          opacity: 1;
        }
      }
    }
  }
}

.modeTransition-enter-active {
  animation: modeTransition 0.5s;
}
.modeTransition-leave-active {
  animation: modeTransition 0s reverse;
}
@keyframes modeTransition {
  from {
    opacity: 0;
    transform: translate(0, 20px);
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss">
/**
* 颜色选择器 样式定制
*/
.mode-color-picker-box {
  .vc-colorpicker {
    background-color: transparent !important;
    box-shadow: none !important;
    width: 100% !important;
    min-width: 250px;
    color: rgba(#ffffff, 0.8) !important;

    .vc-colorpicker--container {
      padding: 0;

      .vc-colorpicker--tabs {
        padding: 4px;
        background: $glass-bg-color-dark;

        &__inner {
          background: transparent;
        }

        &__btn {
          button {
            font-size: 12px;
            color: rgba(#ffffff, 0.4);
            background-color: transparent;
          }

          &.vc-btn-active {
            button {
              color: rgba(#ffffff, 0.8);
              background-color: transparent;
            }
          }
        }

        &__bg {
          background: rgba(#ffffff, 0.2);
        }
      }
    }

    .vc-fk-colorPicker {
      // background-color: #fff;

      &__header {
        .back {
          border-width: 0 2px 2px 0;
          border-color: rgba(#ffffff, 0.4);
          transition: all 0.3s;

          &:hover {
            border-color: rgba(#ffffff, 0.8);
          }
        }
      }
    }

    .vc-gradient-picker {
      &__header {
        margin-bottom: 12px;

        .back {
          border-width: 0 2px 2px 0;
          border-color: rgba(#ffffff, 0.4);
          transition: all 0.3s;

          &:hover {
            border-color: rgba(#ffffff, 0.8);
          }
        }
      }

      .vc-gradient__types {
        background-color: $glass-bg-color-dark;

        .vc-gradient__type {
          color: rgba(#ffffff, 0.4);

          &.active {
            color: rgba(#ffffff, 0.8);
            background-color: rgba(#ffffff, 0.4);
          }
        }
      }

      &__body {
        .vc-degree-input {
          &__control {
            background-color: rgba(#ffffff, 0.2);
            color: rgba(#ffffff, 0.4);

            input {
              color: rgba(#ffffff, 0.8);
            }
          }
        }

        .vc-picker-degree-input {
          height: 20px;
        }
      }
    }

    .vc-compact {
      box-shadow: none;
      margin-bottom: 12px;
      width: 100%;
      display: block;

      &__row {
        height: auto;
      }

      &__color-cube--wrap {
        width: 11.11%;
        // height: 30px;
      }

      &__color_cube {
        &.transparent {
          &::after {
            width: 100%;
            height: 100%;
            top: 0;
            transform: rotate(0);

            background: linear-gradient(
              to top left,
              transparent 0%,
              transparent calc(50% - 1px),
              #ff0000 50%,
              transparent calc(50% + 1px),
              transparent 100%
            );
          }
        }

        &.advance {
          background-size: 110% 110%;
          background-position: 50% 50%;
          background-repeat: no-repeat;
        }
      }
    }

    .vc-saturation {
      margin-bottom: 12px;
    }

    .vc-hue-slider {
      margin-bottom: 12px;
    }

    .vc-lightness-slider {
      margin-bottom: 12px;
    }

    .vc-alpha-slider {
      margin-bottom: 12px;
    }

    .vc-display {
      .vc-current-color {
        box-shadow: none;
      }

      .vc-color-input {
        input {
          background-color: rgba(#ffffff, 0.2);
          color: rgba(#ffffff, 0.6);
        }
      }

      .vc-rgb-input {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 4px;
        flex-direction: row-reverse;
        color: rgba(#ffffff, 0.4);

        input {
          background-color: rgba(#ffffff, 0.2);
          color: rgba(#ffffff, 0.6);
        }
      }

      .vc-alpha-input {
        input {
          background-color: rgba(#ffffff, 0.2);
          color: rgba(#ffffff, 0.6);
        }
        &__inner {
          border-radius: 2px;
        }
      }

      .vc-input-toggle {
        width: 16px;
        height: 100%;
        padding: 8px 4px;
        border-radius: 2px;
        transition: all 0.3s;

        &:hover {
          background-color: rgba(#ffffff, 0.2);
        }
      }
    }

    .vc-colorPicker__record {
      margin-top: 12px;

      .color-list {
        gap: 4px;

        .color-item {
          max-width: none;
          box-shadow: none;
        }
      }
    }
  }
}
</style>
