import { defineStore } from "pinia";

export const useLightControlStore = defineStore("light-control", {
  state: () => {
    return {
      name: "灯光控制 APP",
      roomLightIntensity: 0, // 0-1 0:关闭 1:最亮
      deskLightIntensity: 1, // 0-1 0:关闭 1:最亮
      deskLightColor: "#ff74de",
    };
  },
  getters: {},
  actions: {
    setRoomLightIntensity(intensity) {
      this.roomLightIntensity = Math.max(0, Math.min(1, intensity));
    },
    setDeskLightIntensity(intensity) {
      this.deskLightIntensity = Math.max(0, Math.min(1, intensity));
    },
    setDeskLightColor(color) {
      this.deskLightColor = color;
    },
  },
  // 本地存储
  persist: {
    storage: localStorage,
  },
});
