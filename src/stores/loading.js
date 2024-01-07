import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => {
    return {
      name: "加载页面",
      start: false,
      loadingProgress: {},
    };
  },
  getters: {},
  actions: {},
});
