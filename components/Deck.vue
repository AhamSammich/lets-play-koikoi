<script setup lang="ts">
const props = defineProps<{
  drawCard: boolean | null;
}>();
const emits = defineEmits(["deal", "draw"]);

const allCards = [
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
  "yanagi-no-tan",
  "yanagi-no-kasu",
  "kiri-ni-ho-oh",
  "kiri-no-kasu-1",
  "kiri-no-kasu-2",
  "kiri-no-kasu-3",
];

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
  // remainingCards = await shuffle([...allCards]);
  // emits("deal", dealHands());
});

onUpdated(async () => {
  if (props.drawCard == null) {
    remainingCards = await shuffle([...allCards]);
    emits("deal", dealHands());
  }
  if (props.drawCard === true) {
    emits("draw", draw());
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
});
</script>

<template>
  <div id="deck-progress"></div>
  <div class="deck bg-red-600"></div>
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

.deck {
  width: 75px;
  aspect-ratio: 2 / 3;
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
  }
}
</style>
