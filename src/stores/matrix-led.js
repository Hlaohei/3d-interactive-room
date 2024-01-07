import { defineStore } from "pinia";

export const useMatrixLedStore = defineStore("matrix-led", {
  state: () => {
    return {
      name: "矩阵LED APP",
      ledData: [],
      modes: {
        // mode: "粉丝", // ["基础", "时钟", "粉丝"]
        mode: "fans", // default | clock | fans
      },
      scrollMode: 0, // -1:往左 0:不滚 1:往右
      colorStrength: 1, // 颜色强度 0-1
      fansNum: 666,
    };
  },
  getters: {},
  actions: {
    setLedData(data) {
      this.ledData = data;
    },
    /**
     * 设置 滚动模式
     * @param {*} mode -1:往左 0:不滚 1:往右
     */
    setScrollMode(mode) {
      this.scrollMode = mode;
    },
    setModeIsDefault() {
      this.modes.mode = "default";
    },
    setModeIsClock() {
      this.modes.mode = "clock";
    },
    setModeIsFans() {
      this.modes.mode = "fans";
    },
    setFansNum(num) {
      this.fansNum = num;
    },
  },
  // 本地存储
  persist: {
    storage: localStorage,
  },
});
