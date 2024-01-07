<template>
  <div
    class="app-sys-about-box"
    :style="{ '--shadow-color': lightStore.deskLightColor }"
  >
    <header
      class="w-full h-8 absolute top-0"
      @mousedown.self="onDrag($event)"
      @dblclick.self="onMax()"
    ></header>

    <div v-if="!richText">
      <h1 class="title-box">
        <span class="text-bg">c</span>kjdyg<span class="text-bg">c</span>
        <span class="text-2xl">.cc</span>
      </h1>

      <div class="info-box">
        <p>
          <b>创客界的一根葱</b>，技术分享博主，在
          Bilibili、抖音等平台分享各种新奇技术、好玩的案例等。
        </p>
        <p>
          ckjdygc.cc
          网站则是为了更好地进行技术分享，搭建的一个分享平台。平台目前有两大板块：
        </p>

        <p class="text-sm px-4 py-1">
          <b>分享：</b>类似个人博客，主要以图文形式分享各种技术文章，笔记等
        </p>
        <p class="text-sm px-4 py-1">
          <b>预览：</b
          >分享的所有支持在线预览的案例都可以在这里找到预览效果及源代码
        </p>
      </div>

      <h1 class="title-box">hei<span class="text-bg">OS</span></h1>

      <div class="info-box">
        <p>
          <b>heiOS</b> 是使用前端 <b>vue</b> 技术搭建的仿系统界面，整体的 UI
          设计则汇集了 macOS 与 Windows 的风格，会有一种既熟悉又陌生的感觉。
        </p>

        <p>
          为了让 heiOS 看起来更加真实，系统内部包含了多个
          <b>应用</b>，欢迎尝鲜体验：
        </p>

        <p class="text-sm px-4 py-1">
          <b>基础应用：</b>显示设置、计算器、浏览器、终端
        </p>
        <p class="text-sm px-4 py-1"><b>房间控制应用：</b>灯光控制、矩阵LED</p>
        <p class="text-sm px-4 py-1"><b>网站应用：</b>分享、预览</p>
      </div>
    </div>

    <div v-else class="rich-text" v-html="richText"></div>
  </div>
</template>

<script setup>
// import { useWebsiteInfoStore } from "@/stores/website-info";
import { useLightControlStore } from "@/stores/light-control";

// const websiteInfoStore = useWebsiteInfoStore();
const lightStore = useLightControlStore();

const emit = defineEmits(["onDrag", "onMax"]);
const onDrag = (e) => {
  emit("onDrag", e);
};
const onMax = () => {
  emit("onMax");
};

const richText = ref("");

// const obj = websiteInfoStore.getInfoByName("about");
// if (obj && typeof obj.value === "string") {
//   richText.value = obj.value;
// }
</script>

<style lang="scss" scoped>
.app-sys-about-box {
  @apply text-white text-opacity-80 select-none w-full h-full overflow-auto
    pb-4 tracking-wide relative;
  backdrop-filter: $glass-bg-blur-dark;

  h1 {
    @apply py-10 text-4xl text-center;

    .text-bg {
      @apply text-5xl transition-all duration-500;
    }

    &:hover .text-bg {
      text-shadow: 0 0 5px var(--shadow-color), 0 0 25px var(--shadow-color),
        0 0 50px var(--shadow-color), 0 0 100px var(--shadow-color);
    }
  }

  .info-box {
    @apply px-4;
  }

  p {
    @apply py-1;
  }
}
</style>
