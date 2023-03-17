<script setup lang="ts">
import { useDesignStore } from "../stores/designStore";

const props = defineProps<{
  drawCard: boolean | null;
}>();
const emits = defineEmits(["deal", "draw"]);

// Get applied styles/images
const designStore = useDesignStore();
const activeDesign = computed(() => designStore.activeDesign);
let remainingCards: string[];
let progressBar: HTMLElement;

function updateProgress(numberLeft: number) {
  let percent = Math.floor((numberLeft / 48) * 100);
  progressBar?.style.setProperty("transform", `scaleY(${percent}%)`);
}

function draw(): string {
  let drawnCard = remainingCards.shift();
  updateProgress(remainingCards.length);
  console.log(`%cCards remaining: ${remainingCards.length}`, "color: red;");
  return drawnCard || "";
}

function dealHands(): string[] {
  let dealtCards = remainingCards.splice(0, 24);
  updateProgress(remainingCards.length);
  return dealtCards;
}

async function shuffle(cards: string[]): Promise<string[]> {
  let numberOfCards = () => cards.length;
  let shuffledDeck = [];

  for (let n = 0; numberOfCards() > 0; n++) {
    let index = Math.floor(Math.random() * (numberOfCards() - 1));
    let randomCard = cards.splice(index, 1);
    if (randomCard[0]) shuffledDeck.push(randomCard[0]);
  }

  return shuffledDeck;
}

onMounted(async () => {
  progressBar = <HTMLElement>document.getElementById("deck-progress");
});

onUpdated(async () => {
  if (props.drawCard == null) {
    remainingCards = await shuffle([...CARDS]);
    emits("deal", dealHands());
  }
  if (props.drawCard === true) {
    emits("draw", draw());
    await sleep();
  }
});
</script>

<template>
  <div id="deck-progress"></div>
  <!-- Set image for card back if provided in designStore. -->
  <nuxt-img
    v-if="designStore.hasBackImage"
    class="card"
    :src="`cards/${activeDesign}/webp/card-back.webp`"
    alt="deck of cards"
  />
  <div v-else class="ml-1 card down"></div>
</template>

<style scoped lang="postcss">
#deck-progress {
  float: right;
  margin-left: 0.2rem;
  width: 0.2rem;
  height: 100px;
  background: linear-gradient(45deg, goldenrod, palegoldenrod);
  outline: 0.5px solid #111;
  transform-origin: center;
  transition: transform 0.5s;
  border-radius: 0.2rem;
}
</style>
