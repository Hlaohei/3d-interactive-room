<template>
  <div class="index-page-box">
    <transition name="loadingTransition">
      <section v-if="showLoading" class="loading-box">
        <img
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.25]"
          src="/image/logo/logo-small.svg"
          alt="logo"
        />

        <OS-Window ref="terminalLoadingRef" :setting="terminalLoadingSetting" />

        <transition name="startBtnBoxTransition">
          <div
            v-if="showStartBtn"
            class="start-btn-box"
            :style="{
              top: startBtnTop + 'px',
            }"
            @click="onClickStart"
          >
            <button type="button" class="start-btn">开 始</button>
          </div>
        </transition>
      </section>
    </transition>

    <section
      id="info-box"
      class="info-box"
      :style="{ '--shadow-color': color }"
    >
      <h1 class=""><span class="text-bg">hei</span>，创客界的一根葱</h1>
      <!-- <p>不会 <b>建模</b> 的 <b>程序员</b> 不是一个好的 <b>产品经理</b></p> -->
      <p>分享有趣的技术</p>
    </section>

    <div ref="threeContainerRef" id="three-container"></div>
  </div>
</template>

<script setup>
import Experience from "./Experience/Experience";

import { useMatrixLedStore } from "@/stores/matrix-led";
// import { getBiliBiliInfo } from "@/api/third-party/bilibili";
import { useLoadingStore } from "@/stores/loading";
import { useLightControlStore } from "@/stores/light-control";

const matrixLedStore = useMatrixLedStore();

const threeContainerRef = ref(null);

const showLoading = ref(true);
const showStartBtn = ref(false);
const terminalLoadingSetting = reactive({
  id: "0061",
  name: "终端",
  page: "sys/terminal",
  icon: "icon-codelibrary",
  iconColor: "#DBDBDB",
  header: true,
  width: 400,
  height: 300,
  resizable: true,
  min: false,
  focus: true,
  isLoading: true,
});
const loadingStore = useLoadingStore();

const terminalLoadingRef = ref();
const startBtnTop = ref(0);
onMounted(() => {
  if (!terminalLoadingRef.value) return;

  nextTick(() => {
    const terminalEl = terminalLoadingRef.value.$el;
    startBtnTop.value = terminalEl.offsetTop + terminalEl.offsetHeight + 24;
  });
});

const onClickStart = () => {
  showLoading.value = false;

  window.experience.navigation.viewModes.default();
};

matrixLedStore.setFansNum(666);
// const getBiliBili = () => {
//   getBiliBiliInfo().then((res) => {
//     if (!res) return;
//     matrixLedStore.setFansNum(res.result.follower);
//   });
// };
// getBiliBili();

// 加载完成后调用
onMounted(() => {
  if (!window.experience) {
    window.experience = new Experience({
      targetElement: threeContainerRef.value,
    });
    window.experience.update();

    // console.time("测试");
    window.experience.resources.on("progress", (_current, _resource) => {
      // 百分比
      const percent = (_current.loaded / _current.toLoad) * 100;

      // console.log(percent.toFixed(2) + "%");
      loadingStore.loadingProgress = {
        resource: _resource,
        percent,
      };
    });
    window.experience.resources.on("end", () => {
      // console.timeEnd("测试");
      setTimeout(() => {
        showStartBtn.value = true;
      }, 1500);
      watch(
        () => loadingStore.start,
        (newValue) => {
          if (newValue) {
            setTimeout(() => {
              onClickStart();
            }, 500);
          }
        }
      );
    });
  }
});
onBeforeUnmount(() => {
  // 销毁之前创建的 Experience 对象
  if (window.experience) {
    delete window.experience;
  }
});

const lightStore = useLightControlStore();
let color = ref("");
onMounted(() => {
  color.value = lightStore.deskLightColor;
  window.addEventListener(
    "message",
    (event) => {
      if (event.data.type === "light-control") {
        const localStorage = JSON.parse(
          window.localStorage.getItem("light-control")
        );

        if (localStorage) {
          color.value = localStorage.deskLightColor;
        }
      }
    },
    false
  );
});
onBeforeUnmount(() => {
  window.removeEventListener("message", (event) => {});
});
</script>

<style lang="scss" scoped>
.index-page-box {
  @apply fixed w-screen h-screen overflow-hidden;

  #three-container {
    @apply absolute w-full h-full;
  }
}

.loading-box {
  @apply fixed z-[99999] w-screen h-screen bg-black bg-opacity-100;
  background-image: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    #5b5b5b 0%,
    black 100%
  );

  .start-btn-box {
    @apply absolute left-1/2 -translate-x-1/2
      cursor-pointer;

    width: 250px;
    height: 100px;

    transform-style: preserve-3d;
    perspective: 40rem;

    .start-btn {
      @apply text-white text-opacity-40 
        text-5xl leading-none font-bold align-middle
        w-full h-full outline-none
        border-4 border-white border-opacity-10 rounded-2xl
        relative;
      transition: all 0.5s;

      transform-style: preserve-3d;
      perspective: 40rem;
      transform: rotateX(45deg);
      box-shadow: 0 60px 40px 1px rgba(#000000, 0.1);

      &::before,
      &::after {
        content: "";

        @apply w-full h-full
          absolute left-0 top-0
          border-4 border-white border-opacity-5 rounded-2xl;
        transform: translateZ(-60px);
        transition: opacity 0.5s, transform 0.3s;
      }
      &::before {
        transform: translateZ(-30px);
      }
    }

    &:hover .start-btn {
      @apply border-opacity-60 text-opacity-80 scale-105
        shadow-none;

      &::before,
      &::after {
        @apply opacity-0;
        transform: translateZ(0);
      }
    }
    &:active .start-btn {
      @apply scale-95;
    }
  }
}

.info-box {
  @apply absolute bottom-[20%] left-[10%] z-[888]
    flex justify-center items-center flex-col gap-2 lg:gap-4
    transition-all duration-500 select-none;

  h1 {
    @apply text-[max(2rem,6vmin)] font-bold tracking-wide
    text-white text-opacity-90;
  }

  p {
    @apply text-[max(1rem,3vmin)] text-white text-opacity-80 tracking-widest;
  }
}

// --shadow-color: #ff74de;
.text-bg {
  transition: all 0.5s;
}
h1:hover .text-bg {
  text-shadow: 0 0 5px var(--shadow-color), 0 0 25px var(--shadow-color),
    0 0 50px var(--shadow-color), 0 0 100px var(--shadow-color);
}

.loadingTransition-leave-active {
  animation: loadingTransition 0.3s;
}
@keyframes loadingTransition {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.5);
  }
}

.startBtnBoxTransition-enter-active {
  animation: startBtnBoxTransition 0.5s;
}
@keyframes startBtnBoxTransition {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
<style lang="scss">
.phone-screen-box {
  @apply text-white text-opacity-90 text-lg text-center tracking-wider
    flex justify-center items-center flex-col gap-2;

  span {
    @apply text-2xl;
  }
  span:nth-child(1) {
    @apply text-5xl mb-5;
  }
}
</style>
