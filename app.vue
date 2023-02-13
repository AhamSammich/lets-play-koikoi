<script setup lang="ts">
import { STORE } from "~~/components/composables/game";

const roundNum = ref(0);
const score1 = STORE.useScore1();
const score2 = STORE.useScore2();
const started = STORE.useStart();

function endGame() {
  started.value = false;
}

function resetGame() {
  roundNum.value = 0;
  score1.value = 0;
  score2.value = 0;
}
</script>

<template>
  <header class="flex fixed top-0 justify-start w-full h-max z-20">
    <button id="back-btn" class="p-2 font-black text-5xl text-white" @click="endGame()">
      &lAarr;
    </button>
  </header>
  <main>
    <div id="hero" :class="{ 'scroll-up': started }"></div>
    <Start />
    <template v-if="started">
      <Table @next-round="roundNum++" @reset="resetGame()" />
      <StatusBar :round-num="roundNum" :score="{ p1: score1, p2: score2 }" oya="p1" />
    </template>
  </main>
</template>

<style lang="postcss">
@import url("https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Potta+One&display=swap");

* {
  --tbl-black: rgb(14, 20, 34);
  --tbl-green: rgb(17, 75, 38);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
  font-family: "Mochiy Pop One", sans-serif;
}

#hero {
  width: 100vw;
  height: 100%;
  background: url(grey-hills.jpg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 0;
  position: fixed;
  top: 0;
  transition: all 2s;

  &.scroll-up {
    translate: 0 -60%;
  }
}

main {
  background-color: var(--tbl-black);
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0.2rem;
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, goldenrod, palegoldenrod);
  }
}

dialog {
  background: rgba(14, 20, 34, 0.9);
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: white;
  font-size: large;
  z-index: 10;
  transition: all 0.5s;

  & .btn-bar {
    width: 360px;
    display: flex;
    justify-content: space-around;
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
        box-shadow: 0 0.1rem 0.3rem 0 palegoldenrod;
      }
    }
  }

  & h1,
  & h2 {
    font-weight: bold;
    font-size: larger;
    text-transform: uppercase;
  }

  & h2 {
    font-size: inherit;
  }
}

.hidden {
  display: none;
  scale: 1 0;
}

.page-enter-active,
.page-leave-active {
  transition: all 1s;
  /* transform: translateY(0); */
}
.page-enter-from {
  opacity: 0;
  filter: blur(1rem);
  transform: translateY(100%);
}

.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
  transform: translateY(-100%);
}
</style>
