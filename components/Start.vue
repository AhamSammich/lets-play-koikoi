<script setup lang="ts">
import { STORE } from "~~/components/composables/game";

const started = STORE.useStart();

function startGame() {
  started.value = true;
}
</script>

<template>
  <section
    id="start-page"
    :class="`${started ? '' : 'show'} flex flex-col gap-8 align-center justify-center`"
  >
    <h1 id="hero-title" class="text-center"><span>Let's Play!</span> KOI-KOI</h1>
    <button id="start-btn" @click="startGame()">START</button>
  </section>
</template>

<style scoped lang="postcss">
section {
  overflow: hidden;
  transform-origin: bottom;
  height: 0;
  opacity: 0;
  transition: all 1s;

  &.show {
    height: 100dvh;
    height: 100vh;
    opacity: 1;
  }

  &.show #hero-title {
    transition: all 0.5s;

    opacity: 1;
  }
}

#hero-title {
  font-size: xx-large;
  background: var(--gradient-gold);
  background-clip: text;
  color: transparent;
  font-family: "Potta One", "Mochiy Pop One", sans-serif;
  font-size: 56px;
  max-width: 500px;
  margin: 0 auto;
  z-index: 1;
  opacity: 0;

  & span {
    text-align: left;
    display: block;
    font-size: 20px;
    color: #111;
    font-style: italic;
    text-shadow: 0 0 0.1rem palegoldenrod;
  }
}

button {
  outline: 1px solid yellow;
  border-radius: 0.2rem;
  background: firebrick;
  padding: 0.5em 1em;
  font-weight: bold;
  font-size: smaller;
  width: 300px;
  margin: 0 auto;
  color: #eee;
  text-align: center;
  z-index: 1;

  &:hover,
  &:focus {
    transform: translate3d(0, 5%, 0);
    box-shadow: 0 0.1rem 0.3rem 0 palegoldenrod;
  }
}
</style>
