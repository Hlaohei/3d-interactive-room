import { defineStore } from "pinia";

import APPList from "@/components/OS/APP";
// import { bingRandomUrl } from "@/api/third-party/wallpaper";

const bingRandomUrl = "https://bing.img.run/rand.php";

export const useHeiOsStore = defineStore("hei-os", {
  state: () => {
    return {
      name: "HEI-OS 桌面系统",
      startMenu: false,
      control: false,
      calendar: false,
      tasks: [],
      screenBrightness: 1, // 0-1
      wallpaper: {
        default: true,
        random: false,
        url: "",
        color: false,
        colorValue: "#ffffff",
      },
    };
  },
  getters: {},
  actions: {
    /**
     * 系统桌面组件相关操作
     */
    closeAll() {
      this.closeStartMenu();
      this.closeControl();
      this.closeCalendar();
    },
    openStartMenu() {
      this.startMenu = !this.startMenu;
      this.closeControl();
      this.closeCalendar();
    },
    closeStartMenu() {
      if (this.startMenu) this.startMenu = false;
    },
    openControl() {
      this.control = !this.control;
      this.closeStartMenu();
      this.closeCalendar();
    },
    closeControl() {
      if (this.control) this.control = false;
    },
    openCalendar() {
      this.calendar = !this.calendar;
      this.closeStartMenu();
      this.closeControl();
    },
    closeCalendar() {
      if (this.calendar) this.calendar = false;
    },
    /**
     * APP相关操作
     */
    openApp(id) {
      // 判断是否已经打开
      const index = this.tasks.findIndex((item) => item.id === id);
      // 如果没有打开
      if (index == -1) {
        // 打开
        const object = APPList.find((item) => item.id === id);
        let task = { ...object };
        task.min = false;
        task.date = new Date();
        task.lastDate = new Date();
        task.focus = true;

        this.tasks.push(task);
      }
      // 聚焦到APP并关闭开始菜单
      this.closeStartMenu();
      this.focusApp(id);
    },
    closeApp(id) {
      this.tasks = this.tasks.filter((item) => item.id !== id);
    },
    focusApp(id) {
      this.tasks.forEach((item) => {
        if (item.id === id) {
          item.focus = true;
          item.min = false;
          item.lastDate = new Date();
        } else {
          item.focus = false;
        }
      });
      this.closeStartMenu();
      this.closeControl();
      this.closeCalendar();
    },
    minOrShowApp(id) {
      const task = this.tasks.find((item) => item.id === id);
      if (task) {
        if (!task.min && task.focus) {
          task.min = true;
          task.focus = false;
        } else {
          task.min = false;
          this.focusApp(id);
        }
      }
    },
    sortAppByLastDate() {
      this.tasks.sort((a, b) => b.lastDate - a.lastDate);
    },
    /**
     * 壁纸相关操作
     */
    setWallpaperIsImage(url) {
      this.wallpaper.url = url;
      this.wallpaper.default = false;
      this.wallpaper.random = false;
      this.wallpaper.color = false;
    },
    setWallpaperIsRandom() {
      this.wallpaper.url = bingRandomUrl;
      this.wallpaper.default = false;
      this.wallpaper.color = false;
      this.wallpaper.random = true;
    },
    setWallpaperIsDefault() {
      this.wallpaper.url = "";
      this.wallpaper.default = true;
      this.wallpaper.random = false;
      this.wallpaper.color = false;
    },
    setWallpaperIsColor() {
      if (this.wallpaper.color) return;

      this.wallpaper.default = false;
      this.wallpaper.random = false;
      this.wallpaper.color = true;
    },
    setWallpaperColorValue(colorValue) {
      this.wallpaper.colorValue = colorValue;
    },
  },
  // 本地存储
  persist: {
    storage: localStorage,
  },
});
