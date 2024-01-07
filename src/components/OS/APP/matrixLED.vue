<template>
  <div class="app-matrix-led-box">
    <div class="mode-options-box">
      <div
        class="option-item"
        :class="{ active: item.value === currentMode }"
        v-for="item in modeOptions"
        @click="onClickMode(item.value)"
      >
        {{ item.name }}
      </div>
    </div>

    <div class="matrix-led-box">
      <table>
        <tr v-for="(row, rowIndex) in configInfo.matrixHeight" :key="rowIndex">
          <td
            class="matrix-led"
            v-for="(col, colIndex) in configInfo.matrixWidth"
            :key="colIndex"
            :style="{
              backgroundColor: getLedValue(ledData[colIndex][rowIndex]),
            }"
            :data-index="colIndex * configInfo.matrixHeight + rowIndex"
            @mousedown="startDrawing(colIndex, rowIndex)"
            @mouseover="draw(colIndex, rowIndex)"
            @mouseup="stopDrawing"
          ></td>
        </tr>
      </table>
    </div>

    <transition name="matrixEditorBoxTransition">
      <div class="matrix-editor-box" v-show="isDefault">
        <div class="left-box">
          <i
            class="iconfont icon-arow_left"
            :class="{ active: matrixLedStore.scrollMode === -1 }"
            @click="setScrollMode(-1)"
          ></i>
          <span
            @click="setScrollMode(0)"
            :class="{ active: matrixLedStore.scrollMode !== 0 }"
          >
            滚动
          </span>
          <i
            class="iconfont icon-arow_right"
            :class="{ active: matrixLedStore.scrollMode === 1 }"
            @click="setScrollMode(1)"
          ></i>

          <span class="ml-2" @click="resetAll">全部重置</span>
        </div>

        <div class="right-box">
          <span class="editor-color-list">
            <div
              class="color-list-item"
              v-for="(item, index) in editorColorList"
              :key="index"
              :style="{ backgroundColor: item }"
              @click="changeEditorColor(item)"
            ></div>
          </span>
          <span class="editor-color" :style="{ backgroundColor: editorColor }">
            <input
              type="color"
              :value="editorColor"
              @input="changeEditorColor($event.target.value)"
              name="editor-color"
              id="editor-color"
            />
          </span>
          <i
            class="iconfont icon-edit"
            :class="{ active: isPencil }"
            @click="isPencil = true"
          ></i>
          <i
            class="iconfont icon-clear"
            :class="{ active: !isPencil }"
            @click="isPencil = false"
          ></i>

          <span @click="saveLedData">保存</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import ledBaseArray from "@/views/index/Experience/Utils/ledUtils/ledBaseArray";
import ledUtils from "@/views/index/Experience/Utils/ledUtils";

import { useMatrixLedStore } from "@/stores/matrix-led";

const matrixLedStore = useMatrixLedStore();

const modeOptions = [
  { name: "基础", value: "default" },
  { name: "时钟", value: "clock" },
  { name: "粉丝", value: "fans" },
];
const currentMode = ref("");
const isDefault = computed(() => {
  return currentMode.value === "default";
});

let scrollModeIntervalId = null;

const configInfo = reactive({
  matrixWidth: 40, // 矩阵的宽度
  matrixHeight: 9, // 矩阵的高度
  ledSize: 16, // 每个LED的大小
  ledSpacing: 2, // LED之间的间距
  color: "#ff74de", // LED 颜色
  baseColor: "#333333", // LED 基础颜色
  colorStrength: 1, // 亮度
});

const postMessage = () => {
  window.parent.postMessage({ type: "matrix-led" }, "*");
};

/**
 * 替换基础颜色
 * @param {*} value
 */
const getLedValue = (value) => {
  if (value === 0) {
    return configInfo.baseColor;
  } else if (value === 1) {
    return configInfo.color;
  } else {
    return value;
  }
};

const ledData = ref(
  Array(configInfo.matrixWidth).fill(Array(configInfo.matrixHeight).fill(0))
);

const onClickMode = (item) => {
  if (item === currentMode.value) return;
  currentMode.value = item;
  clearInterval(scrollModeIntervalId);
  postMessage();

  if (item === "clock") {
    matrixLedStore.setModeIsClock();

    ledData.value = ledUtils.mergeIntoArray(
      Array(configInfo.matrixWidth).fill(
        Array(configInfo.matrixHeight).fill(0)
      ),
      [
        {
          col: 0,
          row: 0,
          array: ledUtils.replaceBaseArrayColor(
            ledBaseArray.heart1,
            configInfo.color
          ),
        },
        {
          col: 12,
          row: 1,
          array: ledUtils.replaceBaseArrayColor(
            ledUtils.getTimeArray(),
            configInfo.color
          ),
        },
        {
          col: 12,
          row: 7,
          array: ledUtils.getWeekArray(),
        },
      ]
    );
  } else if (item === "fans") {
    matrixLedStore.setModeIsFans();
    const fansNum = matrixLedStore.fansNum;
    const numData = ledUtils.replaceBaseArrayColor(
      ledUtils.numToArray(fansNum, 7),
      configInfo.color
    );
    // 目前是固定的情况
    const numStartCol = (29 - numData.length) / 2 + 10;

    ledData.value = ledUtils.mergeIntoArray(
      Array(configInfo.matrixWidth).fill(
        Array(configInfo.matrixHeight).fill(0)
      ),
      [
        {
          col: 1,
          row: 0,
          array: ledUtils.replaceBaseArrayColor(
            ledBaseArray.bilibili0,
            "#44a0fc"
          ),
        },
        {
          col: numStartCol,
          row: 2,
          array: numData,
        },
      ]
    );
  } else {
    matrixLedStore.setModeIsDefault();

    if (matrixLedStore.ledData.length > 0) {
      ledData.value = JSON.parse(JSON.stringify(matrixLedStore.ledData));
    } else {
      ledData.value = ledUtils.replaceBaseArrayColor(
        ledBaseArray.ckjdygc0,
        configInfo.color
      );
    }
  }
};
if (matrixLedStore.modes.mode !== currentMode.value) {
  onClickMode(matrixLedStore.modes.mode);
}

