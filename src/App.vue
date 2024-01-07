<template>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";

const nb = `%c
$$\\                     $$\\                 $$\\ 
$$ |                    $$ |                \\__|
$$ | $$$$$$\\   $$$$$$\\  $$$$$$$\\   $$$$$$\\  $$\\ 
$$ | \\____$$\\ $$  __$$\\ $$  __$$\\ $$  __$$\\ $$ |
$$ | $$$$$$$ |$$ /  $$ |$$ |  $$ |$$$$$$$$ |$$ |
$$ |$$  __$$ |$$ |  $$ |$$ |  $$ |$$   ____|$$ |
$$ |\\$$$$$$$ |\\$$$$$$  |$$ |  $$ |\\$$$$$$$\\ $$ |
\\__| \\_______| \\______/ \\__|  \\__| \\_______|\\__|
%c
   ckjdygc.cc   laohei.vip 
  创客界的一根葱 个人分享网站 \n
`;

console.log(nb, "color: #ff74de", "font-size: 20px");
</script>

<style lang="scss" scoped></style>
