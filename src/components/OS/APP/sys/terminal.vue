<template>
  <div ref="appSysTerminalBoxRef" class="app-sys-terminal-box">
    <div
      ref="historyLogBoxRef"
      class="history-log-box"
      style="white-space: break-spaces; word-break: break-all"
    ></div>

    <div
      class="current-line-box min-h-[80px] cursor-text"
      @click="inputRef.focus"
    >
      <p v-show="!isPrintingLog">
        <span class="input-user-name">[ckjdygc ~]</span>

        <span
          ref="inputRef"
          class="input-content"
          contenteditable="true"
          spellcheck="false"
          @keydown="handleKeydown"
          @keyup="handleKeyup"
        >
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import APPList from "@/components/OS/APP";
import { useHeiOsStore } from "@/stores/hei-os";
import { useLoadingStore } from "@/stores/loading";
const osStore = useHeiOsStore();
const loadingStore = useLoadingStore();

const props = defineProps({
  appInfo: Object,
});
const isLoading = computed(() => {
  return props.appInfo.isLoading;
});

const introductoryText = ref(`hei，创客界的一根葱 - 分享有趣的技术\r`);

const appSysTerminalBoxRef = ref(null);
const scrollToBottom = () => {
  if (!appSysTerminalBoxRef.value) return;
  appSysTerminalBoxRef.value.scrollTop =
    appSysTerminalBoxRef.value.scrollHeight;
};

const isPrintingLog = ref(false);
const historyLogBoxRef = ref(null);
onMounted(() => {
  if (!historyLogBoxRef.value) return;

  if (isLoading.value) {
    addLog('<span class="text-green-400 mr-2">[ckjdygc ~]</span>npm install');
    addLog("🛫 开始加载资源......");
    watch(
      () => loadingStore.loadingProgress,
      (newValue) => {
        addLog(`> ${newValue.percent.toFixed(2)}%  ${newValue.resource.name}`);
        isPrintingLog.value = true;
        if (newValue.percent === 100) {
          addLogOneByOne(`👌 加载完毕`, 20, () => {
            addLineBreak();
            addLogOneByOne(introductoryText.value, 20, () => {
              addLineBreak();
              addLogOneByOne(`输入 'npm run start' 开始，或点击下方开始按钮`);
            });
          });
        }
      }
    );
  } else {
    addLogOneByOne(introductoryText.value, 20, () => {
      addLogOneByOne(new Date().toLocaleString());
      addLineBreak();
    });
  }
});

/**
 * 延迟执行
 * @param {*} ms
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * 普通文字打印
 * @param {*} text
 */
const addLog = (text) => {
  isPrintingLog.value = true;
  const p = document.createElement("p");
  historyLogBoxRef.value.appendChild(p);
  p.innerHTML = text;

  isPrintingLog.value = false;
  scrollToBottom();
  focusInput();
};
/**
 * 错误打印 文字是红色
 * @param {*} text
 */
const addLogError = (text) => {
  isPrintingLog.value = true;
  const p = document.createElement("p");
  historyLogBoxRef.value.appendChild(p);
  p.innerHTML = text;
  p.className = "text-red-500";

  isPrintingLog.value = false;
  scrollToBottom();
  focusInput();
};
/**
 * 一个接一个字打印一段
 * @param {*} text
 * @param {*} delay
 * @param {*} callback
 */
const addLogOneByOne = async (text, delay = 20, callback) => {
  // 判断text是否是文字和是否为空
  if (typeof text !== "string" || text === "") return;

  isPrintingLog.value = true;
  const characters = Array.from(text);
  let index = 0;

  const p = document.createElement("p");
  historyLogBoxRef.value.appendChild(p);

  for (const character of characters) {
    if (index === characters.length - 1) {
      isPrintingLog.value = false;
      focusInput();

      if (callback) {
        callback();
      }
    }
    p.innerHTML += character;
    index++;
    scrollToBottom();
    await sleep(delay);
  }
};
// 插入一行换行
const addLineBreak = () => {
  historyLogBoxRef.value.insertAdjacentHTML("beforeend", "<br/>");
  scrollToBottom();
};

/**
 * 加载页面时使用的命令
 */
