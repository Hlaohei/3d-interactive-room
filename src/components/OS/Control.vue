<template>
  <transition name="controlTransition">
    <div
      class="os-control-box"
      :style="{
        left: left === 0 ? '50%' : left + 'px',
      }"
    >
      <div class="control-btn-box">
        <div class="btn-item">
          <i
            class="iconfont icon-wi-fi"
            :class="{ active: wifiBtn }"
            @click="onClickWifi"
          ></i>
          <span>WIFI</span>
        </div>
        <div class="btn-item">
          <i
            class="iconfont icon-bluetooth"
            :class="{ active: bluetoothBtn }"
            @click="onClickBluetooth"
          ></i>
          <span>蓝牙</span>
        </div>
        <div class="btn-item">
          <i
            class="iconfont"
            :class="{
              active: soundBtn,
              'icon-sound-on': soundBtn,
              'icon-sound-off': !soundBtn,
            }"
            @click="onClickSound"
          ></i>
          <span>声音</span>
        </div>

        <div class="screen-brightness">
          <label for="screen-brightness">
            <i class="iconfont icon-sun"></i>
          </label>
          <input
            type="range"
            name="screen-brightness"
            class="range"
            min="0.2"
            max="1"
            step="0.01"
            :value="osStore.screenBrightness"
            @input="onChangeBrightness"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useHeiOsStore } from "@/stores/hei-os";

const osStore = useHeiOsStore();

const props = defineProps({
  left: Number,
});

const wifiBtn = ref(true);
const bluetoothBtn = ref(true);
const soundBtn = ref(true);

const onClickWifi = () => {
  wifiBtn.value = !wifiBtn.value;
};
const onClickBluetooth = () => {
  bluetoothBtn.value = !bluetoothBtn.value;
};
const onClickSound = () => {
  soundBtn.value = !soundBtn.value;
};

const onChangeBrightness = (event) => {
  osStore.screenBrightness = event.target.value;
};
</script>

<style lang="scss" scoped>
.os-control-box {
  @include glass-bg-dark(1);
  @apply absolute bottom-14 left-1/2 -translate-x-1/2
    w-60
    rounded-xl p-4
    overflow-auto
    z-[49]
    select-none;

  .control-btn-box {
    @apply w-full grid gap-2 grid-cols-3;

    .btn-item {
      @apply flex flex-col justify-center items-center gap-1
      text-white text-opacity-80;

      i {
        @include glass-bg-dark(1);
        @apply w-full p-1 rounded-md
          text-center text-xl 
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
      span {
        @apply text-xs;
      }
    }

    .screen-brightness {
      @apply flex justify-center items-center gap-2
          col-span-3
          w-full py-2;

      i {
        @apply text-xl text-white text-opacity-80;
      }
      input.range {
        appearance: none;
        vertical-align: middle;
        outline: none;
        border: none;
        @apply flex-1 cursor-pointer
          h-2 rounded-full
          bg-white bg-opacity-10;

        transition: all 0.3s;
        opacity: 0.8;

        &:hover {
          opacity: 1;
        }

        &::-webkit-slider-thumb {
          appearance: none;
          vertical-align: middle;
          outline: none;
          border: none;
          @apply w-4 h-4 rounded-[50%]
            bg-white bg-opacity-80;
        }
      }
    }
  }
}

.controlTransition-enter-active {
  animation: controlTransition 0.3s;
}
.controlTransition-leave-active {
  animation: controlTransition 0.2s reverse;
}
@keyframes controlTransition {
  from {
    opacity: 0;
    transform: translate(-50%, 10%) scale(0.8);
  }
  to {
    opacity: 1;
  }
}
</style>
