<script setup lang="ts">
import { Ref } from "vue";
import { matchCardInSet, removeCardFromSet } from "~~/assets/scripts/match";

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
  // TODO: Ensure hand does not exceed 8
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
  console.log(`${draw.value ? "Drawing from deck..." : "Next player..."}`);
  if (draw.value === true) return;

  // emits("next");
  activeHand = activeHand === handOne ? handTwo : handOne;
  console.log(`It's Player${activeHand === handOne ? "1" : "2"}'s turn...`);
  if (activeHand === handTwo) aiFindMatch();
}

function aiFindMatch() {
  let aiCard = "";
  let matchedCard = "";
  for (let card of handTwo.value) {
    aiCard = card;
    let matches = matchCardInSet(card, field.value);
    if (matches.length) {
      let index = Math.floor(Math.random() * matches.length);
      matchedCard = matches[index];
      console.log(`%cPlayer 2 matched ${aiCard} with ${matchedCard}`, "color: yellow;");
      break;
    }
  }
  aiSelectMatch(aiCard, matchedCard);
}

function aiSelectMatch(cardName: string, cardMatch: string) {
  if (!cardMatch) {
    noMatch(cardName);
    return;
  }
  selectedCard = cardName;
  handleMatch(cardMatch);
}

function getMatch(cardName: string): void {
  selectedCard = cardName;
  let matches = matchCardInSet(cardName, field.value);
  if (matches.length === 0) {
    noMatch(cardName);
    return;
  }
  console.log(`Matched ${selectedCard} with: ${matches.join(", ")}.`);
  if (draw.value && activeHand === handTwo) {
    handleMatch(matches[0]);
    return;
  }
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
    handleMatch(cards[0]);
    return;
  }
  match.value.push(...cards);
}

async function handleMatch(cardName: string) {
  // Clear matches and hide modal
  match.value.splice(0);
  let hand = draw.value ? field : activeHand;
  let matchedCards = new Set([selectedCard, cardName]);

  // Remove matched card from field
  field.value = await new Promise((resolve) => {
    setTimeout(
      () => resolve(field.value.filter((card) => !matchedCards.has(card))),
      500
    );
  });
  // Remove selected card from hand
  hand.value = await new Promise((resolve) => {
    setTimeout(() => resolve(hand.value.filter((card) => !matchedCards.has(card))), 500);
  });

  // emits("collect", matchedCards);
  // await new Promise(resolve => setTimeout(resolve, 1000));
  activeHand === handOne
    ? (collection1.value = [...collection1.value, ...matchedCards])
    : (collection2.value = [...collection2.value, ...matchedCards]);
  checkForDraw();
}
</script>

<template>
  <div id="tabletop">
    <div id="deck" class="flex justify-center items-center">
      <Deck
        :draw-card="draw"
        :ai-draw="activeHand === handTwo"
        @draw="(cardName: string) => revealCard(cardName)"
        @deal="(cards: string[]) => dealFirstHands(cards)"
      />
    </div>

    <div id="field">
      <Hand :isActive="false" player="" :cards="field" />
    </div>
    <div id="match">
      <MatchSelect
        :cards="match"
        :show-modal="match.length > 0"
        @match-select="(cardName) => handleMatch(cardName)"
      />
    </div>

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
  margin: 0.5rem;
  /* scale: 0.5; */
  pointer-events: none;

  &#p1-collection {
    right: 0;
    bottom: 0;
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
