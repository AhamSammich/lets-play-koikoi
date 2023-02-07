<script setup lang="ts">
import { useActiveP, useScore1, useScore2 } from "~~/components/composables/game";
import { Ref } from "vue";
import {
  checkForWinOrVoid,
  getCardsInYaku,
  matchCardInArr,
  removeSetFromArr,
} from "~~/assets/scripts/match";

const emits = defineEmits(["match-select", "deck-draw", "next-round"]);

const hand: Record<string, Ref<string[]>> = { p1: ref([]), p2: ref([]), field: ref([]) };
const match: Ref<string[]> = ref([]);
const draw: Ref<boolean | null> = ref(false);

const collection: Record<string, string[]> = reactive({
  p1: <string[]>[],
  p2: <string[]>[],
});
const yaku1: Ref<Dict> = ref({});
const yaku2: Ref<Dict> = ref({});
const newYaku: Ref<MultiDict> = ref({});

const winningYaku: Ref<Dict | null> = ref({});
const winner: Ref<string | null> = ref("");

const scoreboard: Record<string, Ref<number>> = { p1: useScore1(), p2: useScore2() };
const selectedCard = ref("");
const activeP = useActiveP();

const activeHand = () => hand[activeP.value];
let WAIT = false;
let calledKoiKoi = "";

async function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resetRefs() {
  [hand.p1, hand.p2, hand.field, match].forEach((refVar) => (refVar.value = []));
  [yaku1, yaku2, newYaku, winningYaku].forEach((refVar) => (refVar.value = {}));
  collection.p1 = [];
  collection.p2 = [];
  winner.value = "";
  return;
}

async function newGame(score?: number) {
  if (score && winner.value) scoreboard[winner.value].value += score;
  if (winner.value) activeP.value = winner.value;
  emits("next-round");
  await resetRefs();
  selectedCard.value = "";
  calledKoiKoi = "";
  WAIT = false;
  draw.value = null; // Triggers deck reshuffle
  return;
}

async function checkForInstantYaku(checkHand: Ref<string[]>): Promise<void> {
  if (WAIT) return;
  let yaku = checkForWinOrVoid(checkHand.value);
  if (yaku === null) return;
  if (yaku && checkHand === hand.field) {
    newGame();
    return;
  }
  if (yaku) {
    if (winningYaku.value) winningYaku.value[yaku] = checkHand.value;
    winner.value = activeP.value;
    return;
  }
}

function dealFirstHands(cards: string[]): void {
  hand.p1.value = cards.slice(0, 8);
  hand.p2.value = cards.slice(8, 16);
  hand.field.value = cards.slice(16);
  [hand.p1, hand.p2, hand.field].forEach(checkForInstantYaku);
  draw.value = false;
  if (activeP.value === "p2") aiFindMatch();
}

async function setSelectedCard(cardName: string): Promise<void> {
  selectedCard.value = cardName;
  await sleep(300);
  return;
}

async function revealCard(cardName: string) {
  selectedCard.value = cardName;
  console.log(`Revealed ${selectedCard.value} from the deck.`);
  await sleep(300);
  getMatch(cardName);
  return;
}

function checkForDraw() {
  if (WAIT) return;
  selectedCard.value = "";
  draw.value = !draw.value;
  if (draw.value === true) return;
  if (activeHand().value.length === 0) {
    winningYaku.value = null;
    winner.value = null;
    return;
  }
  activeP.value = activeP.value === "p1" ? "p2" : "p1";
  console.log(`It's Player${activeHand() === hand.p1 ? "1" : "2"}'s turn...`);
  if (activeP.value === "p2") aiFindMatch();
}

function aiFindMatch() {
  let aiCard = "";
  let matchedCards: string[] = [];
  for (let card of hand.p2.value) {
    aiCard = card;
    matchedCards = matchCardInArr(card, hand.field.value);
    if (matchedCards.length) {
      console.log(`%cPlayer 2 matched ${aiCard} with ${matchedCards}`, "color: yellow;");
      break;
    }
  }
  aiSelectMatch(aiCard, matchedCards);
}

async function aiSelectMatch(cardName: string, matchedCards: string[]) {
  if (matchedCards.length === 0) {
    noMatch(cardName);
    return;
  }
  await setSelectedCard(cardName);
  if (matchedCards.length === 3) {
    // Collect all 3 matched cards from the field
    handleMatch(matchedCards);
    return;
  }
  // Select the first of 2 matches
  handleMatch(matchedCards.slice(0, 1));
  return;
}

