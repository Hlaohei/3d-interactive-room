<template>
  <transition name="windowTransition">
    <div
      class="os-window-box"
      v-show="!setting.min"
      :class="{
        focus: setting.focus,
        'zoom-animation': zoomAnimation,
        '!select-none': isDrag || resize,
      }"
      :style="{
        width: width + 'px',
        height: height + 'px',
        left: position.x + 'px',
        top: position.y + 'px',
        zIndex: setting.index,
      }"
      @mousedown="onFocus(setting.id)"
    >
      <header
        class="os-window-header"
        :class="{
          'show-header': setting.header,
          'pointer-events-none': !setting.header,
          focus: setting.focus,
        }"
        @mousedown.self="onDrag($event)"
        @dblclick.self="onMax()"
      >
        <div class="app-icon" v-show="setting.header">
          <i
            class="iconfont"
            :class="setting.icon"
            :style="{
              fontSize: '20px',
              color: setting.iconColor || 'rgba(255, 255, 255, 0.8)',
            }"
          ></i>
        </div>

        <div class="app-title" v-show="setting.header">{{ setting.name }}</div>

        <div class="os-window-contral">
          <span
            v-show="setting.resizable"
            class="btn btn-max"
            :class="{ maximized }"
            @mousedown="onMax()"
          ></span>
          <span class="btn btn-min" @click="onMin(setting.id)"></span>
          <span class="btn btn-close" @click="onClose(setting.id)"></span>
        </div>
      </header>

      <div
        class="os-window-body"
        :style="{
          height: setting.header ? '' : '100%',
          marginTop: setting.header ? '' : '0',
        }"
      >
        <keep-alive>
          <div
            v-if="subCompoent"
            class="app-component-box w-full h-full overflow-hidden relative"
          >
            <component
              :is="subCompoent"
              :appInfo="setting"
              @onDrag="onDrag($event)"
              @onMax="onMax"
            />
          </div>
        </keep-alive>
      </div>

      <!-- 缩放 -->
      <div class="os-window-resize-overlay" v-show="showOverlay"></div>
      <span
        class="os-window-resize-side"
        v-for="(item, index) in resizeSide"
        :key="index"
        v-show="setting.resizable && !maximized"
        :class="item"
        @mousedown.self="onResize(item)"
      ></span>
    </div>
  </transition>
</template>

<script setup>
import { useHeiOsStore } from "@/stores/hei-os";

const osStore = useHeiOsStore();

const props = defineProps({
  setting: {
    id: String,
    index: Number,
    focus: Boolean,
    min: Boolean,
    header: Boolean,
    width: Number,
    height: Number,
  },
});

const showOverlay = ref(false);

const resizeSide = [
  "side-top",
  "side-left",
  "side-right",
  "side-bottom",
  "side-top-left",
  "side-top-right",
  "side-bottom-left",
  "side-bottom-right",
];

const width = ref(0);
const height = ref(0);
const position = reactive({
  x: 0,
  y: 0,
});

const maximized = ref(false);

onMounted(() => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  width.value = props.setting.width > 0 ? props.setting.width : w / 2;
  height.value = props.setting.height > 0 ? props.setting.height : h / 2;

  position.x = w / 2 - width.value / 2;
  position.y = (h - height.value) / 2;
});

// let subCompoent = ref(null);
// // 动态添加对应的 APP 子组件
// subCompoent.value = markRaw(
//   defineAsyncComponent(() =>
//     import(/* @vite-ignore */ "./APP/" + props.setting.page + ".vue")
//   )
// );

// 动态添加对应的 APP 子组件
// TODO: vue defineAsyncComponent 写法在这不管用，待解决，临时换成
import OSAPPSysTest from "./APP/sys/test.vue";
import OSAPPSysAbout from "./APP/sys/about.vue";
import OSAPPSysDisplay from "./APP/sys/display.vue";
import OSAPPSysCalculator from "./APP/sys/calculator.vue";
import OSAPPSysBrowser from "./APP/sys/browser.vue";
import OSAPPlightControl from "./APP/lightControl.vue";
import OSAPPmatrixLED from "./APP/matrixLED.vue";
import OSAPPSysTerminal from "./APP/sys/terminal.vue";
import OSAPPshare from "./APP/share.vue";
import OSAPPpreview from "./APP/preview.vue";

