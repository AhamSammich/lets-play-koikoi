<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

let currentIndex = ref(0);
let sectionArr: Element[];

function handleNext() {
  if (currentIndex.value < sectionArr.length - 1) {
    currentIndex.value++;
  }
  if (currentIndex.value === sectionArr.length - 1) {
  }
}

function handlePrev() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
  if (currentIndex.value === 0) {
  }
}

onMounted(() => (sectionArr = [...document.querySelectorAll("#how-to-play section")]));
</script>

<template>
  <article id="how-to-play" v-if="isOpen">
    <section :class="{ active: currentIndex === 0 }">
      <div>
        <h1>You've been dealt 8 cards...</h1>
        <p>Pick a card from your hand to match one of the cards on the table.</p>
        <p>If none of your cards match, pick one to add to the table.</p>
      </div>
      <img
        src="~/assets/gifs/lpk-how-to-play-a-card.gif"
        alt="GIF showing how to play a card"
      />
    </section>
    <section :class="{ active: currentIndex === 1 }">
      <div>
        <h1>Draw the top card off the deck...</h1>
        <p>Match the revealed card with a card on the table.</p>
        <p>Again, if there's no match, just add the card to the table.</p>
      </div>
      <img
        src="~/assets/gifs/lpk-how-to-finish-turn.gif"
        alt="GIF showing how to play a card"
      />
    </section>
    <section :class="{ active: currentIndex === 2 }">
      <div>
        <h1>Collect your cards...</h1>
        <p>Any matches you've made will be added to your collection.</p>
        <p>Your collected cards are visible on the bottom-right corner of the screen.</p>
      </div>
      <img
        src="~/assets/gifs/lpk-how-to-finish-turn.gif"
        alt="GIF showing how to play a card"
      />
    </section>
    <section :class="{ active: currentIndex === 3 }">
      <div>
        <h1>Complete a winning hand!</h1>
        <p>
          Your goal is to collect cards to complete a set, called a "yaku", and score
          points before your opponent.
        </p>
        <p>Check your progress toward possible yaku using the button below the menu.</p>
      </div>
      <img
        src="~/assets/gifs/lpk-how-to-check-progress.gif"
        alt="GIF showing how to play a card"
      />
    </section>
    <section :class="{ active: currentIndex === 4 }">
      <div>
        <h1>Go big or go home?</h1>
        <p>
          Upon completing a yaku, you'll be given the option to continue the round
          (calling "Koi Koi").
        </p>
        <p>
          This gives you the opportunity to score more points by improving your yaku or
          completing more.
        </p>
      </div>
      <img
        src="~/assets/gifs/lpk-how-to-call-koikoi.gif"
        alt="GIF showing how to play a card"
      />
    </section>
    <section :class="{ active: currentIndex === 5 }">
      <div>
        <h1>Be careful though...</h1>
        <p>Calling "Koi Koi" gives a bonus multiplier to ANY player that scores next.</p>
        <p>The player with the most points by the end of all rounds wins the game!</p>
      </div>
      <img
        src="~/assets/gifs/lpk-how-to-get-wrecked.gif"
        alt="GIF showing how to play a card"
      />
    </section>
    <section :class="{ active: currentIndex === 6 }">
      <div>
        <h1>Want to learn more?</h1>
        <p>
          Check out the
          <a
            href="https://fudawiki.org/en/hanafuda/games/koi-koi#gameplay"
            target="_blank"
            class="text-yellow-200"
            >Fuda Wiki <Icon name="mi:external-link" class="mb-1"
          /></a>
          to see other rules and scoring variations!
        </p>
      </div>
    </section>
    <footer
      class="flex justify-end gap-12 w-max absolute right-12 bottom-8 text-yellow-200"
    >
      <button :disabled="currentIndex === 0" @click="handlePrev()">
        <Icon name="mdi:arrow-left" />
      </button>
      <button :disabled="currentIndex === sectionArr?.length - 1" @click="handleNext()">
        <Icon name="mdi:arrow-right" />
      </button>
    </footer>
  </article>
</template>

<style scoped lang="postcss">
article {
  position: relative;
  width: 100%;
  min-width: 300px;
  height: 100vh;
  height: 100dvh;
  padding: 1rem;
  background: var(--menu-gray2);
  z-index: 60;
  overflow-y: scroll;
}

h1 {
  font-family: "Mochiy Pop One";
}

section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  overflow: hidden;

  & div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    z-index: 1;

    & p {
      padding: 0 1rem;
    }
  }

  &.active {
    opacity: 1;
  }
}

img {
  max-height: 100%;
  border-radius: 0.3rem;
  position: absolute;
  margin: 0 auto;
  bottom: -30px;
  mask-image: linear-gradient(180deg, transparent 25%, white, transparent 90%);
  z-index: 0;
  pointer-events: all;
}

img:hover {
  mask-image: linear-gradient(180deg, white);
}

.icon {
  font-size: x-large;
}

[disabled] {
  opacity: 0.1;
  pointer-events: none;
}

@media (orientation: landscape) {
  section {
    display: grid;
    grid-template-columns: 60% 1fr;
    padding: 2rem;
    padding-top: 1rem;
  }

  img {
    position: static;
    max-height: 80vh;
    mask-image: none;
  }

  footer {
    justify-content: center;
    align-items: flex-start;
    left: 25%;
    gap: 2rem;
    width: max-content;
  }
}
</style>
