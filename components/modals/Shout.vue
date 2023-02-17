<script setup lang="ts">
// @ts-ignore
import coin from "../assets/images/coin.png";
defineProps<{
  msg: string;
}>();
</script>

<template>
  <div id="shout">
    <img :src="coin" alt="" />
    <h1>{{ msg.toUpperCase() }}</h1>
  </div>
</template>

<style scoped lang="postcss">
#shout {
  font-size: 72px;
  font-family: "Potta One";
  letter-spacing: 0.2em;
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  animation: stamp 0.3s ease-in;
  white-space: nowrap;
  background: rgba(14, 20, 34, 0.5);
  height: 100vh;
  height: 100dvh;
  width: 100vw;

  & h1 {
    color: #eee;
    z-index: 20;
    text-shadow: 0 0 0.3em var(--tbl-black);
    margin: 0 auto;
  }
}

img {
  width: 100px;
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -60% -50%;
  z-index: 15;
}

@keyframes stamp {
  from {
    opacity: 0;
    scale: 2;
  }
  75% {
    scale: 1.75;
    opacity: 0.25;
  }
  to {
    opacity: 1;
    scale: 1;
    rotate: 360deg;
  }
}
</style>
