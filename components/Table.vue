<script setup lang="ts">
import { Ref } from "vue";
import { matchCardInArr, removeSetFromArr } from "~~/assets/scripts/match";

const emits = defineEmits(["match-select", "collect", "next", "deck-draw"]);

const handOne: Ref<string[]> = ref([]);
const handTwo: Ref<string[]> = ref([]);
const field: Ref<string[]> = ref([]);
const match: Ref<string[]> = ref([]);
const draw: Ref<boolean> = ref(false);

const collection1: Ref<string[]> = ref([]);
const collection2: Ref<string[]> = ref([]);

let selectedCard: string;
let activeHand = handOne;

function dealFirstHands(cards: string[]): void {
  handOne.value.push(...cards.slice(0, 8));
  handTwo.value.push(...cards.slice(8, 16));
  field.value.push(...cards.slice(16));
}

function revealCard(cardName: string) {
  selectedCard = cardName;
  console.log(`Revealed ${selectedCard} from the deck.`);
  getMatch(cardName);
}

function checkForDraw() {
  selectedCard = "";
  draw.value = !draw.value;

  console.log(`${draw.value}`);
  if (draw.value === true) return;
  activeHand = activeHand === handOne ? handTwo : handOne;
  console.log(`It's Player${activeHand === handOne ? "1" : "2"}'s turn...`);
  if (activeHand === handTwo) aiFindMatch();
}

function aiFindMatch() {
  let aiCard = "";
  let matchedCards: string[] = [];
  for (let card of handTwo.value) {
    aiCard = card;
    matchedCards = matchCardInArr(card, field.value);
    if (matchedCards.length) {
      console.log(`%cPlayer 2 matched ${aiCard} with ${matchedCards}`, "color: yellow;");
      break;
    }
  }
  aiSelectMatch(aiCard, matchedCards);
}

function aiSelectMatch(cardName: string, matchedCards: string[]) {
  if (matchedCards.length === 0) {
    noMatch(cardName);
    return;
  }
  selectedCard = cardName;
  if (matchedCards.length === 3) {
    // Collect all 3 matched cards from the field
    handleMatch(matchedCards);
    return;
  }
  // Select the first of 2 matches
  handleMatch(matchedCards.slice(0, 1));
}

function getMatch(cardName: string): void {
  selectedCard = cardName;
  let matches = matchCardInArr(cardName, field.value);
  if (matches.length === 0) {
    noMatch(cardName);
    return;
  }
  console.log(`Matched ${selectedCard} with: ${matches.join(", ")}.`);
  // All 3 cards of the same suit are on the field
  if (matches.length === 3) {
    // Add all cards to collection
    handleMatch(matches);
  }
  // AI player has 2 possible matches from the deck draw
  if (draw.value && activeHand === handTwo) {
    // Select the first match
    handleMatch(matches.slice(0, 1));
    return;
  }
  // Open modal to allow player to choose between 2 matches
  showMatch(matches);
}

function noMatch(cardName: string) {
  // Remove selected card from hand and add to field
  let thrownCard = draw.value
    ? cardName
    : activeHand.value.splice(activeHand.value.indexOf(cardName), 1)[0];
  field.value.push(thrownCard);
  console.log(`${thrownCard} placed on the field.`);
  checkForDraw();
}

function showMatch(cards: string[]): void {
  if (cards.length === 1) {
    handleMatch(cards);
    return;
  }
  match.value.push(...cards);
}

async function handleMatch(cards: string[]) {
  // Clear matches and hide modal
  match.value.splice(0);
  let hand = draw.value ? field : activeHand;
  let matchedCards = new Set([selectedCard, ...cards]);

  [field.value, hand.value] = await Promise.all<Promise<string[]>[]>([
    // Remove matched card from field
    new Promise((resolve) => {
      setTimeout(() => resolve(removeSetFromArr(matchedCards, field.value)), 500);
    }),
    // Remove selected card from hand
    new Promise((resolve) => {
      setTimeout(() => resolve(removeSetFromArr(matchedCards, hand.value)), 500);
    }),
  ]);

  // emits("collect", matchedCards);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  activeHand === handOne
    ? (collection1.value = [...collection1.value, ...matchedCards])
    : (collection2.value = [...collection2.value, ...matchedCards]);
  checkForDraw();
}
</script>

<template>
  <div id="tabletop">
    <!-- TOP ROW -->
    <div id="p2-hand" class="flex-none justify-center items-center">
      <Hand
        :is-active="activeHand === handTwo"
        player="p2"
        :cards="handTwo"
        @check-match="(cardName: string) => getMatch(cardName)"
      />
    </div>
    <div id="p2-collection" class="collection">
      <Collection player="p2" :cards="collection2" />
    </div>

    <!-- CENTER ROW -->
    <div id="deck" class="flex justify-center items-center">
      <Deck
        :draw-card="draw"
        :ai-draw="activeHand === handTwo"
        @draw="(cardName: string) => revealCard(cardName)"
        @deal="(cards: string[]) => dealFirstHands(cards)"
      />
    </div>
    <div id="field">
      <Field :cards="field" />
    </div>

    <!-- BOTTOM ROW -->
    <div id="p1-hand" class="flex-none justify-center items-center w-full">
      <Hand
        :is-active="activeHand === handOne"
        player="p1"
        :cards="handOne"
        @check-match="(cardName: string) => getMatch(cardName)"
      />
    </div>
    <div id="p1-collection" class="collection">
      <Collection player="p1" :cards="collection1" />
    </div>

    <!-- MODAL -->
    <div id="match">
      <MatchSelect
        :cards="match"
        :show-modal="match.length > 0"
        @match-select="(cardArr: string[]) => handleMatch(cardArr)"
      />
    </div>
  </div>
</template>

<style lang="postcss">
#tabletop {
  width: 100dvw;
  height: 100dvh;
  background-color: rgb(22 101 52);
  overflow: hidden;
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: minmax(100px, 200px) 1fr minmax(100px, 200px);
  grid-template-areas:
    "p2 p2"
    "deck field"
    "p1 p1";

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

#deck {
  grid-area: deck;
}

#p1-hand {
  grid-area: p1;
  margin-left: 1rem;
  scale: 0.9;
}

#p2-hand {
  grid-area: p2;
  margin-left: 1rem;
  scale: 0.9;
  rotate: 180deg;
}

#field {
  grid-area: field;
  min-width: 320px;
}

.collection {
  position: absolute;
  margin: 1rem 0.5rem;
  pointer-events: none;

  &#p1-collection {
    right: 0;
    bottom: 1rem;
  }

  &#p2-collection {
    left: 0;
    top: 0;
  }
}

.hidden {
  display: none;
}
</style>