async function getMatch(cardName: string): Promise<void> {
  await setSelectedCard(cardName);
  let matches = matchCardInArr(cardName, hand.field.value);
  if (matches.length === 0) {
    noMatch(cardName);
    return;
  }
  console.log(`Matched ${selectedCard.value} with: ${matches.join(", ")}.`);
  // All 3 cards of the same suit are on the field
  if (matches.length === 3) {
    // Add all cards to collection
    handleMatch(matches);
    return;
  }
  // AI player has 2 possible matches from the deck draw
  if (draw.value && activeP.value === "p2") {
    // Select the first match
    handleMatch(matches.slice(0, 1));
    return;
  }
  // Open modal to allow player to choose between 2 matches
  showMatch(matches);
  return;
}

function noMatch(cardName: string) {
  // Remove selected card from hand and add to field
  let thrownCard = draw.value
    ? cardName
    : activeHand().value.splice(activeHand().value.indexOf(cardName), 1)[0];
  hand.field.value.push(thrownCard);
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
  let playHand = draw.value ? hand.field : activeHand();
  let matchedCards = new Set([selectedCard.value, ...cards]);

  [hand.field.value, playHand.value] = await Promise.all<Promise<string[]>[]>([
    // Remove matched card from field
    new Promise((resolve) => {
      setTimeout(() => resolve(removeSetFromArr(matchedCards, hand.field.value)), 200);
    }),
    // Remove selected card from hand
    new Promise((resolve) => {
      setTimeout(() => resolve(removeSetFromArr(matchedCards, playHand.value)), 200);
    }),
  ]);

  let collected = await collectCards(matchedCards, activeP.value);
  if (collected) checkForDraw();
  return;
}

async function collectCards(cardSet: Set<string>, player: string): Promise<boolean> {
  try {
    collection[player] = [...collection[player], ...cardSet];
  } catch (err) {
    console.error(err);
    WAIT = true;
    return false;
  }
  selectedCard.value = "";
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}

async function showYaku(yakuNames: string[], player: string) {
  WAIT = true;
  let [yakuList, coll] =
    player === "p1" ? [yaku1, collection.p1] : [yaku2, collection.p2];
  let newList: Record<string, string[]> = {};
  yakuNames.forEach((yakuName) => {
    // Save yaku for later scoring
    newList[yakuName] = getCardsInYaku(yakuName, coll);
  });
  for (let yakuName in newList) yakuList.value[yakuName] = newList[yakuName];
  newYaku.value = { player, newList };
  return;
}

async function continueGame(bool: boolean, player: string) {
  if (player === "p2") {
    let chance = Math.floor(Math.random() * 100);
    let factor = hand.p2.value.length * 10;
    bool = chance < factor;
  }
  newYaku.value = {};
  if (!bool) {
    let yakuList = (player === "p1" ? yaku1 : yaku2).value;
    winningYaku.value = yakuList;
    winner.value = player;
    return;
  }
  calledKoiKoi = player;
  WAIT = false;
  checkForDraw();
}
</script>

