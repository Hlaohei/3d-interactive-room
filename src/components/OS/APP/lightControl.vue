<template>
  <div class="app-light-control-box">
    <header
      class="custom-header w-full h-12 absolute top-0 left-0 opacity-0"
      @mousedown.self="onDrag($event)"
      @dblclick.self="onMax()"
    ></header>

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

    <div class="lights-options-box">
      <div
        class="options-bg"
        :style="{
          width: `${100 / lights.length}%`,
          left: `${(lights.indexOf(currentLight) / lights.length) * 100}%`,
        }"
      ></div>

      <span
        class="options-item"
        :class="{ active: item === currentLight }"
        v-for="item in lights"
        @click="onClickItem($event, item)"
      >
        {{ item }}
      </span>
    </div>

    <div
      class="lights-item-box"
      :style="{
        width: `${lights.length * 100}%`,
        left: `-${lights.indexOf(currentLight) * 100}%`,
      }"
    >
      <div class="light-item room-light">
        <div class="light-switch-box">
          <input
            type="checkbox"
            name="toggle"
            :checked="lightStore.roomLightIntensity"
            @change="roomLightChange"
          />
          <label for="toggle">
            <div class="bulb">
              <span class="bulb-center"></span>

              <span class="filament-1"></span>
              <span class="filament-2"></span>

              <span class="reflections"></span>
            </div>
          </label>
        </div>

        <i class="iconfont icon-home"></i>
      </div>

      <div class="light-item desk-light">
        <div ref="colorPickerBoxRef" class="color-picker-box"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLightControlStore } from "@/stores/light-control";

import iro from "@jaames/iro";

const lightStore = useLightControlStore();

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

const lights = ["房间", "桌面"];
const currentLight = ref("房间");
const onClickItem = (e, item) => {
  currentLight.value = item;
};

const postMessage = () => {
  window.parent.postMessage({ type: "light-control" }, "*");
};

const roomLightChange = (e) => {
  lightStore.setRoomLightIntensity(e.target.checked);
  postMessage();
};

const colorPickerBoxRef = ref(null);
onMounted(() => {
  const colorPicker = new iro.ColorPicker(colorPickerBoxRef.value, {
    // layout: [
    //   {
    //     component: iro.ui.Wheel,
    //   },
    // ],
    color: lightStore.deskLightColor,
    width: 200,
    padding: 0,
    handleRadius: 12,
    borderWidth: 2,
    borderColor: "#f1f1f1",
    margin: 40,
  });

  colorPicker.on("color:change", (color) => {
    lightStore.setDeskLightColor(color.hexString);
    postMessage();
  });
});
</script>

