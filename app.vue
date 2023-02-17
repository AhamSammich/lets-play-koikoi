<script setup lang="ts">
import { Ref } from "vue";
import { STORE } from "~~/components/composables/state";

const roundNum = ref(0);
const score1 = STORE.useScore1();
const score2 = STORE.useScore2();
const started = STORE.useStart();
const oya = STORE.useCurrentOya();

const saveData: Record<string, Ref<number>> = {
  "lpk-round-num": roundNum,
  "lpk-p1-score": score1,
  "lpk-p2-score": score2,
  "lpk-oya": oya,
};

async function loadLocalData() {
  return new Promise((resolve, reject) => {
    if (!localStorage) reject(console.warn("No stored data found."));
    try {
      Object.keys(saveData).forEach(
        (key) => (saveData[key].value = Number(localStorage.getItem(key) || (key.endsWith("oya") ? "1" : "0")))
      );
      resolve(console.info("Data loaded successfully."));
    } catch (err) {
      reject(console.error(`Failed to load stored data. ${err}`));
    }
  });
}

async function saveLocalData() {
  return new Promise((resolve, reject) => {
    if (!localStorage) reject(console.warn("No local storage found."));
    try {
      Object.keys(saveData).forEach((key) =>
        localStorage.setItem(key, `${saveData[key].value}`)
      );
      resolve(console.info("Data saved successfully."));
    } catch (err) {
      reject(console.error(`Failed to save data. ${err}`));
    }
  });
}

function endGame() {
  started.value = false;
  localStorage.clear();
}

function resetGame() {
  roundNum.value = 0;
  score1.value = 0;
  score2.value = 0;
  oya.value = 1;
}

async function handleNext() {
  await saveLocalData();
  roundNum.value++;
}

onMounted(async () => {
  await loadLocalData();
});
</script>

<template>
  <header class="flex fixed top-0 justify-start w-max h-max z-20">
    <button
      id="back-btn"
      :class="`${
        started ? '' : 'hidden'
      } px-4 py-1 opacity-25 font-black text-3xl text-white transition-all duration-500`"
      @click="endGame()"
    >
      &larr;
    </button>
  </header>
  <main>
    <div id="hero" :class="{ 'scroll-up': started }"></div>
    <Start />
    <template v-if="started">
      <Table @next-round="handleNext()" @reset="resetGame()" />
      <StatusBar
        :round-num="roundNum"
        :score="{ p1: score1, p2: score2 }"
        :oya="`p${oya}`"
      />
    </template>
  </main>
</template>

<style lang="postcss">
@import url("https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Potta+One&display=swap");

* {
  --tbl-black: rgb(14, 20, 34);
  --tbl-green: rgb(17, 75, 38);
  --gradient-gold: linear-gradient(15deg, goldenrod, palegoldenrod);
  --tbl-w-max: 1000px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
  font-family: "Mochiy Pop One", sans-serif;
  user-select: none;
  margin: 0 auto;
}

#back-btn {
  font-family: "Potta One";

  &:hover {
    translate: -5% 0;
    opacity: 1;
  }
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
  animation: fadeIn 2s;
  transition: all 2s;

  &.scroll-up {
    translate: 0 -60%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
    background: var(--gradient-gold);
  }
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
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: white;
  font-size: large;
  z-index: 30;
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
