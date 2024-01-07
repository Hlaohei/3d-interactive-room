<template>
  <div style="height: 101vh; width: 100%">
    <div
      class="hei-os-page"
      :style="{ filter: `brightness(${osStore.screenBrightness})` }"
    >
      <section class="wallpaper-box" @click="osStore.closeAll()">
        <OS-Wallpaper />
      </section>

      <section class="dock-box">
        <div
          class="dock dock-start-box"
          :class="{ active: showStartMenu }"
          @click="osStore.openStartMenu()"
        >
          <i class="iconfont icon-appstore-fill"></i>
        </div>

        <transition name="dockAppsTransition">
          <div v-show="taskList && taskList.length" class="dock dock-apps-box">
            <transition-group name="dockAppsItemTransition">
              <div
                class="dock-apps-item"
                :class="{ active: item.focus }"
                v-for="item in taskList"
                :key="item.id"
                @click="onClickTask(item.id)"
              >
                <i
                  class="iconfont"
                  :class="item.icon"
                  :style="{
                    color: item.iconColor || 'rgba(255, 255, 255, 0.8)',
                  }"
                ></i>
              </div>
            </transition-group>
          </div>
        </transition>

        <div
          ref="dockControlBoxRef"
          class="dock dock-control-box"
          :class="{ active: showControl }"
          @click="onClickControl"
        >
          <span><i class="iconfont icon-wi-fi"></i></span>
          <span><i class="iconfont icon-bluetooth"></i></span>
          <span><i class="iconfont icon-sun"></i></span>
        </div>

        <div
          ref="dockDateBoxRef"
          class="dock dock-date-box"
          :class="{ active: showCalendar }"
          @click="onClickCalendar"
        >
          <span>{{ currentTime }}</span>
          <span>{{ currentDate }}</span>
        </div>
      </section>

      <OS-Start v-show="showStartMenu" />

      <OS-Control v-show="showControl" :left="controlLeft" />

      <OS-Calendar v-show="showCalendar" :left="calendarLeft" />

      <transition-group name="windowTransition">
        <OS-Window
          v-for="item in taskList"
          :key="item.id"
          :setting="item"
          class="windowTransition"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { useHeiOsStore } from "@/stores/hei-os";

const osStore = useHeiOsStore();

const showStartMenu = computed(() => osStore.startMenu || false);

const taskList = computed(() => {
  if (osStore.tasks.length > 0) {
    return osStore.tasks.sort((a, b) => {
      return a.date - b.date;
    });
  }
  return [];
});

const onClickTask = (id) => {
  osStore.minOrShowApp(id);
};

const showControl = computed(() => osStore.control || false);
const dockControlBoxRef = ref(null);
const controlLeft = ref(0);
const onClickControl = () => {
  if (!dockControlBoxRef.value) return;

  const rect = dockControlBoxRef.value.getBoundingClientRect();
  const { left, width } = rect;
  controlLeft.value = left + width / 2;

  osStore.openControl();
};

const showCalendar = computed(() => osStore.calendar || false);
const calendarLeft = ref(0);
const dockDateBoxRef = ref(null);
const onClickCalendar = () => {
  if (!dockDateBoxRef.value) return;

  const rect = dockDateBoxRef.value.getBoundingClientRect();
  const { left, width } = rect;
  calendarLeft.value = left + width / 2;

  osStore.openCalendar();
};

/**
 * 获取当前时间，格式为 HH : mm : ss
 *
 * @return {string} 当前时间，格式为 HH : mm : ss
 */
const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `${hours} : ${minutes} : ${seconds}`;
};

/**
 * 获取当前日期，格式为YYYY/MM/DD 星期X。
 *
 * @return {string} 当前日期，格式为YYYY/MM/DD 星期X。
 */
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const weekday = ["日", "一", "二", "三", "四", "五", "六"][now.getDay()];
  return `${year}/${month}/${day} 星期${weekday}`;
};

const currentTime = ref("");
const currentDate = ref("");

/**
 * 简单更新 桌面dock栏 的时间
 */
