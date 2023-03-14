<script setup lang="ts">
import { useSeoMeta } from "@vueuse/head";

useSeoMeta({
  ogImage: "https://assets.codepen.io/8543383/Screenshot_20230221_204527_Chrome.jpg",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <Menu />
  <NuxtPage />
</template>

<style lang="postcss">
:root {
  --tbl-black: rgb(14, 20, 34);
  --gradient-gold: linear-gradient(15deg, lightgoldenrodyellow, gold, palegoldenrod);
}

@font-face {
  font-family: "Mochiy Pop One";
  src: url("fonts/MochiyPopOne-Regular.woff2") format("woff2"),
    url("fonts/MochiyPopOne-Regular.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Potta One";
  src: url("fonts/PottaOne-Regular.woff2") format("woff2"),
    url("fonts/PottaOneOne-Regular.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

* {
  --tbl-w-max: 1000px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  &::-webkit-scrollbar {
    width: 0.2rem;
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gradient-gold);
  }
}

body {
  background-color: var(--tbl-black);
  overflow-x: hidden;
  /* overflow-y: hidden; */
  width: 100vw;
  font-family: "Mochiy Pop One", sans-serif;
  user-select: none;
}

dialog {
  background: rgba(14, 20, 34, 0.95);
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: white;
  font-size: large;
  z-index: 25;
  transition: all 0.1s;

  & .btn-bar {
    margin-top: 0.5rem;
    width: 100%;
    display: flex;
    gap: 2rem;
    justify-content: center;
    pointer-events: all;

    & button {
      outline: 1px solid yellow;
      border-radius: 0.2rem;
      background: firebrick;
      padding: 0.5em 1em;
      font-weight: bold;
      font-size: smaller;

      &:hover,
      &:focus {
        transform: translate3d(0, 5%, 0);
        box-shadow: 0 0.1rem 0.3rem 0 lightgoldenrodyellow;
      }
    }
  }

  & h1,
  & h2 {
    font-weight: bold;
    font-size: larger;
    text-transform: uppercase;
  }

  & h1 {
    font-family: "Potta One", cursive;
    letter-spacing: 0.05em;
  }

  & h2 {
    font-size: inherit;
  }
}

.hidden {
  display: none;
  scale: 1 0;
}
</style>
