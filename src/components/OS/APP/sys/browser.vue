<template>
  <div class="app-sys-browser-box">
    <div
      class="browser-header-box"
      @mousedown.self="onDrag($event)"
      @dblclick.self="onMax()"
    >
      <i
        class="app-icon iconfont"
        :class="appInfo.icon"
        :style="{
          color: appInfo.iconColor || 'rgba(255, 255, 255, 0.8)',
        }"
      ></i>

      <div class="tabs">
        <div
          class="tab-item"
          :class="{ active: currentTab === i }"
          v-for="(tab, i) in tabs"
          :key="i"
          @click="changeTab(i)"
        >
          <span class="tab-name">{{ tab.name }}</span>
          <i class="iconfont icon-close1" @click.stop="removeTab(i)"></i>
        </div>

        <i class="add-tab iconfont icon-plus" @click="addTab"></i>
      </div>

      <div class="blank-box"></div>
    </div>

    <div class="browser-url-box">
      <i class="iconfont icon-arrow-left-1 !cursor-not-allowed"></i>
      <i class="iconfont icon-arrow-right-1 !cursor-not-allowed"></i>
      <i class="iconfont icon-reload1" @click="refreshIframe"></i>
      <i class="iconfont icon-home1" @click="gotoHomePage"></i>

      <input
        type="text"
        :value="tabs[currentTab].url"
        placeholder="搜索或输入 Web 地址"
        @change="changeUrl"
      />

      <i class="iconfont icon-star1 !cursor-not-allowed"></i>
      <i class="iconfont icon-gear-settings !cursor-not-allowed"></i>
    </div>

    <div class="browser-body-box">
      <transition-group name="browserIframeBoxTransition">
        <div
          v-show="currentTab === i"
          class="browser-body-item"
          v-for="(tab, i) in tabs"
          :key="i"
          :data-tab="i"
          :data-name="tab.name"
          :data-url="tab.url"
        >
          <div v-if="tab.url === ''" class="new-tab-box">
            <div class="new-tab-logo">
              <span>必</span>
              <span>谷</span>
              <span>百</span>
            </div>
            <input
              type="text"
              :value="tabs[currentTab].url"
              placeholder="搜索或输入 Web 地址"
              @change="changeUrl"
            />
          </div>

          <iframe
            v-else
            class="browser-iframe-box"
            :src="tab.url"
            frameborder="0"
          ></iframe>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { useHeiOsStore } from "@/stores/hei-os";

const osStore = useHeiOsStore();

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

const tabs = ref([
  {
    name: "新标签页",
    url: "",
  },
]);
const currentTab = ref(0);
const changeTab = (index) => {
  currentTab.value = index;
};

const addTab = () => {
  tabs.value.push({
    name: "新标签页",
    url: "",
  });

  currentTab.value = tabs.value.length - 1;
};

const removeTab = (index) => {
  if (tabs.value.length === 1) {
    osStore.closeApp(props.appInfo.id);
    return;
  }

  tabs.value.splice(index, 1);

  if (currentTab.value > tabs.value.length - 1) {
    currentTab.value = tabs.value.length - 1;
  }
};

const getBingSearchUrl = (keyword) => {
  // https://www.bing.com/search?q=***

  // 拼接url
  return `https://cn.bing.com/search?q=${encodeURIComponent(keyword)}`;
};

const changeUrl = (e) => {
  // 判断是否是url地址
  if (!/^https?:\/\//.test(e.target.value)) {
    // 模拟bing搜索
    tabs.value[currentTab.value].url = getBingSearchUrl(e.target.value);
    tabs.value[currentTab.value].name = e.target.value + " - 搜索";
  } else {
    tabs.value[currentTab.value].url = e.target.value;
    // 提取出url地址
    const url = new URL(e.target.value);
    tabs.value[currentTab.value].name = url.host;
  }
  // 失去焦点
  e.target.blur();
};

const refreshIframe = () => {
  if (tabs.value[currentTab.value].url === "") return;

  let urlCopy = tabs.value[currentTab.value].url;
  tabs.value[currentTab.value].url = "";
  setTimeout(() => {
    tabs.value[currentTab.value].url = urlCopy;
  }, 0);
};

const gotoHomePage = () => {
  tabs.value[currentTab.value].url = window.location.origin;
  tabs.value[currentTab.value].name = "主页";
};
</script>

