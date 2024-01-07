import "./assets/css/index.scss";
import "./assets/css/tailwind.scss";

import { createApp } from "vue";

import pinia from "./stores/index";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
