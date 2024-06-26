<script setup lang="ts">
import { useDesignStore } from "~~/stores/designStore";
import { useGameStore } from "~~/stores/gameStore";

useServerSeoMeta({
  title: "Let's Play Koi-Koi!",
  ogTitle: "Let's Play Koi-Koi!",
  description: "Play Hanafuda Koi-Koi against an AI opponent!",
  ogDescription: "Play Hanafuda Koi-Koi against an AI opponent!",
  ogImage: "https://assets.codepen.io/8543383/Screenshot_20230221_204527_Chrome.jpg",
  twitterCard: "summary_large_image",
});

const activeDesignName = toRef(useDesignStore(), "activeDesignName");
const gameStore = useGameStore();
const gameIsRunning = computed(() => gameStore.gameIsRunning);

const roundNum = STORE.useRoundNum();
const score1: Ref<number> = STORE.useScore1();
const score2: Ref<number> = STORE.useScore2();
const oya = STORE.useCurrentOya();
const showProgress = ref(false);

let roundHistory = new Map();
const maxRounds = RULES.useMaxRounds();
const finalScores: Ref<Record<string, number>> = ref({});

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
  gameStore.endGame();
  Object.keys(saveData).forEach((key) => localStorage.removeItem(key));
}

function clearHistory() {
  finalScores.value = {};
  roundHistory.clear();
  localStorage.removeItem("lpk-history");
}

function resetGame() {
  roundNum.value = 0;
  score1.value = 0;
  score2.value = 0;
  oya.value = 1;
}

function recordRound(results: Results) {
  if (!roundNum.value) return;
  roundHistory.set(roundNum.value, results);
  localStorage.setItem("lpk-history", JSON.stringify(roundHistory, mapReplacer));
}

async function handleNext(results: Results) {
  recordRound(results);
  await saveLocalData();
  if (roundNum.value >= maxRounds.value) {
    let [p1, p2] = [score1.value, score2.value];
    finalScores.value = { p1, p2 };
    console.dir(JSON.parse(JSON.stringify(roundHistory, mapReplacer), mapReviver));
    endGame();
  } else roundNum.value++;
}

onMounted(async () => {
  await loadLocalData();
  if (/localhost/ig.test(window.location.hostname)) {
    useSeoMeta({
      title: `<${window.location.port}> Let's Play Koi-Koi!`
    })
  }
});
</script>

<template>
  <header class="flex fixed top-0 justify-start w-max h-max z-20">
    <MenuButton
      ico-name="material-symbols:arrow-back"
      :class="`${gameIsRunning ? '' : 'hidden'} m-4 opacity-50`"
      close-only
      @close-menu="endGame()"
    />
  </header>

  <main :class="activeDesignName">
    <template v-if="gameIsRunning">
      <div
        id="progress-btn"
        :class="`z-40 fixed top-16 right-4 ${
          showProgress ? 'opacity-100' : 'opacity-50'
        }`"
      >
        <MenuButton
          ico-name="mdi:cards"
          @open-menu="showProgress = true"
          @close-menu="showProgress = false"
          class="text-white"
        />
      </div>
      <dialog v-show="showProgress" id="current-progress" class="z-30">
        <YakuProgress @close-progress="showProgress = false" />
      </dialog>
    </template>

    <img
      id="hero"
      preload
      src="/bg/webp/grey-hills-1920.webp"
      sizes="sm:480px md:100vw"
      alt="Background image of the moon over silver grass."
      loading="eager"
      :class="{ 'scroll-up': gameIsRunning }"
    />
    <Start />
    <template v-if="gameIsRunning">
      <Table @next-round="(results) => handleNext(results)" @reset="resetGame()" />
      <StatusBar
        :round-num="roundNum"
        :score="{ p1: score1, p2: score2 }"
        :oya="`p${oya}`"
      />
    </template>
    <template v-if="Object.keys(finalScores).length">
      <div class="w-8 h-8 absolute top-4 left-4 z-50">
        <MenuButton
          ico-name="material-symbols:arrow-back"
          close-only
          @close-menu="clearHistory()"
        />
      </div>
      <Results
        :scoreboard="finalScores"
        :show-modal="!!Object.keys(finalScores).length"
        :results-map="roundHistory"
      />
    </template>
  </main>
</template>

<style lang="postcss">
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

</style>