const components = {
  "sys/test": OSAPPSysTest,
  "sys/about": OSAPPSysAbout,
  "sys/display": OSAPPSysDisplay,
  "sys/calculator": OSAPPSysCalculator,
  "sys/browser": OSAPPSysBrowser,
  lightControl: OSAPPlightControl,
  matrixLED: OSAPPmatrixLED,
  "sys/terminal": OSAPPSysTerminal,
  share: OSAPPshare,
  preview: OSAPPpreview,
};
const subCompoent = components[props.setting.page];

/**
 * 鼠标聚焦到对应窗口
 * @param {*} id app 的 ID
 */
const onFocus = (id) => {
  // console.log("onFocus", id);
  osStore.focusApp(id);
};

/**
 * 窗口最小化
 * @param {*} id app 的 ID
 */
const onMin = (id) => {
  // console.log("onMin", id);
  osStore.minOrShowApp(id);
};

/**
 * 窗口关闭
 * @param {*} id app 的 ID
 */
const onClose = (id) => {
  // console.log("onClose", id);
  osStore.closeApp(id);
};

let isDrag = ref(false);
/**
 * 鼠标拖拽窗口
 * @param {*} e
 */
const onDrag = (e) => {
  const x = e.clientX - position.x;
  const y = e.clientY - position.y;

  isDrag.value = true;

  const handleMouseMove = (e) => {
    if (isDrag.value) {
      position.x = e.clientX - x;
      position.y = e.clientY - y;

      // 边界检查
      const maxX = window.innerWidth - width.value;
      const maxY = window.innerHeight - height.value;
      position.x = Math.max(0, Math.min(position.x, maxX));
      position.y = Math.max(0, Math.min(position.y, maxY));
    }
  };

  const handleMouseUp = () => {
    isDrag.value = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};

let oldPosition = {};
let timer = null;
let zoomAnimation = ref(false);
/**
 * 窗口最大化
 */
const onMax = () => {
  if (!props.setting.resizable) return;

  if (maximized.value && oldPosition) {
    zoomAnimation.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      maximized.value = false;

      position.x = oldPosition.x;
      position.y = oldPosition.y;
      width.value = oldPosition.width;
      height.value = oldPosition.height;
      oldPosition = {};

      clearTimeout(timer);
      timer = setTimeout(() => {
        zoomAnimation.value = false;
      }, 500);
    });
  } else {
    zoomAnimation.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      maximized.value = true;

      oldPosition = {
        x: position.x,
        y: position.y,
        width: width.value,
        height: height.value,
      };
      position.x = 0;
      position.y = 0;
      width.value = window.innerWidth;
      height.value = window.innerHeight;

      clearTimeout(timer);
      timer = setTimeout(() => {
        zoomAnimation.value = false;
      }, 500);
    });
  }
};

const minWidth = 200;
const minHeight = 50;
let resize = ref(false);
/**
 * 修改窗口尺寸
 * @param {*} direction 方向字符串 top|left|right|bottom
 */
