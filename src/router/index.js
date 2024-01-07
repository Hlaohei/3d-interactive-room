import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

import IndexPage from "../views/index/index.vue";
import HeiOsPage from "../views/hei-os/index.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: IndexPage,
    },
    {
      path: "/hei-os",
      name: "hei-os",
      component: HeiOsPage,
    },
  ],
});

export default router;
