<script setup lang="ts">
import { useImage } from "@vueuse/core";
import { useDesignStore } from "~~/stores/designStore";
import { useGameStore } from "~~/stores/gameStore";

const designStore = useDesignStore();
const activeDesignName = computed(() => designStore.activeDesignName);

const gameStore = useGameStore();
const gameIsRunning = computed(() => gameStore.gameInProgress);

// Get 5 random cards from the deck to display.
async function randomCards() {
  let randomArr: string[] = [];
  for (let i = 0; i < 5; i++) {
    let randomCard = pickCardFromArr(CARDS);
    randomArr.includes(randomCard) ? i-- : randomArr.push(randomCard);
  }
  return randomArr;
}

const cards = await randomCards();
const imagesLoading = ref(cards.length);
const ready = computed(() => !imagesLoading.value);
const loadingComplete = ref(false);

// ready == true when all images loaded.
function countLoaded() {
  imagesLoading.value--;
}

function startGame() {
  gameStore.startGame();
}

watchEffect(async () => {
  if (ready.value) {
    let remainingImages = CARDS.filter((card) => !cards.includes(card)).map((card) => {
      return useImage({ src: `cards/${activeDesignName.value}/webp/${card}.webp` });
    });

    while (true) {
      console.log("Loading images...");
      if (remainingImages.every((img) => img.isReady)) break;
    }

    loadingComplete.value = true;
  }
});
</script>

<template>
  <section
    id="start-page"
    :class="`${
      gameIsRunning ? '' : 'show'
    } ${activeDesignName} flex flex-col align-center justify-center gap-8`"
  >
    <!-- Show loader -->
    <div v-if="imagesLoading" class="card loading rotate-12"></div>

    <!-- Hide while loading and after pressing START -->
    <div
      id="hero-cards"
      :class="{
        'flex justify-center z-0 -rotate-12': true,
        'opacity-0': gameIsRunning || imagesLoading,
      }"
    >
      <StaticCard
        v-for="cardName in cards"
        :key="cardName"
        :name="cardName"
        loading="eager"
        @img-loaded="countLoaded"
      />
    </div>

    <h1
      v-show="imagesLoading < cards.length"
      id="hero-title"
      :class="{ 'text-center opacity-0': true, ready }"
    >
      <span>Let's Play!</span>花札 KOI-KOI
    </h1>
    <button
      :class="{ 'opacity-0': true, ready: loadingComplete }"
      id="start-btn"
      @click="startGame()"
      autofocus
      tabindex="0"
    >
      START
    </button>

    <!-- Footer -->
    <p
      class="text-white text-xs font-mono text-center fixed bottom-0 w-screen mb-2 opacity-50"
    >
      {{ new Date().getFullYear() }} | Andre L. Hammons
    </p>
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
    height: 100vh;
    height: 100dvh;
    opacity: 1;
    animation: fadeIn 3s;
  }

  &.show #hero-title {
    transition: opacity 1s;

    &.ready {
      translate: 0 0;
      opacity: 1;
    }
  }

  &.show #hero-cards > * {
    opacity: 1;
  }
}

#hero-cards {
  --card-width: 50px;
  & * {
    transform-origin: bottom;
  }

  & > *:nth-child(1) {
    rotate: -30deg;
    translate: 20px 20px;
  }

  & > *:nth-child(2) {
    rotate: -15deg;
    translate: 10px 5px;
  }

  & > *:nth-child(3) {
    rotate: 0deg;
  }

  & > *:nth-child(4) {
    rotate: 15deg;
    translate: -10px 5px;
  }

  & > *:nth-child(5) {
    rotate: 30deg;
    translate: -20px 20px;
  }
}

#hero-title {
  background: var(--gradient-gold);
  background-clip: text;
  color: transparent;
  font-family: "Potta One", cursive;
  font-weight: 700;
  font-size: 48px;
  max-width: 500px;
  margin: 0 auto;
  z-index: 1;

  & span {
    text-align: right;
    display: block;
    font-size: 20px;
    color: white;
    font-style: italic;
  }
}

button {
  outline: 1px solid gold;
  border-radius: 0.2rem;
  background: firebrick;
  padding: 0.5em 1em;
  font-weight: bold;
  width: 120px;
  height: 50px;
  margin: 0 auto;
  color: #eee;
  text-align: center;
  z-index: 1;

  &:is(#start-btn.ready) {
    transition: opacity 1s;
    opacity: 1;
  }

  &:hover,
  &:focus-visible {
    transform: translate3d(0, 5%, 0);
    box-shadow: 0 0 0 0.5rem var(--tbl-black), 0 0 0 0.55rem gold;
  }
}

@media (orientation: landscape) {
  section {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 3rem;
  }

  button,
  #hero-title {
    margin: unset;
  }

  #hero-cards {
    display: flex;
    flex-direction: column;
    justify-content: flex-evenly;
    align-items: flex-start;
    rotate: -45deg;
    gap: 0;

    & > * {
      transform-origin: center;
      opacity: 0;

      &:nth-child(1) {
        rotate: 50deg;
        translate: 25px 230%;
      }

      &:nth-child(2) {
        rotate: 15deg;
        translate: -20px 90%;
      }

      &:nth-child(3) {
        rotate: 10deg;
        translate: -50px 90%;
      }

      &:nth-child(4) {
        rotate: 45deg;
        translate: -5px 20%;
      }

      &:nth-child(5) {
        rotate: 25deg;
        translate: -10px -155%;
      }
    }
  }
}
</style>
