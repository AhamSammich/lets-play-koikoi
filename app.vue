<script setup lang="ts">
import { Ref } from "vue";
import { useSeoMeta } from "@vueuse/head";

useSeoMeta({
  // @ts-ignore
  title: "Let's Play Koi-Koi!",
  ogTitle: "Let's Play Koi-Koi!",
  description: "Play Hanafuda Koi-Koi against an AI opponent!",
  ogDescription: "Play Hanafuda Koi-Koi against an AI opponent!",
  ogImage: "~/assets/images/lp-koikoi-title.jpg",
  twitterCard: "summary_large_image",
});

const roundNum = STORE.useRoundNum();
const score1 = STORE.useScore1();
const score2 = STORE.useScore2();
const started = STORE.useStart();
const oya = STORE.useCurrentOya();
const showProgress = ref(false);

let roundHistory = new Map();
const maxRounds = RULES.useMaxRounds();

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
        (key) =>
          (saveData[key].value = Number(
            localStorage.getItem(key) || (key.endsWith("oya") ? "1" : "0")
          ))
      );
      let loadedMap = JSON.parse(
        <string>localStorage?.getItem("lpk-history"),
        mapReviver
      );
      if (loadedMap instanceof Map) roundHistory = loadedMap;
      else console.warn("Failed to load round history.");
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
  roundHistory.clear();
}

function resetGame() {
  roundNum.value = 0;
  score1.value = 0;
  score2.value = 0;
  oya.value = 1;
}

function recordRound() {
  if (!roundNum.value) return;
  roundHistory.set(roundNum.value, {
    round: roundNum.value,
    p1: score1.value,
    p2: score2.value,
    oya: `P${oya.value}`,
  });
  localStorage.setItem("lpk-history", JSON.stringify(roundHistory, mapReplacer));
}

async function handleNext() {
  recordRound();
  await saveLocalData();
  if (roundNum.value >= maxRounds.value) {
    console.dir(JSON.parse(JSON.stringify(roundHistory, mapReplacer), mapReviver));
    endGame();
  } else roundNum.value++;
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

  <Menu />

  <div
    v-if="started"
    id="progress-btn"
    :class="`z-40 absolute top-16 right-4 ${showProgress ? 'opacity-100' : 'opacity-50'}`"
  >
    <MenuButton
      ico-name="mdi:cards"
      @open-menu="showProgress = true"
      @close-menu="showProgress = false"
    />
  </div>
  <dialog v-if="showProgress && started" id="current-progress" class="z-30">
    <YakuProgress @close-progress="showProgress = false" />
  </dialog>

  <main>
    <img
      id="hero"
      src="~/assets/images/grey-hills.jpg"
      loading="lazy"
      :class="{ 'scroll-up': started }"
    />
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
@import url("https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Potta+One&display=swap");

* {
  --tbl-black: rgb(14, 20, 34);
  --gradient-gold: linear-gradient(15deg, lightgoldenrodyellow, gold, palegoldenrod);
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
  overflow: hidden;
  width: 100vw;
  font-family: "Mochiy Pop One", sans-serif;
  user-select: none;
}

#back-btn {
  font-family: "Potta One";

  &:hover {
    translate: -5% 0;
    opacity: 1;
  }
}

#current-progress {
  position: absolute;
  animation: fadeIn 0.3s;
}

#hero {
  min-width: 100%;
  z-index: 0;
  position: absolute;
  top: 0;
  animation: fadeIn 2s;
  transition: translate 2s;

  @media (orientation: landscape) {
    top: -100px;
  }

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
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
    font-family: "Potta One";
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