const editorColorList = [
  "#F30600",
  "#FB8615",
  "#3FE900",
  "#1F6BF2",
  "#C800FF",
  "#ff74de",
];
const editorColor = ref(configInfo.color);
const changeEditorColor = (color) => {
  editorColor.value = color;
  isPencil.value = true;
};

/**
 * 画画部分
 */
const isPencil = ref(true);
const isDrawing = ref(false);
const startDrawing = (colIndex, rowIndex) => {
  if (!isDefault.value) return;
  isDrawing.value = true;
  draw(colIndex, rowIndex);
};
const draw = (colIndex, rowIndex) => {
  if (isDrawing.value) {
    if (isPencil.value) {
      // 根据colIndex和rowIndex更新ledData数组中的颜色
      ledData.value[colIndex][rowIndex] = editorColor.value;
    } else {
      ledData.value[colIndex][rowIndex] = 0;
    }
  }
};
const stopDrawing = () => {
  isDrawing.value = false;
};

/**
 * 全部重置
 */
const resetAll = () => {
  ledData.value = ledUtils.replaceBaseArrayColor(
    ledBaseArray.ckjdygc0,
    configInfo.color
  );
  editorColor.value = configInfo.color;
  saveLedData();
  setScrollMode(0);
};

/**
 * 保存
 */
const saveLedData = () => {
  matrixLedStore.setLedData(JSON.parse(JSON.stringify(ledData.value)));
  postMessage();
};

/**
 * 设置 滚动模式
 * @param {*} mode -1:往左 0:不滚 1:往右
 */
const setScrollMode = (mode) => {
  matrixLedStore.setScrollMode(mode);
  clearInterval(scrollModeIntervalId);
  postMessage();

  if (mode === 1) {
    scrollModeIntervalId = setInterval(() => {
      ledData.value.unshift(ledData.value.pop());
    }, 500);
  } else if (mode === -1) {
    scrollModeIntervalId = setInterval(() => {
      ledData.value.push(ledData.value.shift());
    }, 500);
  }
};
</script>

<style lang="scss" scoped>
.app-matrix-led-box {
  @apply text-white text-opacity-80
    w-full h-full overflow-auto
    p-4;
  backdrop-filter: $glass-bg-blur-dark;

  .matrix-led-box {
    @apply w-full aspect-[10/2.28] select-none;

    table {
      @apply w-full h-full select-none;
    }

    .matrix-led {
      @apply border-[1.5px] border-black
        relative cursor-cell select-none;

      &::after {
        content: "";
        @apply absolute top-0 left-0
          w-full h-full
          bg-white bg-opacity-0
          pointer-events-none select-none;
      }

      &:hover {
        &::after {
          @apply bg-opacity-60;
        }
      }
    }
  }

  .mode-options-box {
    @apply mb-4 flex justify-around items-center gap-2;

    .option-item {
      @apply flex-1 p-2
        text-center
      bg-black bg-opacity-10 rounded-lg
        cursor-pointer select-none;
      transition: all 0.5s;

      &:hover,
      &.active {
        @apply bg-white bg-opacity-10;
      }
      &:active {
        @apply bg-opacity-20 scale-95;
      }
    }
  }

  .matrix-editor-box {
    @apply mt-2 flex justify-around gap-2 flex-wrap;

    i.iconfont,
    span {
      @apply text-white text-opacity-60 text-center text-xs
        rounded-md px-2 py-1
        border-[1.5px] border-white border-opacity-20
        cursor-pointer select-none;
      transition: all 0.5s;

      &:hover,
      &.active {
        @apply bg-white bg-opacity-10 border-opacity-40;
      }
      &:active {
        @apply bg-opacity-20 scale-95;
      }
    }

    .right-box {
      @apply flex-1 flex justify-end gap-1 flex-wrap;

      .editor-color {
        @apply w-10 relative;

        input[type="color"] {
          @apply absolute top-0 left-0
            w-full h-full cursor-pointer
            opacity-0;
        }
      }
      .editor-color-list {
        @apply flex gap-1;
        .color-list-item {
          @apply w-4 h-4 rounded-full;
        }
      }
    }

    .left-box {
      @apply flex justify-start gap-1;
    }
  }
}

.matrixEditorBoxTransition-enter-active {
  animation: matrixEditorBoxTransition 0.3s;
}
.matrixEditorBoxTransition-leave-active {
  animation: matrixEditorBoxTransition 0.2s reverse;
}
@keyframes matrixEditorBoxTransition {
  from {
    opacity: 0;
    transform: translate(0, -20%);
  }
  to {
    opacity: 1;
  }
}
</style>