<style lang="scss" scoped>
.app-light-control-box {
  @apply text-white text-opacity-80
    w-full h-full relative;

  background-color: #2a2a2a;
  // background-color: #fdbd47;

  .app-name {
    @apply font-semibold tracking-[0.25rem] indent-1
      absolute top-4 left-1/2 -translate-x-1/2 z-20
      select-none;
  }

  .lights-options-box {
    @apply absolute bottom-4 left-1/2 -translate-x-1/2 z-30
      w-3/5 h-10 rounded-full
      flex justify-around items-center;

    background-color: rgba(#000000, 0.1);

    .options-item {
      @apply text-white text-opacity-60 text-xs
        text-center tracking-[0.25rem] indent-1 leading-10
        w-full h-full
        select-none cursor-pointer;
      transition: all 0.3s;

      &.active {
        @apply text-white text-opacity-80;
      }
    }

    .options-bg {
      @apply absolute top-0 left-0
        w-0 h-full rounded-full
        -z-10;
      transition: all 0.3s;

      background-color: rgba(#ffffff, 0.1);
    }
  }

  .lights-item-box {
    @apply flex justify-center items-center
      h-4/5 absolute top-10 z-10;
    left: 0;
    transition: all 0.5s;

    .light-item {
      @apply w-full h-full p-4
        relative;

      &.room-light {
        @apply flex justify-center items-center flex-col gap-5;

        .iconfont {
          @apply absolute -bottom-8 left-1/2 -translate-x-1/2 -z-10
            text-[12rem] text-black text-opacity-5
            select-none pointer-events-none;
        }
      }

      &.desk-light {
        @apply flex flex-col justify-center items-center;
      }
    }
  }
}

$light-switch-transition: all 0.7s;
$light-switch-padding: 5%;
.light-switch-box {
  width: 200px;
  height: 100px;
  // background-color: rgba(#000000, 0.1);

  transform: rotate(-90deg);

  position: relative;

  input {
    appearance: none;
    outline: none;

    width: 100%;
    height: 100%;
    cursor: pointer;

    position: absolute;
    z-index: 100;
  }

  label {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 999px;
    box-sizing: content-box;

    box-shadow: inset 0 0 20px rgba(#000000, 0.2),
      inset 0 0 5px -2px rgba(#000000, 0.4);

    .bulb {
      height: 80%;
      aspect-ratio: 1;
      background-color: rgba(#ffffff, 0.1);
      border-radius: 50%;
      box-shadow: inset 0 0 1px 2px rgba(#ffffff, 0.02),
        inset 0 0 6px 8px rgba(#000000, 0.1),
        -20px 0 30px -10px rgba(#000000, 0.4);

      position: absolute;
      top: 50%;
      left: $light-switch-padding;
      transform: translate(0, -50%);
      transition: $light-switch-transition;

      .bulb-center {
        height: 50%;
        width: 50%;
        background-color: rgba(#ffffff, 0.05);
        border-radius: 50%;
        box-shadow: inset 0 0 4px 4px rgba(#ffffff, 0.05);

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: $light-switch-transition;

        &:after {
          content: "";

          height: 35%;
          width: 35%;
          border-radius: 50%;
          background-color: rgba(#ffffff, 0.15);
          box-shadow: 0 0 4px 4px rgba(#000000, 0.1);

          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: $light-switch-transition;
        }
      }

      .filament-1,
      .filament-2 {
        height: 48%;
        width: 48%;
        border-radius: 50%;
        overflow: hidden;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: $light-switch-transition;

        &::before,
        &::after {
          content: "";
          display: block;

          width: 50%;
          height: 50%;
          border-radius: 50%;
          border: 1px solid rgba(#000000, 0.1);

          position: absolute;
          top: -18%;
          left: -18%;
          transition: $light-switch-transition;
        }
        &::after {
          bottom: -18%;
          top: auto;
        }
      }
      .filament-2 {
        &::before,
        &::after {
          left: auto;
          right: -18%;
        }
      }

      .reflections {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;

        position: absolute;
        perspective: 70px;

        &::before {
          content: "";
          height: 90%;
          width: 80%;
          background-image: linear-gradient(
            80deg,
            rgba(#ffffff, 0.02) 45%,
            rgba(#ffffff, 0.2)
          );
          border-radius: 10% 20% 50% 30% / 30% 60% 30% 40%;

          position: absolute;
          top: -40%;
          right: -26%;
          transform-style: preserve-3d;
          transform: rotateX(-25deg) rotate(35deg) skewx(-15deg);
        }
        &::after {
          content: "";
          display: block;
          height: 50%;
          width: 30%;
          border-radius: 50%;
          box-shadow: 4px -2px 0 -3px rgba(#ffffff, 0.4);
          filter: blur(1px);

          position: absolute;
          bottom: 2%;
          right: 25%;
          transform: rotate(70deg);
        }
      }
    }
  }

  input:checked + label {
    .bulb {
      left: 100% - $light-switch-padding;
      transform: translate(-100%, -50%);

      background-color: rgba(#ebc168, 0.1);
      box-shadow: inset 0 0 1px 2px rgba(#eab880, 0.1),
        inset 0 0 6px 8px rgba(#ffffff, 0.1),
        -20px 0 30px -10px rgba(#000000, 0.1), 0 0 30px 50px rgba(#fdb843, 0.1),
        0 0 50px 80px rgba(#fdb843, 0.05);

      .bulb-center {
        background-color: rgba(#feed6b, 0.8);
        box-shadow: inset 0 0 4px 4px rgba(#fdec6a, 0.5),
          0 0 12px 10px rgba(#e2cb4a, 0.5), 0 0 20px 14px rgba(#ffd466, 0.5);

        &:after {
          background-color: rgba(#fef401, 0.8);
          box-shadow: 0 0 2px 4px rgba(#fdb843, 0.8);
        }
      }

      .filament-1,
      .filament-2 {
        &:before,
        &:after {
          border-color: rgba(#fef4d5, 0.8);
        }
      }
    }
  }
}
</style>