currentDate.value = getCurrentDate();
currentTime.value = getCurrentTime();
// 时间要实时更新
setInterval(() => {
  currentTime.value = getCurrentTime();
}, 1000);

/**
 * 监听页面必要事件并传到主页面进行处理
 */
// 页面加载完毕后，添加 postMessage 事件
// addEventListener("mousemove", (event) => {
//   window.parent.postMessage(
//     { clientX: event.clientX, clientY: event.clientY, type: "mousemove" },
//     "*"
//   );
// });
addEventListener("mousedown", (event) => {
  window.parent.postMessage({ type: "mousedown" }, "*");
});
addEventListener("mouseup", (event) => {
  window.parent.postMessage({ type: "mouseup" }, "*");
});
addEventListener("keydown", (event) => {
  window.parent.postMessage(
    {
      type: "keydown",
      key: event.key,
      code: event.code,
      repeat: event.repeat,
    },
    "*"
  );
});
addEventListener("keyup", (event) => {
  window.parent.postMessage(
    { type: "keyup", key: event.key, code: event.code },
    "*"
  );
});
</script>

<style lang="scss" scoped>
.hei-os-page {
  @apply fixed top-0 left-0 overflow-hidden
    w-screen h-screen 
    bg-black text-white;

  .wallpaper-box {
    @apply absolute top-0 left-0 w-full h-full;
  }

  .dock-box {
    @apply absolute bottom-2 left-1/2 z-50
      w-[90%]
      flex flex-wrap justify-center items-center gap-2
      pointer-events-none;

    transform: translateX(-50%);

    .dock {
      @apply h-10 bg-white rounded-lg
        text-white text-opacity-80
        p-1 pointer-events-auto;
      transition: all 0.3s;
      @include glass-bg-dark(1);
      // background-color: rgba($color: #1f1f1f, $alpha: 0.5);
      // backdrop-filter: saturate(150%) blur(16px);
    }

    .dock-start-box {
      @apply w-10 flex justify-center items-center
        cursor-pointer 
        select-none;

      &:hover,
      &.active {
        background-color: rgba($color: #ffffff, $alpha: 0.1);
      }
      &:active {
        background-color: rgba($color: #ffffff, $alpha: 0.2);
        transform: scale(0.95);
      }

      i {
        @apply text-2xl;
      }
    }

    .dock-apps-box {
      @apply flex justify-center items-center gap-1;
      transition: all 0.3s;

      .dock-apps-item {
        @apply flex justify-center items-center
          w-8 h-8 rounded 
          cursor-pointer select-none;
        @include glass-bg-dark(0);
        transition: all 0.3s;

        &:hover,
        &.active {
          background-color: rgba($color: #ffffff, $alpha: 0.1);
        }
        &:active {
          background-color: rgba($color: #ffffff, $alpha: 0.2);
          transform: scale(0.95);
        }

        i {
          @apply text-base;
        }
      }
    }

    .dock-control-box {
      @apply flex justify-center items-center gap-1
        
        select-none cursor-pointer;

      &:hover,
      &.active {
        background-color: rgba($color: #ffffff, $alpha: 0.1);
      }
      &:active {
        background-color: rgba($color: #ffffff, $alpha: 0.2);
        transform: scale(0.95);
      }
    }

    .dock-date-box {
      @apply flex flex-col justify-center items-center
        px-2
        text-xs 
        select-none cursor-pointer;

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

.dockAppsTransition-enter-active {
  animation: dockAppsTransition 0.5s;
}
.dockAppsTransition-leave-active {
  animation: dockAppsTransition 0.3s reverse;
}
@keyframes dockAppsTransition {
  from {
    opacity: 0;
    transform: translate(0, 50%) scale(0.8);
  }
  to {
    opacity: 1;
  }
}

.dockAppsItemTransition-enter-active {
  animation: dockAppsItemTransition 0.5s;
}
.dockAppsItemTransition-leave-active {
  animation: dockAppsItemTransition 0.3s reverse;
}
@keyframes dockAppsItemTransition {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
  }
}
</style>