<template>
  <div id="tabletop">
    <!-- TOP ROW -->
    <div id="p2-hand">
      <Hand
        :is-active="activeP === 'p2'"
        player="p2"
        :cards="hand.p2.value"
        @check-match="(cardName: string) => getMatch(cardName)"
      />
    </div>
    <template v-if="activeP === 'p2' && selectedCard && !draw">
      <div id="p2-reveal">
        <Card :name="selectedCard" />
      </div>
    </template>
    <div id="p2-collection" class="collection">
      <Collection
        player="p2"
        :cards="collection.p2"
        @new-yaku="async (yakuArr, player) => await showYaku(yakuArr, player)"
      />
    </div>

    <!-- CENTER ROW -->
    <div id="deck">
      <Deck
        :draw-card="draw"
        :ai-draw="activeP === 'p2'"
        @draw="(cardName: string) => revealCard(cardName)"
        @deal="(cards: string[]) => dealFirstHands(cards)"
      />
      <template v-if="selectedCard && draw">
        <div id="reveal">
          <Card :name="selectedCard" />
        </div>
      </template>
    </div>
    <div id="field">
      <Field :cards="hand.field.value" />
    </div>

    <!-- BOTTOM ROW -->
    <div id="p1-hand" data-msg="">
      <Hand
        :is-active="activeP === 'p1' && !draw"
        player="p1"
        :cards="hand.p1.value"
        @check-match="(cardName: string) => getMatch(cardName)"
      />
    </div>
    <div id="p1-collection" class="collection">
      <Collection
        player="p1"
        :cards="collection.p1"
        @new-yaku="async (yakuArr, player) => await showYaku(yakuArr, player)"
      />
    </div>

    <!-- MODAL -->
    <div id="match">
      <MatchSelect
        :match-src="selectedCard"
        :cards="match"
        :show-modal="match.length > 0"
        @match-select="async (cardArr: string[]) => await handleMatch(cardArr)"
      />
    </div>

    <template v-if="Object.keys(newYaku).length">
      <div id="yaku-modal">
        <NewYaku
          :show-modal="!!Object.keys(newYaku).length"
          :player="<string>newYaku.player"
          :yakuList="<Dict>newYaku.newList"
          :koikoi-allowed="!!(activeHand().value.length || draw)"
          @koi-koi="async (bool, player) => await continueGame(bool, player)"
        />
      </div>
    </template>

    <template v-if="winner !== '' && (winningYaku || winningYaku === null)">
      <div id="end-screen">
        <ScoreSheet
          :player="winner"
          :yakuList="winningYaku"
          :koikoi="!!calledKoiKoi && winner != calledKoiKoi"
          :show-modal="winner !== ''"
          @reset="(score: number) => newGame(score)"
        />
      </div>
    </template>
  </div>
</template>

<style lang="postcss">
#tabletop {
  width: 100vw;
  width: 100dvw;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: rgb(22 101 52);
  overflow: hidden;
  display: grid;
  grid-template-columns: 75px 1fr;
  grid-template-rows: minmax(75px, 150px) minmax(200px, 1fr) minmax(75px, 150px);
  grid-template-areas:
    "p2 p2"
    "deck field"
    "p1 p1";

  & > * {
    display: flex;
    align-items: center;
  }
}

#deck {
  grid-area: deck;
  transform-origin: left;
}

#reveal {
  position: absolute;
  left: 25px;
  width: max-content;
  pointer-events: none;
  animation: pickUp 0.5s 1s;
}

#p1-hand {
  grid-area: p1;
  position: relative;

  /* &::before {
    content: attr(data-msg);
    display: block;
    position: absolute;
    bottom: 45%;
    right: 25%;
    color: #eee;
    font-weight: bold;
    font-style: italic;
    animation: crawl 5s alternate infinite;
  } */
}

@keyframes crawl {
  from {
    transform: translate3d(-25%, 0, 0);
  }
  to {
    transform: translate3d(25%, 0, 0);
  }
}

#p2-hand {
  grid-area: p2;
  pointer-events: none;
  position: relative;
  margin-right: 1rem;

  & > * {
    position: absolute;
    right: 0;
    top: -50px;
    transform-origin: bottom;
  }
}

#p2-reveal {
  position: absolute;
  top: 30%;
  right: 40%;
  animation: pickUp 1s 1s;
}

@keyframes pickUp {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale(1.2) translate3d(20%, 0, 0);
  }
}

#field {
  grid-area: field;
  min-width: 350px;
  justify-self: flex-start;
  transform-origin: left;
}

@media (width < 500px) or (height < 500px) {
  #deck,
  #field {
    scale: 0.8;
  }
}

.collection {
  position: absolute;
  margin: 1rem 0.5rem;
  pointer-events: none;
  transform: scale(0.65);

  &#p1-collection {
    right: 0;
    bottom: 0;
    transform-origin: bottom right;
  }

  &#p2-collection {
    left: 0;
    top: 0;
    transform-origin: top left;
  }

  @media (orientation: portrait) {
    &#p1-collection {
      right: 0;
      bottom: 15%;
    }

    &#p2-collection {
      left: 0;
      top: 10%;
    }
  }
}

.modal {
  background: hsl(0 0% 13% / 0.9);
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: white;
  font-size: large;
  z-index: 10;
  transition: all 0.5s;

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

      &:hover {
        transform: translate3d(0, 5%, 0);
        box-shadow: 0 0.1rem 0.3rem 0 palegoldenrod;
      }
    }
  }

  & h1,
  & h2 {
    font-weight: bold;
    font-size: larger;
    text-transform: uppercase;
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
