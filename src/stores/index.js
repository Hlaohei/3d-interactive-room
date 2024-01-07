import { createPinia } from "pinia";

//引入持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();

//将插件添加到 pinia 实例上
pinia.use(piniaPluginPersistedstate);

export default pinia;
