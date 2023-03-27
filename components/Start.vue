<script setup lang="ts">
import { useImage } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useDesignStore } from "~~/stores/designStore";
import { useGameStore } from "~~/stores/gameStore";

const designStore = useDesignStore();
const activeDesignName = computed(() => designStore.activeDesignName);

const gameStore = useGameStore();
const { gameIsRunning } = storeToRefs(gameStore);

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

// ready == true when all images loaded.
function countLoaded() {
  imagesLoading.value--;
}

async function startGame() {
  await preloadCards(activeDesignName.value);
  gameStore.startGame();
}

async function preloadCardImage(card: string, design: string) {
  try {
    return useImage({ src: `cards/${design}/webp/${card}.webp` });
  } catch (err) {
    console.warn(`Failed to load image from cards/${design}/webp/${card}.webp`, err);
  }
}

async function preloadCards(design: string): Promise<boolean> {
  try {
    let images = await Promise.all(
      CARDS.map((card) => {
        return preloadCardImage(card, design);
      })
    );

    while (true) {
      console.log(`Loading images from %c/cards/${design}...`, "color: skyblue;");
      if (images.every((img) => img?.isReady)) break;
      await sleep(100);
    }
    console.log("Loading complete!");
    return true;
  } catch (err) {
    console.error(
      `An error occurred while loading images from %c/cards/${design}...`,
      "color: skyblue;"
    );
    return false;
  }
}

onMounted(() => {
  watchEffect(async () => {
    if (gameIsRunning.value) preloadCards(activeDesignName.value);
  });
});
</script>

<template>
  <section
    id="start-page"
    :class="`${
      gameIsRunning ? '' : 'show'
    } ${activeDesignName} flex flex-col align-center justify-center gap-12`"
  >
    <!-- Show loader -->
    <div
      v-if="imagesLoading"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 card loading twirl -rotate-12 origin-center"
    ></div>

    <!-- Hide while loading and after pressing START -->
    <div
      id="hero-cards"
      :class="{
        'flex justify-center z-0 -rotate-12 md:m-8': true,
        'opacity-0': gameIsRunning || imagesLoading,
      }"
    >
      <StaticCard
        class="w-12 md:w-14"
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
      :class="{ 'text-center text-4xl sm:text-5xl opacity-0': true, ready }"
    >
      <span class="text-xl md:text-3xl text-right text-white block italic"
        >Let's Play!</span
      >花札 KOI-KOI
    </h1>
    <button
      :class="{
        'w-max mx-auto text-lg md:text-2xl text-white text-center font-bold opacity-0': true,
        ready,
      }"
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
  font-family: "Potta One", sans-serif;
  font-weight: 700;
  max-width: 500px;
  margin: 0 auto;
  z-index: 1;
}

button {
  outline: 1px solid gold;
  border-radius: 0.2rem;
  background: firebrick;
  padding: 0.5em 1em;
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