const loadingCommands = [
  {
    name: "npm",
    description: "npm 命令",
    fn: ([command, childCommand, action]) => {
      if (childCommand === "run" && action === "start") {
        addLogOneByOne("欢迎光临!!!");
        addLineBreak();

        loadingStore.start = true;
      } else {
        addLogError(`请正确输入命令`);
        addLineBreak();
      }
    },
  },
  {
    name: "help",
    description: "显示所有可执行的命令",
    fn: () => {
      addLogError("加载页面只能使用指定命令 'npm run start'");
      addLineBreak();
    },
  },
];

/**
 * 所有可执行的命令
 *
 * name 名称
 * description 描述
 * fn(value) 执行命令 value为命令的参数
 */
const commands = [
  {
    name: "app",
    description: `应用列表以及对应操作`,
    fn: ([command, childCommand, id]) => {
      if (!childCommand) {
        addLogOneByOne(
          APPList.map((item) => {
            return `${item.id} ${item.name}`;
          }).join("\n"),
          20,
          () => {
            addLineBreak();
            addLogOneByOne(
              "app open <id> 打开对应的应用\napp close <id> 关闭对应的应用\n"
            );
          }
        );
        return;
      }
      const isApp = APPList.find((item) => item.id === id);
      switch (childCommand) {
        case "open":
          if (!isApp) {
            addLogError(`${id}: 应用不存在`);
          } else {
            osStore.openApp(id);
          }
          break;
        case "close":
          if (!isApp) {
            addLogError(`${id}: 应用不存在`);
          } else {
            osStore.closeApp(id);
          }
          break;
        default:
          addLogError(`${childCommand}: 未知命令`);
          break;
      }
      addLineBreak();
    },
  },
  {
    name: "time",
    description: "输出当前时间",
    fn: () => {
      addLogOneByOne(new Date().toLocaleString());
      addLineBreak();
    },
  },
  {
    name: "help",
    description: "显示所有可执行的命令",
    fn: () => {
      const maxLength = commands.reduce(
        (max, item) => Math.max(max, item.name.length),
        0
      );
      // 拼接所有可执行的命令 name - description
      const formattedText = commands
        .map((item) => {
          const padding = " ".repeat(maxLength - item.name.length); // 计算需要的空格数
          return `${item.name}${padding} - ${item.description}`;
        })
        .join("\n");

      addLogOneByOne(formattedText);
      addLineBreak();
    },
  },
  {
    name: "clear",
    description: "清屏",
    fn: () => {
      historyLogBoxRef.value.innerHTML = "";
    },
  },
  {
    name: "exit",
    description: "退出终端",
    fn: () => {
      addLogOneByOne("拜拜 ~", 100, () => {
        osStore.closeApp(props.appInfo.id);
      });
    },
  },
];

const inputRef = ref(null);
const focusInput = () => {
  setTimeout(() => {
    if (!inputRef.value) return;
    inputRef.value.focus();
  }, 10);
};

const handleKeydown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};

const handleKeyup = (e) => {
  if (e.key === "Enter") {
    // 把文字按空格分割成数组
    let inputValueArray = e.target.innerText
      .trim()
      .replace(/\s+/g, " ")
      .split(" ");
    // console.log(inputValueArray);

    addLog(
      '<span class="text-green-400 mr-2">[ckjdygc ~]</span>' +
        e.target.innerText
    );

    if (inputValueArray.length === 0 || inputValueArray[0] === "") {
      addLineBreak();
      return;
    }

    // 匹配到的命令
    let command = null;
    if (isLoading.value) {
      command = loadingCommands.find(
        (item) => item.name === inputValueArray[0]
      );
    } else {
      command = commands.find((item) => item.name === inputValueArray[0]);
    }
    if (command) {
      command.fn(inputValueArray);
    } else {
      addLogError(
        inputValueArray[0] + ': 未知命令，请输入"help"查看可执行的命令'
      );
      addLineBreak();
    }

    e.target.innerText = "";
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Code English Font";
  src: url("../../../../assets/fonts/FiraCode-Regular.ttf") format("truetype");
  unicode-range: U+0020-007E; /* 适用于英文字符的Unicode范围 */
}

.app-sys-terminal-box {
  font-family: "Code English Font", "Noto Sans SC", "PingFang SC",
    "Microsoft YaHei", "黑体", sans-serif;

  @apply text-white text-opacity-80 text-xs
    w-full h-full p-2 overflow-y-scroll;
  backdrop-filter: $glass-bg-blur-dark;
}
.input-user-name {
  @apply text-green-400 font-bold mr-2 inline-block;
}

.input-content {
  @apply outline-none;
  caret-color: rgba(#4ade80, 1);
}
</style>
