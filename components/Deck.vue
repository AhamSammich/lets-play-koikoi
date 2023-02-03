<script setup lang="ts">
const props = defineProps<{
  drawCard: boolean;
  aiDraw?: boolean;
}>();
const emits = defineEmits(["deal", "draw"]);

let allCards = [
  "matsu-ni-tsuru",
  "matsu-no-tan",
  "matsu-no-kasu-1",
  "matsu-no-kasu-2",
  "ume-ni-uguisu",
  "ume-no-tan",
  "ume-no-kasu-1",
  "ume-no-kasu-2",
  "sakura-ni-maku",
  "sakura-no-tan",
  "sakura-no-kasu-1",
  "sakura-no-kasu-2",
  "ayame-ni-yatsuhashi",
  "ayame-no-tan",
  "ayame-no-kasu-1",
  "ayame-no-kasu-2",
  "hagi-ni-inoshishi",
  "hagi-no-tan",
  "hagi-no-kasu-1",
  "hagi-no-kasu-2",
  "botan-ni-chou",
  "botan-no-tan",
  "botan-no-kasu-1",
  "botan-no-kasu-2",
  "fuji-ni-kakku",
  "fuji-no-tan",
  "fuji-no-kasu-1",
  "fuji-no-kasu-2",
  "susuki-ni-tsuki",
  "susuki-ni-kari",
  "susuki-no-kasu-1",
  "susuki-no-kasu-2",
  "kiku-ni-sakazuki",
  "kiku-no-tan",
  "kiku-no-kasu-1",
  "kiku-no-kasu-2",
  "momiji-ni-shika",
  "momiji-no-tan",
  "momiji-no-kasu-1",
  "momiji-no-kasu-2",
  "yanagi-ni-ono-no-toufuu",
  "yanagi-ni-tsubame",
  "yanagi-no-kasu-1",
  "yanagi-no-kasu-2",
  "kiri-ni-ho-oh",
  "kiri-no-kasu-1",
  "kiri-no-kasu-2",
  "kiri-no-kasu-3",
];

let remainingCards: string[];

function draw(): string {
  let drawnCard = remainingCards.shift();
  console.log(`%cCards remaining: ${remainingCards.length}`, "color: red;");
  return drawnCard || "";
}

function dealHands(): string[] {
  let dealtCards = remainingCards.splice(0, 24);
  return dealtCards;
}

function shuffle(cards: string[]): string[] {
  let numberOfCards = () => cards.length;
  let shuffledDeck = [];

  for (let n = 0; numberOfCards() > 0; n++) {
    let index = Math.floor(Math.random() * (numberOfCards() - 1));
    let randomCard = cards.splice(index, 1);
    if (randomCard[0]) shuffledDeck.push(randomCard[0]);
  }

  return shuffledDeck;
}

onBeforeMount(() => {
  remainingCards = shuffle(allCards);
});

onMounted(() => {
  emits("deal", dealHands());
});

onUpdated(async () => {
  if (props.aiDraw === true && props.drawCard === true) {
    emits("draw", draw());
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
});
</script>

<template>
  <div
    class="bg-red-600"
    @click="$emit('draw', draw())"
    :data-text="drawCard ? aiDraw ? 'Drawing card...' : 'Draw a card!' : ''"
    :style="`${aiDraw || !drawCard ? 'pointer-events: none;' : ''}`"
  ></div>
</template>

<style scoped lang="postcss">
div {
  width: 75px;
  height: 113px;
  cursor: grab;
  outline: 1px solid #111;
  border-radius: 0.2rem;
  position: relative;

  &::after {
    content: attr(data-text);
    color: #eee;
    font-weight: bold;
    margin-top: 5rem;
    display: block;
    white-space: nowrap;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 3;
  }
}
</style>