const onResize = (direction) => {
  resize.value = true;
  showOverlay.value = true;

  const handleMouseMove = (e) => {
    if (!resize.value) return;

    const { clientX, clientY } = e;
    const { innerWidth: w, innerHeight: h } = window;

    const x = Math.max(Math.min(clientX, w), 0);
    const y = Math.max(Math.min(clientY, h), 0);

    if (direction.indexOf("top") >= 0) {
      height.value = Math.max(height.value + (position.y - y), minHeight);
      if (height.value > minHeight) {
        position.y = y;
      }
    }
    if (direction.indexOf("left") >= 0) {
      width.value = Math.max(width.value + (position.x - x), minWidth);
      if (width.value > minWidth) {
        position.x = x;
      }
    }

    if (direction.indexOf("bottom") >= 0) {
      height.value = Math.max(
        height.value + (y - (position.y + height.value)),
        minHeight
      );
    }
    if (direction.indexOf("right") >= 0) {
      width.value = Math.max(
        width.value + (x - (position.x + width.value)),
        minWidth
      );
    }
  };

  const handleMouseUp = () => {
    resize.value = false;
    showOverlay.value = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};
</script>

<style lang="scss" scoped>
$header-height: 30px;
$header-color: rgba(#1f1f1f, 0.8);
$header-focus-color: rgba(#1f1f1f, 0.6);
$header-blur: saturate(150%) blur(16px);

.os-window-box {
  @apply absolute overflow-hidden rounded-md;

  &.focus {
    @apply z-[45]
      shadow-md shadow-stone-950/50;
  }

  &.zoom-animation {
    transition: all 0.5s;
  }

  .os-window-header {
    @apply absolute z-[1];
    width: 100%;
    height: $header-height;

    &.show-header {
      background-color: $header-color;
      backdrop-filter: $header-blur;
    }
    &.show-header.focus {
      background-color: $header-focus-color;
    }

    .app-icon {
      @apply absolute left-0;

      width: $header-height;
      height: $header-height;
      text-align: center;
      line-height: $header-height;
    }
    .app-title {
      @apply max-w-[60%]
        absolute 
        truncate select-none text-xs text-center text-white text-opacity-80
        pointer-events-none;

      left: $header-height;

      height: $header-height;
      line-height: $header-height;
    }
    .os-window-contral {
      @apply flex justify-center items-center gap-1
        absolute right-2 top-1/2 transform -translate-y-1/2
        pointer-events-auto;

      $btn-icon-color: rgba(#424242, 0.8);
      $btn-icon-size: 14px;
      $btn-max-color: #61c554;
      $btn-min-color: #f4be4f;
      $btn-close-color: #ec695e;
      .btn {
        @apply flex justify-center items-center
          rounded-full overflow-hidden cursor-pointer;

        width: $btn-icon-size;
        height: $btn-icon-size;

        &::before,
        &::after {
          opacity: 0;
          transition: all 0.15s;
        }
      }
      &:hover {
        .btn {
          &::before,
          &::after {
            opacity: 1;
          }
        }
      }
      .btn-max {
        background-color: $btn-max-color;

        // 小三角形
        &::before,
        &::after {
          content: "";

          width: 0;
          height: 0;
          border: 3.5px solid transparent;
          border-bottom-color: $btn-icon-color;
          transform: translate(-3px, -3px) rotate(-45deg);

          position: absolute;
          transition: all 0.3s;
        }
        &::after {
          transform: translate(3px, 3px) rotate(135deg);
        }
        &.maximized {
          &::before {
            transform: translate(0.5px, 0.5px) rotate(-45deg);
          }
          &::after {
            transform: translate(-0.5px, -0.5px) rotate(135deg);
          }
        }
      }
      .btn-min {
        background-color: $btn-min-color;

        &::before {
          content: "";
          width: 8px;
          height: 1.6px;
          background-color: $btn-icon-color;
          border-radius: 2px;
        }
      }
      .btn-close {
        background-color: $btn-close-color;

        &::before,
        &::after {
          content: "";

          width: 8px;
          height: 1.6px;
          background-color: $btn-icon-color;
          border-radius: 2px;
          transform: rotate(45deg);

          position: absolute;
        }
        &::before {
          transform: rotate(-45deg);
        }
      }
    }
  }

  .os-window-body {
    background-color: $header-focus-color;
    // backdrop-filter: $header-blur;

    height: calc(100% - $header-height);
    margin-top: $header-height;
    overflow-y: auto;
  }

  .os-window-resize-overlay {
    @apply absolute top-0 left-0 w-full h-full
      bg-red-50 bg-opacity-10
      z-[10];
  }

  $reaction-width: 3px;
  $reaction-width-corner: $reaction-width * 2;
  .os-window-resize-side {
    @apply absolute z-[10];

    &.side-top {
      top: 0;
      left: 0;
      width: 100%;
      height: $reaction-width;
      cursor: n-resize;
    }
    &.side-left {
      top: 0;
      left: 0;
      width: $reaction-width;
      height: 100%;
      cursor: w-resize;
    }
    &.side-right {
      top: 0;
      right: 0;
      width: $reaction-width;
      height: 100%;
      cursor: e-resize;
    }
    &.side-bottom {
      bottom: 0;
      left: 0;
      width: 100%;
      height: $reaction-width;
      cursor: s-resize;
    }
    &.side-top-left {
      top: 0;
      left: 0;
      width: $reaction-width-corner;
      height: $reaction-width-corner;
      cursor: nw-resize;
    }
    &.side-top-right {
      top: 0;
      right: 0;
      width: $reaction-width-corner;
      height: $reaction-width-corner;
      cursor: ne-resize;
    }
    &.side-bottom-left {
      bottom: 0;
      left: 0;
      width: $reaction-width-corner;
      height: $reaction-width-corner;
      cursor: sw-resize;
    }
    &.side-bottom-right {
      bottom: 0;
      right: 0;
      width: $reaction-width-corner;
      height: $reaction-width-corner;
      cursor: se-resize;
    }
  }
}

.windowTransition-enter-active {
  animation: windowTransition 0.3s;
}
.windowTransition-leave-active {
  animation: windowTransition 0.2s reverse;
}
@keyframes windowTransition {
  from {
    opacity: 0;
    transform: translate(0, 50%) scale(0.5);
  }
  to {
    opacity: 1;
  }
}
</style>