<style lang="scss" scoped>
.app-sys-browser-box {
  @apply text-white text-opacity-80 select-none
    w-full h-full
    flex flex-col gap-1;
  backdrop-filter: $glass-bg-blur-dark;

  .browser-header-box {
    @apply w-full h-6 select-none overflow-hidden
      flex justify-between items-center;

    .tabs {
      @apply flex-1 h-full
        flex flex-grow overflow-hidden
        pointer-events-none;
      transition: all 0.3s;

      div {
        @apply w-max min-w-max;
      }

      .tab-item {
        @apply flex justify-between items-center flex-grow 
          h-full max-w-[8rem] min-w-0 w-0
          rounded-md overflow-hidden
          pl-2 pr-1
          pointer-events-auto cursor-pointer
          relative;
        transition: all 0.3s;

        &::before {
          content: "";
          @apply w-[2px] h-3 rounded-full
            bg-white bg-opacity-20
            absolute left-0.5 top-1/2 -translate-y-1/2;
          transition: all 0.3s;
        }

        .tab-name {
          @apply h-full flex-grow truncate text-xs leading-[1.46rem];
        }
        .iconfont {
          @apply w-4 h-4 text-xs text-white text-opacity-40
            flex justify-center items-center
            rounded-md;
          transition: all 0.3s;

          &:hover {
            @apply bg-white bg-opacity-10 text-opacity-60;
          }
        }

        &.active,
        &:hover {
          @apply bg-white bg-opacity-10;

          &::before {
            @apply opacity-0;
          }
        }
      }

      .add-tab {
        @apply text-sm text-white text-opacity-60
          w-6 h-6 flex justify-center items-center
          rounded-md cursor-pointer pointer-events-auto;
        transition: all 0.3s;

        &:hover {
          @apply bg-white bg-opacity-20 text-opacity-80;
        }
      }
    }

    .app-icon {
      @apply text-xl px-1 pointer-events-none;
    }
    .blank-box {
      @apply w-16 h-full pointer-events-none;
    }
  }

  .browser-url-box {
    @apply w-full h-6 px-1 
      flex justify-center items-center gap-1;

    .iconfont {
      @apply text-xs text-white text-opacity-40
        w-6 h-6 flex justify-center items-center rounded-md
        cursor-pointer;
      transition: all 0.3s;

      &:hover {
        @apply bg-white bg-opacity-10 text-opacity-60;
      }
    }

    input {
      @apply appearance-none outline-none
        h-full flex-1 px-2
        text-xs leading-none text-white text-opacity-40
        bg-black bg-opacity-10 rounded-full
        border border-white border-opacity-10
        select-none;
      transition: all 0.3s;

      &::placeholder {
        @apply text-white text-opacity-20;
      }

      &:focus {
        @apply bg-white bg-opacity-5 border-opacity-20 text-opacity-60
        select-auto;
      }
    }
  }

  .browser-body-box {
    @apply flex-1 w-full h-full rounded-t-md overflow-hidden relative;

    .browser-iframe-box {
      width: 100%;
      height: 100%;

      position: absolute;
      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%) scale(calc(1 / 1));
    }

    .new-tab-box {
      @apply absolute top-0 left-0 w-full h-3/4
        flex justify-center items-center flex-col gap-6;

      input {
        @apply appearance-none outline-none
        h-10 w-2/4 px-4
        text-sm leading-none text-white text-opacity-40
        bg-black bg-opacity-10 rounded-full
        border border-white border-opacity-10
        select-none;
        transition: all 0.3s;

        &::placeholder {
          @apply text-white text-opacity-20 text-center;
        }

        &:focus {
          @apply bg-white bg-opacity-5 border-opacity-20 text-opacity-60
        select-auto;
        }
      }

      .new-tab-logo {
        font-size: 2.5rem;
        font-weight: bold;

        span {
          margin: 0 0.6rem;
          color: transparent;
          background-clip: text;
        }
        span:nth-child(1) {
          background-image: linear-gradient(-45deg, #3ab8f6, #214ee0, #40d8dd);
        }
        span:nth-child(2) {
          background-image: linear-gradient(
            to right,
            #4285f4,
            #ea4335,
            #fbbc05,
            #4285f4,
            #34a853,
            #ea4335
          );
        }
        span:nth-child(3) {
          background-image: linear-gradient(
            to right,
            #e10602,
            #2932e1,
            #e10602
          );
        }
      }
    }
  }
}

// 动画
.browserIframeBoxTransition-enter-active {
  animation: browserIframeBoxTransition 0.5s;
}
.browserIframeBoxTransition-leave-active {
  animation: browserIframeBoxTransition 0s reverse;
}
@keyframes browserIframeBoxTransition {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
